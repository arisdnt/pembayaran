import { Text, Badge } from '@radix-ui/themes'
import { Database, RotateCcw, Trash2, Copy, Check } from 'lucide-react'
import { statusBadgeConfig, formatDateTime, getPayloadSummary } from '../utils/syncHelpers'

export function SyncStatusTable({
  filteredItems,
  loading,
  retrying,
  deletingId,
  copiedErrorId,
  onRetryItem,
  onDeleteItem,
  onCopyError,
  onShowDetail,
}) {
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
    <div className="flex-1 min-h-0 overflow-auto excel-scrollbar">
      <table className="w-full table-fixed text-sm border-collapse">
        <colgroup>
          <col style={{ width: '11%' }} />
          <col style={{ width: '8%' }} />
          <col style={{ width: '7%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '9%' }} />
          <col style={{ width: '7%' }} />
          <col style={{ width: '11%' }} />
          <col style={{ width: '15%' }} />
          <col style={{ width: '14%' }} />
          <col style={{ width: '8%' }} />
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
            <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
              Pesan Error
            </th>
            <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700">
              Aksi
            </th>
          </tr>
        </thead>
        <tbody>
          {loading && filteredItems.length === 0 ? (
            <tr>
              <td colSpan="10" className="px-4 py-12 text-center text-slate-500">
                Memuat data...
              </td>
            </tr>
          ) : filteredItems.length === 0 ? (
            <tr>
              <td colSpan="10" className="px-4 py-12 text-center">
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
                  <Text size="1" className="text-slate-700 font-mono text-[0.7rem] whitespace-nowrap overflow-hidden text-ellipsis block" title={formatDateTime(item.created_at)}>
                    {formatDateTime(item.created_at)}
                  </Text>
                </td>
                <td className="px-3 py-1.5 border-r border-slate-200">
                  <Text size="1" weight="medium" className="text-slate-900 font-mono text-[0.7rem] truncate block" title={item.table}>
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
                  <Text size="1" className="text-slate-700 font-mono text-[0.7rem] whitespace-nowrap overflow-hidden text-ellipsis block" title={item.last_attempt_at ? formatDateTime(item.last_attempt_at) : '—'}>
                    {item.last_attempt_at ? formatDateTime(item.last_attempt_at) : '—'}
                  </Text>
                </td>
                <td className="px-3 py-1.5 border-r border-slate-200">
                  <div className="flex items-center gap-1 min-w-0">
                    <Text
                      size="1"
                      className="text-slate-600 font-mono text-[0.7rem] truncate flex-1 min-w-0"
                      title={item.payload ? JSON.stringify(item.payload) : 'Tidak ada payload'}
                    >
                      {getPayloadSummary(item.payload)}
                    </Text>
                    <button
                      onClick={() => onShowDetail(item)}
                      className="text-xs text-blue-600 underline hover:text-blue-800 flex-shrink-0 whitespace-nowrap"
                      type="button"
                    >
                      Detail
                    </button>
                  </div>
                </td>
                <td className="px-3 py-1.5 border-r border-slate-200">
                  {item.error_message ? (
                    <div className="flex items-center gap-1 min-w-0">
                      <Text size="1" className="text-red-600 font-mono text-[0.7rem] truncate block overflow-hidden text-ellipsis flex-1 min-w-0" title={item.error_message}>
                        {item.error_message}
                      </Text>
                      <button
                        onClick={() => onCopyError(item.error_message, item.id)}
                        className="p-1 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-300 hover:border-blue-300 transition-colors flex-shrink-0"
                        style={{ borderRadius: 0 }}
                        title="Copy error message"
                        type="button"
                      >
                        {copiedErrorId === item.id ? (
                          <Check className="h-3 w-3 text-green-600" />
                        ) : (
                          <Copy className="h-3 w-3" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <Text size="1" className="text-slate-400 truncate block">
                      —
                    </Text>
                  )}
                </td>
                <td className="px-3 py-1.5">
                  <div className="flex items-center justify-center gap-1 flex-nowrap">
                    {(item.status === 'error' || item.status === 'pending') && (
                      <>
                        <button
                          onClick={() => onRetryItem(item.id)}
                          disabled={retrying}
                          className="p-1 text-blue-600 hover:bg-blue-50 border border-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                          style={{ borderRadius: 0 }}
                          title="Retry item ini"
                        >
                          <RotateCcw className={`h-3.5 w-3.5 ${retrying ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                          onClick={() => onDeleteItem(item.id)}
                          disabled={deletingId === item.id}
                          className="p-1 text-red-600 hover:bg-red-50 border border-red-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                          style={{ borderRadius: 0 }}
                          title="Hapus item ini"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                    {(item.status === 'applied' || item.status === 'syncing') && (
                      <Text size="1" className="text-slate-400 text-[0.65rem] truncate">
                        {item.status === 'syncing' ? 'Syncing...' : '—'}
                      </Text>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
