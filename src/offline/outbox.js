import { db, getUpdatedAtColumn, syncRegistry } from './db'
import { customAlphabet } from 'nanoid'

function nowISO() {
  return new Date().toISOString()
}

function ensureId(row) {
  if (!row.id) {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) return { ...row, id: crypto.randomUUID() }
    const nanoid = customAlphabet('1234567890abcdef', 32)
    return { ...row, id: nanoid() }
  }
  return row
}

async function touchUpdatedAt(table, rowOrPatch) {
  const updatedAtCol = getUpdatedAtColumn(table)
  if (!updatedAtCol) return rowOrPatch
  return { ...rowOrPatch, [updatedAtCol]: nowISO() }
}

export async function enqueueInsert(table, row) {
  const rowWithId = ensureId(row)
  const payload = await touchUpdatedAt(table, rowWithId)

  // Optimistically apply to local table
  await db[table].put(payload)

  // Record in outbox
  const ob = {
    id: crypto?.randomUUID?.() ? crypto.randomUUID() : `${table}:${payload.id}`,
    table,
    op: 'insert',
    pk: payload.id,
    payload,
    status: 'pending',
    attempts: 0,
    error_message: null,
    created_at: nowISO(),
    updated_at: nowISO(),
    last_attempt_at: null,
  }
  await db.outbox.put(ob)
  return payload
}

export async function enqueueUpdate(table, pk, patch) {
  const payload = await touchUpdatedAt(table, patch)

  // Optimistic update
  const existing = await db[table].get(pk)
  await db[table].put({ ...(existing || { id: pk }), ...payload })

  const ob = {
    id: crypto?.randomUUID?.() ? crypto.randomUUID() : `${table}:${pk}:${Date.now()}`,
    table,
    op: 'update',
    pk,
    payload,
    status: 'pending',
    attempts: 0,
    error_message: null,
    created_at: nowISO(),
    updated_at: nowISO(),
    last_attempt_at: null,
  }
  await db.outbox.put(ob)
  return { id: pk, ...payload }
}

export async function enqueueDelete(table, pk) {
  // Optimistic delete from local
  await db[table].delete(pk)

  const ob = {
    id: crypto?.randomUUID?.() ? crypto.randomUUID() : `${table}:${pk}:del:${Date.now()}`,
    table,
    op: 'delete',
    pk,
    payload: null,
    status: 'pending',
    attempts: 0,
    error_message: null,
    created_at: nowISO(),
    updated_at: nowISO(),
    last_attempt_at: null,
  }
  await db.outbox.put(ob)
  return { id: pk }
}

export async function listOutbox(filter = {}) {
  let c = db.outbox.orderBy('created_at')
  if (filter.status) {
    c = (await db.outbox.where('status').equals(filter.status).toArray()).sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    )
    return c
  }
  return c.toArray()
}

export async function retryOutboxItem(id) {
  await db.outbox.update(id, {
    status: 'pending',
    error_message: null,
    updated_at: nowISO(),
    last_attempt_at: null,
  })
}

export async function retryAllErrorOutbox() {
  const errors = await db.outbox.where('status').equals('error').toArray()
  for (const item of errors) {
    await retryOutboxItem(item.id)
  }
}
