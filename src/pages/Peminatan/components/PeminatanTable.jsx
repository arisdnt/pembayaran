import { usePeminatanFilters } from '../hooks/usePeminatanFilters'
import { PeminatanTableRow } from './PeminatanTableRow'
import { BookOpen, Plus, Search, X, Calendar, GraduationCap, ListFilter, CheckCircle, CircleSlash } from 'lucide-react'
import { TextField, Button, Select } from '@radix-ui/themes'

export function PeminatanTable({
  data,
  isLoading = false,
  isRefreshing = false,
  onEdit,
  onDelete,
  onToggleAktif,
  onAdd,
  selectedItem,
  onSelectItem,
  onViewDetail,
  tahunAjaranOptions = [],
  selectedYearId = 'all',
  selectedYearLabel = 'Semua Tahun Ajaran',
  onSelectYear,
}) {
  const {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterTingkat,
    setFilterTingkat,
    tingkatList,
    filteredData,
    hasActiveFilters,
    handleClearFilters,
  } = usePeminatanFilters(data)

  const isEmpty = !isLoading && filteredData.length === 0
  const selectedYearValue = selectedYearId ?? 'all'

  return (
    <div className="h-full flex flex-col">
      {/* Excel-style Container */}
      <div className="h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
        
        {/* Toolbar Section */}
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
                placeholder="Cari peminatan..."
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
                      className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </TextField.Slot>
                )}
              </TextField.Root>
            </div>

            {/* Kolom 2: Filter Status */}
            <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
              <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
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
                      <ListFilter className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                      <span>Semua Status</span>
                    </span>
                  </Select.Item>
                  <Select.Item value="aktif" style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                    <span className="flex items-center gap-2">
                      <CheckCircle className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                      <span>Aktif</span>
                    </span>
                  </Select.Item>
                  <Select.Item value="nonaktif" style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                    <span className="flex items-center gap-2">
                      <CircleSlash className="h-3.5 w-3.5 text-rose-600" aria-hidden="true" />
                      <span>Non-Aktif</span>
                    </span>
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            {/* Kolom 3: Filter Tahun Ajaran */}
            <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
              <Select.Root
                value={selectedYearValue === null ? 'all' : selectedYearValue}
                onValueChange={(value) => onSelectYear?.(value)}
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
                  <Select.Item value="all" style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                    <span className="flex items-center gap-2">
                      <Calendar className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                      <span>Semua Tahun Ajaran</span>
                    </span>
                  </Select.Item>
                  {tahunAjaranOptions.map((option) => (
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
                ))}
                </Select.Content>
              </Select.Root>
            </div>

            {/* Kolom 4: Filter Tingkat */}
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
                  {tingkatList.map((tingkat) => (
                    <Select.Item 
                      key={tingkat} 
                      value={tingkat.toString()} 
                      style={{ borderRadius: 0 }} 
                      className="hover:bg-blue-50 cursor-pointer px-3 py-2"
                    >
                      <span className="flex items-center gap-2">
                        <GraduationCap className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                        <span>Tingkat {tingkat}</span>
                      </span>
                    </Select.Item>
                ))}
                </Select.Content>
              </Select.Root>
            </div>

            {/* Kolom 5: Reset */}
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

            {/* Kolom 6-8: Reserved */}
            <div style={{ gridColumn: 'span 3' }} className="min-w-0 overflow-hidden" aria-hidden="true" />

            {/* Kolom 9: Statcard */}
            <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
              <div className="grid grid-cols-2 items-center border border-slate-300 shadow-sm overflow-hidden" style={{ borderRadius: 0, height: '36px' }}>
                <div className="flex items-center justify-center px-2 min-w-0">
                  <span className="text-slate-800 text-xs font-semibold tracking-wide truncate">T : {data.length}</span>
                </div>
                <div className="flex items-center justify-center px-2 min-w-0 border-l border-slate-300">
                  <span className="text-emerald-700 text-xs font-semibold tracking-wide truncate">A : {data.filter(x => x.aktif).length}</span>
                </div>
              </div>
            </div>

            {/* Kolom 10: Tambah Baru */}
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
            <table className="w-full table-fixed text-sm border-collapse">
              <colgroup>
                <col style={{ width: '9%' }} />
                <col style={{ width: '21%' }} />
                <col style={{ width: '21%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '10%' }} />
              </colgroup>
              <thead>
                <tr className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10 border-b border-slate-300 shadow-sm">
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Kode
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Nama Peminatan
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Keterangan
                  </th>
                  <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Tingkat Min
                  </th>
                  <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Tingkat Max
                  </th>
                  <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Total Siswa
                  </th>
                  <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-slate-300">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center text-slate-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : isEmpty ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <BookOpen className="h-12 w-12 text-slate-300" />
                        <div>
                          <p className="text-slate-600 font-medium">
                            {hasActiveFilters ? 'Tidak ada data yang cocok' : 'Belum ada data peminatan'}
                          </p>
                          {hasActiveFilters && (
                            <button
                              onClick={handleClearFilters}
                              className="mt-2 text-blue-600 hover:text-blue-700 text-sm underline"
                            >
                              Reset filter
                            </button>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredData.map((item, index) => (
                    <PeminatanTableRow
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      onSelect={onSelectItem}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleAktif={onToggleAktif}
                      onViewDetail={onViewDetail}
                      isEven={index % 2 === 0}
                    />
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
