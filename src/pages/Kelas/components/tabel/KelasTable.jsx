import { useKelasFilters } from '../../hooks/useKelasFilters'
import { KelasTableRow } from './KelasTableRow'
import { KelasEmptyState } from './KelasEmptyState'
import { Plus, Search, X, Calendar, GraduationCap } from 'lucide-react'
import { TextField, Button, Select } from '@radix-ui/themes'

export function KelasTable({
  data,
  isLoading = false,
  isRefreshing = false,
  onEdit,
  onDelete,
  onViewDetail,
  onAdd,
  selectedItem,
  onSelectItem,
  tahunAjaranOptions = [],
  selectedYearId,
  onSelectYear,
}) {
  const {
    searchQuery,
    setSearchQuery,
    filterTingkat,
    setFilterTingkat,
    filteredData,
    hasActiveFilters,
    handleClearFilters,
  } = useKelasFilters(data)

  const isEmpty = !isLoading && filteredData.length === 0
  const yearValue = selectedYearId ?? undefined

  return (
    <div className="h-full flex flex-col">
      {/* Excel-style Container */}
      <div className="h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
        
        {/* Toolbar Section - Excel-inspired ribbon */}
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
                placeholder="Cari kelas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="2"
                style={{
                  borderRadius: 0,
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  height: '36px'
                }}
                className="font-sans w-full"
              >
                <TextField.Slot>
                  <Search className="h-4 w-4" />
                </TextField.Slot>
                {searchQuery && (
                  <TextField.Slot>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </TextField.Slot>
                )}
              </TextField.Root>
            </div>

            {/* Kolom 2: Filter Tingkat */}
            <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
              <Select.Root value={filterTingkat} onValueChange={setFilterTingkat}>
                <Select.Trigger 
                  style={{ 
                    borderRadius: 0, 
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    width: '100%',
                    height: '36px'
                  }}
                  className="cursor-pointer font-sans truncate text-sm px-2"
                />
                <Select.Content 
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }}
                  className="border-2 border-slate-300 shadow-lg bg-white z-50"
                >
                  <Select.Item value="all" style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                    <span className="flex items-center gap-2">
                      <GraduationCap className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                      <span>Semua Tingkat</span>
                    </span>
                  </Select.Item>
                  {['10','11','12'].map((tingkat) => (
                    <Select.Item key={tingkat} value={tingkat} style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                      <span className="flex items-center gap-2">
                        <GraduationCap className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                        <span>Tingkat {tingkat}</span>
                      </span>
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>

            {/* Kolom 3: Filter Tahun Ajaran */}
            <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
              <Select.Root
                value={yearValue}
                onValueChange={(value) => {
                  if (value === '__no_year__') return
                  onSelectYear?.(value)
                }}
                disabled={tahunAjaranOptions.length === 0}
              >
                <Select.Trigger
                  placeholder="Tahun ajaran"
                  style={{
                    borderRadius: 0,
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff',
                    width: '100%',
                    height: '36px'
                  }}
                  className="cursor-pointer font-sans truncate text-sm px-2"
                />
                <Select.Content
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }}
                  className="border-2 border-slate-300 shadow-lg bg-white z-50"
                >
                  {tahunAjaranOptions.length === 0 ? (
                    <Select.Item value="__no_year__" disabled className="px-3 py-2 text-slate-500">
                      Tidak ada data tahun ajaran
                    </Select.Item>
                  ) : (
                    tahunAjaranOptions.map((option) => (
                      <Select.Item
                        key={option.id}
                        value={option.id}
                        style={{ borderRadius: 0 }}
                        className="hover:bg-blue-50 cursor-pointer px-3 py-2"
                      >
                        <span className="flex items-center gap-2">
                          <Calendar className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                          <span>{option.nama}{option.status_aktif ? ' • Aktif' : ''}</span>
                        </span>
                      </Select.Item>
                    ))
                  )}
                </Select.Content>
              </Select.Root>
            </div>

            {/* Kolom 4: Reset (sebelah filter terakhir) */}
            <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
              <Button
                onClick={handleClearFilters}
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

            {/* Kolom 9: Statcard (T & F) */}
            <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
              <div className="grid grid-cols-2 items-center border border-slate-300 shadow-sm overflow-hidden" style={{ borderRadius: 0, height: '36px' }}>
                <div className="flex items-center justify-center px-2 min-w-0">
                  <span className="text-slate-800 text-xs font-semibold tracking-wide truncate">T : {data.length}</span>
                </div>
                <div className="flex items-center justify-center px-2 min-w-0 border-l border-slate-300">
                  <span className="text-emerald-700 text-xs font-semibold tracking-wide truncate">A : {filteredData.length}</span>
                </div>
              </div>
            </div>

            {/* Kolom 10: Tambah */}
            <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
              <Button
                onClick={onAdd}
                className="cursor-pointer text-white font-medium shadow-sm hover:shadow transition-all w-full truncate"
                size="2"
                style={{ 
                  borderRadius: 0,
                  backgroundColor: '#0066cc',
                  border: '1px solid #0052a3',
                  height: '36px'
                }}
              >
                <Plus className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">Tambah</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Table Container */}
        <div className="relative flex-1 min-h-0">
          <div className="h-full overflow-auto excel-scrollbar">
            {isRefreshing && !isLoading ? (
              <div className="pointer-events-none sticky top-0 z-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" />
            ) : null}
            <table className="min-w-full table-fixed text-sm border-collapse">
              <colgroup>{[
                <col key="col-1" style={{ width: '15%' }} />,
                <col key="col-2" style={{ width: '20%' }} />,
                <col key="col-3" style={{ width: '12%' }} />,
                <col key="col-4" style={{ width: '12%' }} />,
                <col key="col-5" style={{ width: '21%' }} />,
                <col key="col-6" style={{ width: '12%' }} />,
                <col key="col-7" style={{ width: '8%' }} />,
              ]}</colgroup>
              <thead>
                <tr className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10 border-b border-slate-300 shadow-sm">
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Tingkat
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Nama Kelas
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Kapasitas
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Total Siswa
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    ID
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Terakhir Diperbarui
                  </th>
                  <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-slate-300">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, index) => (
                  <KelasTableRow
                    key={item.id}
                    item={item}
                    isSelected={selectedItem?.id === item.id}
                    onSelect={onSelectItem}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onViewDetail={onViewDetail}
                    isEven={index % 2 === 0}
                  />
                ))}
                {isEmpty && !isLoading && (
                  <KelasEmptyState
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                  />
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
          background: #e2e8f0;
          border-left: 1px solid #cbd5e1;
          border-top: 1px solid #cbd5e1;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border: 2px solid #e2e8f0;
          transition: background 0.2s;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        
        .excel-scrollbar::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }
      `}</style>
    </div>
  )
}
