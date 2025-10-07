import { useCallback, useEffect, useMemo, useState } from 'react'
import { db, syncRegistry } from '../../../offline/db'

export function useSyncStatusData() {
  const [allItems, setAllItems] = useState([])
  const [syncStates, setSyncStates] = useState([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [tableFilter, setTableFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [outboxEntries, syncMeta] = await Promise.all([
        db.outbox.toArray(),
        db.sync_state.toArray(),
      ])

      const sortedOutbox = outboxEntries.sort((a, b) => {
        const dateA = new Date(a.created_at || 0)
        const dateB = new Date(b.created_at || 0)
        return dateB - dateA
      })

      setAllItems(sortedOutbox)
      setSyncStates(syncMeta)
    } catch (err) {
      console.error('Error loading sync data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let disposed = false
    load()
    const timer = setInterval(() => {
      if (!disposed) load()
    }, 4000)
    return () => {
      disposed = true
      clearInterval(timer)
    }
  }, [load])

  const globalStats = useMemo(() => {
    const counts = {
      total: allItems.length,
      pending: 0,
      syncing: 0,
      applied: 0,
      error: 0,
      lastQueuedAt: null,
      lastUpdatedAt: null,
    }

    for (const item of allItems) {
      const status = item.status || 'pending'
      if (counts[status] !== undefined) counts[status] += 1
      const createdAt = item.created_at || item.updated_at
      if (createdAt && (!counts.lastQueuedAt || createdAt > counts.lastQueuedAt)) {
        counts.lastQueuedAt = createdAt
      }
      if (item.updated_at && (!counts.lastUpdatedAt || item.updated_at > counts.lastUpdatedAt)) {
        counts.lastUpdatedAt = item.updated_at
      }
    }

    return counts
  }, [allItems])

  const syncStateByTable = useMemo(() => {
    const map = new Map()
    for (const row of syncStates) {
      if (row.table) map.set(row.table, row)
    }
    return map
  }, [syncStates])

  const tableOptions = useMemo(() => {
    const set = new Set(Object.keys(syncRegistry))
    for (const item of allItems) {
      if (item.table) set.add(item.table)
    }
    return ['all', ...Array.from(set).sort()]
  }, [allItems])

  const filteredItems = useMemo(() => {
    const trimmedSearch = searchTerm.trim().toLowerCase()
    return allItems.filter((item) => {
      if (statusFilter !== 'all' && item.status !== statusFilter) return false
      if (tableFilter !== 'all' && item.table !== tableFilter) return false

      if (!trimmedSearch) return true

      const haystacks = [item.table, item.pk, item.error_message]
      if (item.payload) {
        try {
          haystacks.push(JSON.stringify(item.payload))
        } catch {
          // Ignore JSON stringify errors
        }
      }

      return haystacks
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(trimmedSearch))
    })
  }, [allItems, searchTerm, statusFilter, tableFilter])

  const filteredStats = useMemo(() => {
    const counts = {
      total: filteredItems.length,
      pending: 0,
      syncing: 0,
      applied: 0,
      error: 0,
    }
    for (const item of filteredItems) {
      const status = item.status || 'pending'
      if (counts[status] !== undefined) counts[status] += 1
    }
    return counts
  }, [filteredItems])

  const tableInsights = useMemo(() => {
    const base = new Map()

    const ensureEntry = (table) => {
      if (!base.has(table)) {
        base.set(table, {
          table,
          total: 0,
          pending: 0,
          syncing: 0,
          applied: 0,
          error: 0,
          lastQueuedAt: null,
          lastAttemptAt: null,
        })
      }
      return base.get(table)
    }

    for (const table of Object.keys(syncRegistry)) {
      ensureEntry(table)
    }

    for (const item of allItems) {
      const entry = ensureEntry(item.table || 'unknown')
      entry.total += 1
      const status = item.status || 'pending'
      if (entry[status] !== undefined) entry[status] += 1
      const createdAt = item.created_at || item.updated_at
      if (createdAt && (!entry.lastQueuedAt || createdAt > entry.lastQueuedAt)) {
        entry.lastQueuedAt = createdAt
      }
      if (item.last_attempt_at && (!entry.lastAttemptAt || item.last_attempt_at > entry.lastAttemptAt)) {
        entry.lastAttemptAt = item.last_attempt_at
      }
    }

    return Array.from(base.values())
      .map((entry) => {
        const syncMeta = syncStateByTable.get(entry.table)
        return {
          ...entry,
          lastFullLoad: syncMeta?.last_full_load || null,
          lastIncremental: syncMeta?.last_incremental_at || null,
        }
      })
      .sort((a, b) => {
        if (b.pending !== a.pending) return b.pending - a.pending
        if (b.error !== a.error) return b.error - a.error
        return b.total - a.total
      })
  }, [allItems, syncStateByTable])

  return {
    allItems,
    filteredItems,
    loading,
    statusFilter,
    setStatusFilter,
    tableFilter,
    setTableFilter,
    searchTerm,
    setSearchTerm,
    globalStats,
    filteredStats,
    tableOptions,
    tableInsights,
    load,
  }
}
