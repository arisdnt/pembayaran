import { Text, Select, TextField } from '@radix-ui/themes'
import { Search, RefreshCw, RotateCcw, ListFilter, CheckCircle, XCircle, Clock, Layers, X } from 'lucide-react'

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
  const handleReset = () => {
    setStatusFilter('all')
    setTableFilter('all')
    setSearchTerm('')
  }
  const hasActiveFilters = Boolean(searchTerm.trim() || statusFilter !== 'all' || tableFilter !== 'all')

  return (
    <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 flex-shrink-0">
      <div
        className="grid items-center gap-2 px-4 py-2.5"
        style={{
          gridTemplateColumns: 'repeat(10, calc((100% - (9 * 0.5rem)) / 10))',
          gap: '0.5rem',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box'
        }}
      >
        {/* Kolom 1: Search */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <TextField.Root
            placeholder="PK, error, atau isi payload"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="2"
            style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', height: '36px' }}
            className="font-sans w-full"
          >
            <TextField.Slot>
              <Search className="h-4 w-4 text-slate-500" />
            </TextField.Slot>
            {searchTerm && (
              <TextField.Slot>
                <button onClick={() => setSearchTerm('')} type="button" className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0">
                  ×
                </button>
              </TextField.Slot>
            )}
          </TextField.Root>
        </div>

        {/* Kolom 2: Status */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Select.Root value={statusFilter} onValueChange={setStatusFilter}>
            <Select.Trigger style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', width: '100%', height: '36px' }} className="cursor-pointer font-sans truncate text-sm px-2" />
            <Select.Content style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }}>
              <Select.Item value="all" className="cursor-pointer hover:bg-slate-100">
                <span className="flex items-center gap-2"><ListFilter className="h-3.5 w-3.5 text-slate-600" /><span>Semua</span></span>
              </Select.Item>
              <Select.Item value="pending" className="cursor-pointer hover:bg-slate-100">
                <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5 text-amber-600" /><span>Pending</span></span>
              </Select.Item>
              <Select.Item value="syncing" className="cursor-pointer hover:bg-slate-100">
                <span className="flex items-center gap-2"><RefreshCw className="h-3.5 w-3.5 text-blue-600" /><span>Syncing</span></span>
              </Select.Item>
              <Select.Item value="applied" className="cursor-pointer hover:bg-slate-100">
                <span className="flex items-center gap-2"><CheckCircle className="h-3.5 w-3.5 text-emerald-600" /><span>Applied</span></span>
              </Select.Item>
              <Select.Item value="error" className="cursor-pointer hover:bg-slate-100">
                <span className="flex items-center gap-2"><XCircle className="h-3.5 w-3.5 text-rose-600" /><span>Error</span></span>
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Kolom 3: Tabel */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Select.Root value={tableFilter} onValueChange={setTableFilter}>
            <Select.Trigger style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', width: '100%', height: '36px' }} className="cursor-pointer font-sans truncate text-sm px-2" />
            <Select.Content style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }}>
              {tableOptions.map((table) => (
                <Select.Item key={table} value={table} className="cursor-pointer hover:bg-slate-100">
                  <span className="flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 text-slate-700" />
                    <span>{table === 'all' ? 'Semua Tabel' : table}</span>
                  </span>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        {/* Kolom 4: Reset */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <button onClick={handleReset} disabled={!hasActiveFilters} className={`flex items-center justify-center gap-2 px-3 text-white font-medium shadow-sm hover:shadow transition-all w-full truncate ${!hasActiveFilters ? 'opacity-50 cursor-not-allowed' : ''}`} style={{ borderRadius: 0, backgroundColor: '#dc2626', border: '1px solid #b91c1c', height: '36px' }}>
            <X className="h-4 w-4 flex-shrink-0" />
            <span className="text-sm truncate">Reset</span>
          </button>
        </div>

        {/* Kolom 5-7: Reserved */}
        <div style={{ gridColumn: 'span 3' }} className="min-w-0 overflow-hidden" aria-hidden="true" />

        {/* Kolom 8: Retry All */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <button onClick={onRetryAll} disabled={retrying || globalStats.error === 0} className="flex items-center justify-center gap-2 px-3 text-white font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full truncate" style={{ borderRadius: 0, backgroundColor: '#dc2626', border: '1px solid #b91c1c', height: '36px' }} title={globalStats.error === 0 ? 'Tidak ada error untuk di-retry' : 'Retry semua item yang error'}>
            <RotateCcw className={`h-4 w-4 flex-shrink-0 ${retrying ? 'animate-spin' : ''}`} />
            <span className="text-sm truncate">Retry ({globalStats.error})</span>
          </button>
        </div>

        {/* Kolom 9: Statcard T/A */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <div className="grid grid-cols-2 items-center border border-slate-300 shadow-sm overflow-hidden" style={{ borderRadius: 0, height: '36px' }}>
            <div className="flex items-center justify-center px-2 min-w-0">
              <span className="text-slate-800 text-xs font-semibold tracking-wide truncate">T : {globalStats.total}</span>
            </div>
            <div className="flex items-center justify-center px-2 min-w-0 border-l border-slate-300">
              <span className="text-emerald-700 text-xs font-semibold tracking-wide truncate">A : {filteredStats.total}</span>
            </div>
          </div>
        </div>

        {/* Kolom 10: Refresh */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <button onClick={onRefresh} disabled={loading} className="flex items-center justify-center gap-2 px-3 text-white font-medium shadow-sm hover:shadow transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full truncate" style={{ borderRadius: 0, backgroundColor: '#0066cc', border: '1px solid #0052a3', height: '36px' }}>
            <RefreshCw className={`h-4 w-4 flex-shrink-0 ${loading ? 'animate-spin' : ''}`} />
            <span className="text-sm truncate">Refresh</span>
          </button>
        </div>
      </div>
    </div>
  )
}
