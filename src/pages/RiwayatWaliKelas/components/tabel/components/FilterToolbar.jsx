import { Button, TextField, Select } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Plus, X, ListFilter, CheckCircle, CircleSlash, RefreshCw, Calendar } from 'lucide-react'

export function FilterToolbar({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterTahunAjaran,
  setFilterTahunAjaran,
  tahunAjaranList,
  hasActiveFilters,
  onClearFilters,
  stats,
  onAdd,
}) {
  return (
    <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100">
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
            placeholder="Cari wali kelas, kelas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="2"
            style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', height: '36px' }}
            className="font-sans w-full"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
            {searchQuery && (
              <TextField.Slot>
                <button onClick={() => setSearchQuery('')} className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0">
                  <X className="h-4 w-4" />
                </button>
              </TextField.Slot>
            )}
          </TextField.Root>
        </div>

        {/* Kolom 2: Status */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
            <Select.Trigger
              style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', width: '100%', height: '36px' }}
              className="cursor-pointer font-sans truncate text-sm px-2"
            />
            <Select.Content style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }} className="bg-white border-2 border-slate-300 shadow-lg" position="popper" sideOffset={4}>
              <Select.Item value="all" className="cursor-pointer hover:bg-slate-100">
                <span className="flex items-center gap-2">
                  <ListFilter className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                  <span>Semua Status</span>
                </span>
              </Select.Item>
              <Select.Item value="aktif" className="cursor-pointer hover:bg-slate-100">
                <span className="flex items-center gap-2">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                  <span>Aktif</span>
                </span>
              </Select.Item>
              <Select.Item value="selesai" className="cursor-pointer hover:bg-slate-100">
                <span className="flex items-center gap-2">
                  <CircleSlash className="h-3.5 w-3.5 text-rose-600" aria-hidden="true" />
                  <span>Selesai</span>
                </span>
              </Select.Item>
              <Select.Item value="diganti" className="cursor-pointer hover:bg-slate-100">
                <span className="flex items-center gap-2">
                  <RefreshCw className="h-3.5 w-3.5 text-amber-600" aria-hidden="true" />
                  <span>Diganti</span>
                </span>
              </Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

        {/* Kolom 3: Tahun Ajaran */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Select.Root value={filterTahunAjaran} onValueChange={setFilterTahunAjaran}>
            <Select.Trigger
              style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', width: '100%', height: '36px' }}
              className="cursor-pointer font-sans truncate text-sm px-2"
            />
            <Select.Content style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }} className="bg-white border-2 border-slate-300 shadow-lg" position="popper" sideOffset={4}>
              <Select.Item value="all" className="cursor-pointer hover:bg-slate-100">
                <span className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                  <span>Semua Tahun Ajaran</span>
                </span>
              </Select.Item>
              {tahunAjaranList.map((tahun) => (
                <Select.Item key={tahun.id} value={tahun.id} className="cursor-pointer hover:bg-slate-100">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                    <span>{tahun.nama}</span>
                  </span>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        {/* Kolom 4: Reset */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Button
            onClick={onClearFilters}
            size="2"
            style={{ borderRadius: 0, height: '36px', backgroundColor: '#dc2626', border: '1px solid #b91c1c' }}
            disabled={!hasActiveFilters}
            className={`cursor-pointer text-white hover:brightness-95 transition-colors w-full truncate ${!hasActiveFilters ? 'opacity-50' : ''}`}
          >
            <X className="h-4 w-4 flex-shrink-0 text-white" />
            <span className="truncate">Reset</span>
          </Button>
        </div>

        {/* Kolom 5-8: Reserved */}
        <div style={{ gridColumn: 'span 4' }} className="min-w-0 overflow-hidden" aria-hidden="true" />

        {/* Kolom 9: Statcard */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <div className="grid grid-cols-2 items-center border border-slate-300 shadow-sm overflow-hidden" style={{ borderRadius: 0, height: '36px' }}>
            <div className="flex items-center justify-center px-2 min-w-0">
              <span className="text-slate-800 text-xs font-semibold tracking-wide truncate">T : {stats.total}</span>
            </div>
            <div className="flex items-center justify-center px-2 min-w-0 border-l border-slate-300">
              <span className="text-emerald-700 text-xs font-semibold tracking-wide truncate">A : {stats.aktif}</span>
            </div>
          </div>
        </div>

        {/* Kolom 10: Tambah */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Button
            onClick={onAdd}
            className="cursor-pointer text-white font-medium shadow-sm hover:shadow transition-all w-full truncate"
            size="2"
            style={{ borderRadius: 0, backgroundColor: '#0066cc', border: '1px solid #0052a3', height: '36px' }}
          >
            <Plus className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Tambah</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
