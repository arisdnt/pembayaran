import { useCallback, useEffect, useMemo, useState } from 'react'
import { PageLayout } from '../../layout/PageLayout'
import { Text, Select, Button, Badge, Dialog, TextField } from '@radix-ui/themes'
import {
  Database,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
  Activity,
  BarChart3,
  Server,
  Search,
} from 'lucide-react'
import { db, syncRegistry } from '../../offline/db'
import { useOffline } from '../../contexts/OfflineContext'

const STATUS_ORDER = ['pending', 'syncing', 'applied', 'error']

const statusBadgeConfig = {
  pending: { color: 'amber', icon: Clock, label: 'Pending' },
  syncing: { color: 'blue', icon: RefreshCw, label: 'Syncing' },
  applied: { color: 'green', icon: CheckCircle, label: 'Applied' },
  error: { color: 'red', icon: XCircle, label: 'Error' },
}

function formatDateTime(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch (err) {
    console.warn('Invalid date value provided to formatDateTime', value, err)
    return value
  }
}

function getPayloadSummary(payload) {
  if (!payload) return 'Tidak ada payload'
  const keys = Object.keys(payload || {})
  if (!keys.length) return 'Payload kosong'
  const sample = keys.slice(0, 3).join(', ')
  return keys.length > 3 ? `${sample} +${keys.length - 3}` : sample
}

export function SyncStatus() {
  const { status: offlineStatus } = useOffline()
  const [allItems, setAllItems] = useState([])
  const [syncStates, setSyncStates] = useState([])
  const [loading, setLoading] = useState(false)
  const [statusFilter, setStatusFilter] = useState('all')
  const [tableFilter, setTableFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedItem, setSelectedItem] = useState(null)

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
        } catch {}
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

  const topTroubledTables = useMemo(
    () => tableInsights.filter((entry) => entry.pending > 0 || entry.error > 0).slice(0, 3),
    [tableInsights]
  )

  const getStatusBadge = (status) => {
    const config = statusBadgeConfig[status] || statusBadgeConfig.pending
    const Icon = config.icon
    return (
      <Badge variant="solid" color={config.color} style={{ borderRadius: 0 }} className="text-[0.65rem] font-semibold px-1.5 py-0.5">
        <Icon className="h-2.5 w-2.5 inline mr-1" />
        {config.label}
      </Badge>
    )
  }

  return (
    <PageLayout>
      <div className="flex flex-col h-full gap-4">
        <div className="border-2 border-slate-300 bg-white shadow-lg flex-1 flex flex-col min-h-0">
          <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 flex-shrink-0">
            <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Text size="2" weight="medium" className="text-slate-600">
                  Status:
                </Text>
                <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
                  <Select.Trigger
                    style={{
                      borderRadius: 0,
                      minWidth: '140px',
                      height: '35px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                    }}
                    className="cursor-pointer font-sans"
                  />
                  <Select.Content style={{ borderRadius: 0 }}>
                    <Select.Item value="all">📋 Semua</Select.Item>
                    <Select.Item value="pending">⏳ Pending</Select.Item>
                    <Select.Item value="syncing">🔄 Syncing</Select.Item>
                    <Select.Item value="applied">✅ Applied</Select.Item>
                    <Select.Item value="error">❌ Error</Select.Item>
                  </Select.Content>
                </Select.Root>
              </div>

              <div className="flex items-center gap-2">
                <Text size="2" weight="medium" className="text-slate-600">
                  Tabel:
                </Text>
                <Select.Root value={tableFilter} onValueChange={setTableFilter}>
                  <Select.Trigger
                    style={{
                      borderRadius: 0,
                      minWidth: '160px',
                      height: '35px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff',
                    }}
                    className="cursor-pointer font-sans"
                  />
                  <Select.Content style={{ borderRadius: 0 }}>
                    {tableOptions.map((table) => (
                      <Select.Item key={table} value={table}>
                        {table === 'all' ? '📁 Semua Tabel' : table}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </div>

              <div className="flex items-center gap-2 min-w-[220px]">
                <Text size="2" weight="medium" className="text-slate-600">
                  Cari:
                </Text>
                <TextField.Root
                  placeholder="PK, error, atau isi payload"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  size="2"
                  style={{
                    borderRadius: 0,
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                  }}
                  className="font-sans"
                >
                  <TextField.Slot>
                    <Search className="h-4 w-4 text-slate-500" />
                  </TextField.Slot>
                  {searchTerm && (
                    <TextField.Slot>
                      <button
                        onClick={() => setSearchTerm('')}
                        type="button"
                        className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
                      >
                        ×
                      </button>
                    </TextField.Slot>
                  )}
                </TextField.Root>
              </div>

              <div className="ml-auto flex items-center gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 px-3 bg-white border border-slate-300 shadow-sm" style={{ height: '35px' }}>
                  <span>Menampilkan:</span>
                  <span className="font-bold text-slate-900">{filteredStats.total}</span>
                </div>
              </div>

              <button
                onClick={load}
                disabled={loading}
                className="flex items-center gap-2 px-3 text-white font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderRadius: 0,
                  backgroundColor: '#0066cc',
                  border: '1px solid #0052a3',
                  height: '35px',
                }}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>

          <div className="flex-1 min-h-0 overflow-auto excel-scrollbar">
            <table className="min-w-full table-fixed text-sm border-collapse">
                <colgroup>
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '14%' }} />
                  <col style={{ width: '10%' }} />
                  <col style={{ width: '8%' }} />
                  <col style={{ width: '12%' }} />
                  <col style={{ width: '20%' }} />
                  <col style={{ width: '10%' }} />
                </colgroup>
                <thead>
                  <tr className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10 border-b border-slate-300 shadow-sm">
                    <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                      Waktu Antrean
                    </th>
                    <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                      Tabel
                    </th>
                    <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                      Operasi
                    </th>
                    <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                      Primary Key
                    </th>
                    <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                      Percobaan
                    </th>
                    <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                      Terakhir Dicoba
                    </th>
                    <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                      Ringkasan Payload
                    </th>
                    <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700">
                      Pesan Error
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-12 text-center text-slate-500">
                        Memuat data...
                      </td>
                    </tr>
                  ) : filteredItems.length === 0 ? (
                    <tr>
                      <td colSpan="9" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Database className="h-12 w-12 text-slate-300" />
                          <div>
                            <p className="text-slate-600 font-medium">
                              Tidak ada item sesuai filter
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              Sesuaikan filter atau cari kata kunci lain
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredItems.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`border-b border-slate-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="px-3 py-1.5 border-r border-slate-200">
                          <Text size="1" className="text-slate-700 font-mono text-[0.7rem] whitespace-nowrap">
                            {formatDateTime(item.created_at)}
                          </Text>
                        </td>
                        <td className="px-3 py-1.5 border-r border-slate-200">
                          <Text size="1" weight="medium" className="text-slate-900 font-mono text-[0.7rem]">
                            {item.table}
                          </Text>
                        </td>
                        <td className="px-3 py-1.5 border-r border-slate-200">
                          <Badge
                            variant="soft"
                            color={item.op === 'insert' ? 'blue' : item.op === 'update' ? 'amber' : 'red'}
                            style={{ borderRadius: 0 }}
                            className="text-[0.65rem] font-semibold uppercase px-1.5 py-0.5"
                          >
                            {item.op}
                          </Badge>
                        </td>
                        <td className="px-3 py-1.5 border-r border-slate-200">
                          <Text size="1" className="text-slate-700 font-mono text-[0.7rem] truncate block" title={item.pk}>
                            {item.pk}
                          </Text>
                        </td>
                        <td className="px-3 py-1.5 border-r border-slate-200">
                          {getStatusBadge(item.status)}
                        </td>
                        <td className="px-3 py-1.5 border-r border-slate-200 text-center">
                          <Badge
                            variant="soft"
                            color={item.attempts > 3 ? 'red' : 'gray'}
                            style={{ borderRadius: 0 }}
                            className="text-[0.65rem] font-bold px-1.5 py-0.5"
                          >
                            {item.attempts}
                          </Badge>
                        </td>
                        <td className="px-3 py-1.5 border-r border-slate-200">
                          <Text size="1" className="text-slate-700 font-mono text-[0.7rem] whitespace-nowrap">
                            {item.last_attempt_at ? formatDateTime(item.last_attempt_at) : '—'}
                          </Text>
                        </td>
                        <td className="px-3 py-1.5 border-r border-slate-200">
                          <div className="flex items-center gap-2">
                            <Text
                              size="1"
                              className="text-slate-600 font-mono text-[0.7rem] truncate max-w-[180px]"
                              title={item.payload ? JSON.stringify(item.payload) : 'Tidak ada payload'}
                            >
                              {getPayloadSummary(item.payload)}
                            </Text>
                            <button
                              onClick={() => setSelectedItem(item)}
                              className="text-xs text-blue-600 underline hover:text-blue-800"
                              type="button"
                            >
                              Detail
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-1.5">
                          {item.error_message ? (
                            <Text size="1" className="text-red-600 font-mono text-[0.7rem] truncate block" title={item.error_message}>
                              {item.error_message}
                            </Text>
                          ) : (
                            <Text size="1" className="text-slate-400">
                              —
                            </Text>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
            </table>
          </div>
        </div>

        <style>{`
          .excel-scrollbar::-webkit-scrollbar {
            width: 16px;
            height: 16px;
          }

          .excel-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-left: 1px solid #cbd5e1;
            border-top: 1px solid #cbd5e1;
          }

          .excel-scrollbar::-webkit-scrollbar-thumb {
            background: #94a3b8;
            border: 3px solid #f1f5f9;
          }

          .excel-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }

          .excel-scrollbar::-webkit-scrollbar-corner {
            background: #f1f5f9;
          }
        `}</style>
      </div>

      <Dialog.Root open={!!selectedItem} onOpenChange={(open) => !open && setSelectedItem(null)}>
        <Dialog.Content
          style={{
            maxWidth: '640px',
            width: '95vw',
            padding: 0,
            borderRadius: 0,
            overflow: 'hidden',
          }}
          className="border-2 border-slate-300 shadow-2xl"
        >
          {selectedItem && (
            <div className="bg-white">
              <div className="flex items-center justify-between border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
                <Text size="2" weight="medium" className="text-slate-700">
                  Payload
                </Text>
                <Dialog.Close asChild>
                  <button
                    className="flex h-6 w-6 items-center justify-center text-slate-500 hover:text-slate-700"
                    aria-label="Tutup"
                    type="button"
                  >
                    ×
                  </button>
                </Dialog.Close>
              </div>
              <div className="p-5">
                <div className="max-h-96 overflow-auto border border-slate-200 bg-slate-900 text-slate-100 p-3 text-[0.7rem] leading-relaxed">
                  <pre className="whitespace-pre-wrap break-words">
                    {selectedItem.payload ? JSON.stringify(selectedItem.payload, null, 2) : 'Tidak ada payload'}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </Dialog.Content>
      </Dialog.Root>
    </PageLayout>
  )
}

export default SyncStatus
