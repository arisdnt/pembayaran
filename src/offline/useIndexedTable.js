import { useLiveQuery } from 'dexie-react-hooks'
import { db } from './db'

// Simple live reader for a table with optional sort and map
export function useIndexedTable(table, { where, orderBy, map, filter } = {}) {
  const data = useLiveQuery(async () => {
    let coll = db.table(table)
    if (where && typeof where === 'function') {
      const all = await coll.toArray()
      return all.filter(where)
    }
    if (orderBy) {
      try {
        const c = await coll.orderBy(orderBy).toArray()
        return c
      } catch {
        return coll.toArray()
      }
    }
    return coll.toArray()
  }, [table, where && where.toString(), orderBy])

  const processed = (data || [])
    .filter((x) => (filter ? filter(x) : true))
    .map((x) => (map ? map(x) : x))

  return {
    data: processed,
    loading: data === undefined,
  }
}

