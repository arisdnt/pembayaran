import { useEffect, useState } from 'react'
import { PageLayout } from '../../layout/PageLayout'
import { Text, Select, Button, Badge } from '@radix-ui/themes'
import { Database, RefreshCw, AlertCircle, CheckCircle, Clock, XCircle } from 'lucide-react'
import { db } from '../../offline/db'

export function SyncStatus() {
  const [items, setItems] = useState([])
  const [filter, setFilter] = useState('all')
  const [loading, setLoading] = useState(false)

  async function load() {
    setLoading(true)
    try {
      let q = db.outbox.toCollection()
      if (filter !== 'all') {
        q = db.outbox.where('status').equals(filter)
      }
      const listAll = await q.toArray()
      const list = listAll.sort((a, b) => {
        const dateA = new Date(a.created_at || 0)
        const dateB = new Date(b.created_at || 0)
        return dateB - dateA // descending (newest first)
      })
      setItems(list)
    } catch (err) {
      console.error('Error loading sync data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const timer = setInterval(load, 2000)
    return () => clearInterval(timer)
  }, [filter])

  const stats = {
    total: items.length,
    pending: items.filter(it => it.status === 'pending').length,
    syncing: items.filter(it => it.status === 'syncing').length,
    applied: items.filter(it => it.status === 'applied').length,
    error: items.filter(it => it.status === 'error').length,
  }

  const getStatusBadge = (status) => {
    const configs = {
      pending: { color: 'amber', icon: Clock, label: 'Pending' },
      syncing: { color: 'blue', icon: RefreshCw, label: 'Syncing' },
      applied: { color: 'green', icon: CheckCircle, label: 'Applied' },
      error: { color: 'red', icon: XCircle, label: 'Error' },
    }
    const config = configs[status] || configs.pending
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
      <div className="flex flex-col h-full">
        {/* Excel-style Container */}
        <div className="h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">

          {/* Toolbar Section */}
          <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100">
            <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
              {/* Filter Status */}
              <div className="flex items-center gap-2">
                <Text size="2" weight="medium" className="text-slate-600">
                  Filter:
                </Text>
                <Select.Root value={filter} onValueChange={setFilter}>
                  <Select.Trigger
                    style={{
                      borderRadius: 0,
                      minWidth: '140px',
                      height: '35px',
                      border: '1px solid #cbd5e1',
                      backgroundColor: '#ffffff'
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

              {/* Stats */}
              <div className="ml-auto flex items-center gap-1.5 text-xs font-medium">
                <div className="flex items-center gap-1.5 px-3 bg-white border border-slate-300 shadow-sm" style={{ height: '35px' }}>
                  <span className="text-slate-600">Total:</span>
                  <span className="font-bold text-slate-900">{stats.total}</span>
                </div>
                {stats.pending > 0 && (
                  <div className="flex items-center gap-1.5 px-3 bg-amber-50 border border-amber-300 shadow-sm" style={{ height: '35px' }}>
                    <span className="inline-flex h-2 w-2 rounded-full bg-amber-600" />
                    <span className="text-amber-700">Pending:</span>
                    <span className="font-bold text-amber-900">{stats.pending}</span>
                  </div>
                )}
                {stats.syncing > 0 && (
                  <div className="flex items-center gap-1.5 px-3 bg-blue-50 border border-blue-300 shadow-sm" style={{ height: '35px' }}>
                    <span className="inline-flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
                    <span className="text-blue-700">Syncing:</span>
                    <span className="font-bold text-blue-900">{stats.syncing}</span>
                  </div>
                )}
                {stats.applied > 0 && (
                  <div className="flex items-center gap-1.5 px-3 bg-green-50 border border-green-300 shadow-sm" style={{ height: '35px' }}>
                    <span className="inline-flex h-2 w-2 rounded-full bg-green-600" />
                    <span className="text-green-700">Applied:</span>
                    <span className="font-bold text-green-900">{stats.applied}</span>
                  </div>
                )}
                {stats.error > 0 && (
                  <div className="flex items-center gap-1.5 px-3 bg-red-50 border border-red-300 shadow-sm" style={{ height: '35px' }}>
                    <span className="inline-flex h-2 w-2 rounded-full bg-red-600" />
                    <span className="text-red-700">Error:</span>
                    <span className="font-bold text-red-900">{stats.error}</span>
                  </div>
                )}
              </div>

              {/* Refresh Button */}
              <button
                onClick={load}
                disabled={loading}
                className="flex items-center gap-2 px-3 text-white font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  borderRadius: 0,
                  backgroundColor: '#0066cc',
                  border: '1px solid #0052a3',
                  height: '35px'
                }}
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="text-sm">Refresh</span>
              </button>
            </div>
          </div>

          {/* Table Container */}
          <div className="relative flex-1 min-h-0">
            <div className="h-full overflow-auto excel-scrollbar">
              <table className="min-w-full table-fixed text-sm border-collapse">
                <colgroup>
                  <col style={{ width: '14.28%' }} />
                  <col style={{ width: '14.28%' }} />
                  <col style={{ width: '14.28%' }} />
                  <col style={{ width: '14.28%' }} />
                  <col style={{ width: '14.28%' }} />
                  <col style={{ width: '14.28%' }} />
                  <col style={{ width: '14.32%' }} />
                </colgroup>
                <thead>
                  <tr className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10 border-b border-slate-300 shadow-sm">
                    <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                      Waktu
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
                    <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700">
                      Pesan Error
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {loading && items.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                        Memuat data...
                      </td>
                    </tr>
                  ) : items.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-4 py-12 text-center">
                        <div className="flex flex-col items-center gap-3">
                          <Database className="h-12 w-12 text-slate-300" />
                          <div>
                            <p className="text-slate-600 font-medium">
                              Tidak ada item outbox
                            </p>
                            <p className="text-slate-500 text-xs mt-1">
                              Semua perubahan telah berhasil disinkronkan
                            </p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    items.map((item, index) => (
                      <tr
                        key={item.id}
                        className={`border-b border-slate-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                        } hover:bg-blue-50 transition-colors`}
                      >
                        <td className="px-3 py-1.5 border-r border-slate-200">
                          <Text size="1" className="text-slate-700 font-mono text-[0.7rem] whitespace-nowrap">
                            {new Date(item.created_at).toLocaleString('id-ID', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit',
                            })}
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
        </div>

        {/* Excel-style scrollbar */}
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
    </PageLayout>
  )
}

export default SyncStatus
