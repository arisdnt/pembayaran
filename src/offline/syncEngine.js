import { db, getUpdatedAtColumn, isFullLoadOnly, syncRegistry } from './db'
import { enqueueInsert, enqueueUpdate, enqueueDelete } from './outbox'
import { supabase } from '../lib/supabaseClient'

const PAGE_SIZE = 1000

let channels = []
let channelStates = new Map()
let outboxTimer = null
let status = {
  realtime: 'disconnected',
  syncing: false,
  lastSyncAt: null,
  lastError: null,
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

async function fetchAllRows(table, select = '*') {
  let from = 0
  let all = []
  while (true) {
    const to = from + PAGE_SIZE - 1
    const { data, error, count } = await supabase
      .from(table)
      .select(select)
      .range(from, to)

    if (error) throw error
    if (!data || data.length === 0) break
    all = all.concat(data)
    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }
  return all
}

async function fetchIncremental(table, updatedAt, sinceISO) {
  let from = 0
  let all = []
  while (true) {
    const to = from + PAGE_SIZE - 1
    let query = supabase.from(table).select('*').order(updatedAt, { ascending: true })
    if (sinceISO) query = query.gt(updatedAt, sinceISO)
    const { data, error } = await query.range(from, to)
    if (error) throw error
    if (!data || data.length === 0) break
    all = all.concat(data)
    if (data.length < PAGE_SIZE) break
    from += PAGE_SIZE
  }
  return all
}

async function hydrateTable(table) {
  const updatedAt = getUpdatedAtColumn(table)
  const state = (await db.sync_state.get(table)) || { table }
  let rows = []
  if (!state.last_full_load) {
    rows = await fetchAllRows(table)
    await db.table(table).clear()
    await db.table(table).bulkPut(rows)
    state.last_full_load = new Date().toISOString()
    if (updatedAt) {
      const max = rows.reduce((acc, r) => {
        const t = r[updatedAt]
        return t && (!acc || t > acc) ? t : acc
      }, null)
      state.last_incremental_at = max || state.last_full_load
    }
    await db.sync_state.put(state)
    return
  }

  if (isFullLoadOnly(table) || !updatedAt) {
    rows = await fetchAllRows(table)
    await db.table(table).clear()
    await db.table(table).bulkPut(rows)
    state.last_full_load = new Date().toISOString()
    await db.sync_state.put(state)
    return
  }

  // incremental
  rows = await fetchIncremental(table, updatedAt, state.last_incremental_at)
  if (rows.length) {
    await db.table(table).bulkPut(rows)
    const max = rows.reduce((acc, r) => {
      const t = r[updatedAt]
      return t && (!acc || t > acc) ? t : acc
    }, state.last_incremental_at || null)
    state.last_incremental_at = max || new Date().toISOString()
    await db.sync_state.put(state)
  }
}

function onRealtimeEvent(table) {
  return async (payload) => {
    try {
      const { eventType, new: newRow, old: oldRow } = payload
      if (eventType === 'INSERT') {
        await db.table(table).put(newRow)
      } else if (eventType === 'UPDATE') {
        await db.table(table).put(newRow)
      } else if (eventType === 'DELETE') {
        const pk = oldRow?.id
        if (pk) await db.table(table).delete(pk)
      }
    } catch (err) {
      console.error('[RealtimeSync]', table, err)
    }
  }
}

async function startRealtime() {
  // Clean previous
  for (const ch of channels) {
    try { supabase.removeChannel(ch) } catch {}
  }
  channels = []
  channelStates = new Map()

  const tables = Object.keys(syncRegistry)
  for (const table of tables) {
    const channelName = `realtime-${table}`
    const ch = supabase
      .channel(channelName)
      .on('postgres_changes', { event: '*', schema: 'public', table }, onRealtimeEvent(table))
      .subscribe((st) => {
        // Track per-channel connection state, consider online if any is connected
        const isConnected = st === 'SUBSCRIBED'
        channelStates.set(channelName, isConnected)
        const anyConnected = Array.from(channelStates.values()).some(Boolean)
        status.realtime = anyConnected ? 'connected' : 'disconnected'
      })
    channels.push(ch)
  }
}

async function applyOutboxItem(item) {
  const { table, op, pk, payload } = item
  let resp
  if (op === 'insert') {
    resp = await supabase.from(table).insert(payload)
  } else if (op === 'update') {
    resp = await supabase.from(table).update(payload).eq('id', pk)
  } else if (op === 'delete') {
    resp = await supabase.from(table).delete().eq('id', pk)
  }
  if (resp?.error) throw resp.error
}

async function processOutboxOnce() {
  // Skip processing when clear offline to avoid noisy network errors
  if (typeof navigator !== 'undefined' && navigator.onLine === false) {
    return
  }
  const pending = await db.outbox.where('status').equals('pending').sortBy('created_at')
  for (const item of pending) {
    try {
      await db.outbox.update(item.id, { status: 'syncing', attempts: item.attempts + 1, last_attempt_at: new Date().toISOString() })
      await applyOutboxItem(item)
      await db.outbox.update(item.id, { status: 'applied', updated_at: new Date().toISOString() })
    } catch (err) {
      const errorMsg = err.message || String(err)
      
      // Rollback optimistic update for duplicate key errors
      if (errorMsg.includes('duplicate key') || errorMsg.includes('unique constraint')) {
        console.warn('[Outbox] Duplicate key detected, rolling back:', item.table, item.pk)
        
        // For INSERT operations, remove the optimistically added record
        if (item.op === 'insert' && item.pk) {
          try {
            await db.table(item.table).delete(item.pk)
            console.log('[Outbox] Rolled back optimistic insert for:', item.table, item.pk)
          } catch (rollbackErr) {
            console.error('[Outbox] Rollback failed:', rollbackErr)
          }
        }
      }
      
      await db.outbox.update(item.id, { status: 'error', error_message: errorMsg, updated_at: new Date().toISOString() })
    }
  }
}

function scheduleOutboxProcessor() {
  if (outboxTimer) clearInterval(outboxTimer)
  outboxTimer = setInterval(() => {
    processOutboxOnce().catch((e) => console.error('[Outbox] process error', e))
  }, 4000)
}

export async function startBackgroundSync() {
  status.syncing = true
  try {
    const tables = Object.keys(syncRegistry)

    // OPTIMIZED: Prioritize critical tables for faster initial render
    const criticalTables = ['siswa', 'kelas', 'tahun_ajaran', 'riwayat_kelas_siswa']
    const secondaryTables = tables.filter(t => !criticalTables.includes(t))

    console.log('[SyncEngine] Phase 1: Syncing critical tables for initial render')
    // Phase 1: Load critical tables sequentially to minimize blocking
    for (const table of criticalTables) {
      if (syncRegistry[table]) {
        await hydrateTable(table)
      }
    }

    console.log('[SyncEngine] Phase 2: Syncing secondary tables in background')
    // Phase 2: Load secondary tables in parallel (non-blocking)
    const secondaryPromises = secondaryTables.map(table =>
      hydrateTable(table).catch(err => {
        console.error(`[SyncEngine] Error syncing ${table}:`, err)
        return null // Don't fail the entire sync if one table fails
      })
    )

    // Start realtime immediately after critical tables
    await startRealtime()
    scheduleOutboxProcessor()
    status.lastSyncAt = new Date().toISOString()
    status.lastError = null

    // Wait for secondary tables to finish in background
    Promise.all(secondaryPromises)
      .then(() => {
        console.log('[SyncEngine] All tables synced successfully')
        status.lastSyncAt = new Date().toISOString()
      })
      .catch(err => {
        console.error('[SyncEngine] Some secondary tables failed to sync:', err)
      })

  } catch (err) {
    status.lastError = err.message
    console.error('[SyncEngine] init error', err)
  } finally {
    status.syncing = false
  }
}

export function getSyncStatus() {
  return { ...status }
}

export function stopBackgroundSync() {
  for (const ch of channels) {
    try { supabase.removeChannel(ch) } catch {}
  }
  channels = []
  if (outboxTimer) clearInterval(outboxTimer)
  outboxTimer = null
}
