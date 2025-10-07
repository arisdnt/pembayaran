import { Text, Select, TextField } from '@radix-ui/themes'
import { Search, RefreshCw, RotateCcw } from 'lucide-react'

export function FilterControls({
  statusFilter,
  setStatusFilter,
  tableFilter,
  setTableFilter,
  searchTerm,
  setSearchTerm,
  tableOptions,
  filteredStats,
  globalStats,
  loading,
  retrying,
  onRefresh,
  onRetryAll,
}) {
  return (
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
          onClick={onRetryAll}
          disabled={retrying || globalStats.error === 0}
          className="flex items-center gap-2 px-3 text-white font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            borderRadius: 0,
            backgroundColor: '#dc2626',
            border: '1px solid #b91c1c',
            height: '35px',
          }}
          title={globalStats.error === 0 ? 'Tidak ada error untuk di-retry' : 'Retry semua item yang error'}
        >
          <RotateCcw className={`h-4 w-4 ${retrying ? 'animate-spin' : ''}`} />
          <span className="text-sm">Retry All ({globalStats.error})</span>
        </button>

        <button
          onClick={onRefresh}
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
  )
}
