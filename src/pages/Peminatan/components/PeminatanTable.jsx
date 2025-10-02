import { usePeminatanFilters } from '../hooks/usePeminatanFilters'
import { PeminatanTableRow } from './PeminatanTableRow'
import { BookOpen, Plus, Search, X } from 'lucide-react'
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
}) {
  const {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  } = usePeminatanFilters(data)

  const isEmpty = !isLoading && filteredData.length === 0

  return (
    <div className="h-full flex flex-col">
      {/* Excel-style Container */}
      <div className="h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
        
        {/* Toolbar Section */}
        <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100">
          <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
            {/* Search */}
            <div className="flex-1 min-w-[240px] max-w-xs">
              <TextField.Root
                placeholder="Cari peminatan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="2"
                style={{
                  borderRadius: 0,
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff'
                }}
                className="font-sans"
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

            {/* Filter Status */}
            <div className="flex items-center gap-2">
              <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
                <Select.Trigger 
                  style={{ 
                    borderRadius: 0, 
                    minWidth: '140px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff'
                  }}
                  className="cursor-pointer font-sans"
                />
                <Select.Content 
                  position="popper"
                  side="bottom"
                  align="start"
                  sideOffset={4}
                  style={{ borderRadius: 0 }}
                  className="border-2 border-slate-300 shadow-lg bg-white z-50"
                >
                  <Select.Item value="all" style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                    📚 Semua Status
                  </Select.Item>
                  <Select.Item value="aktif" style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                    ✅ Aktif
                  </Select.Item>
                  <Select.Item value="nonaktif" style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                    ❌ Non-Aktif
                  </Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            {/* Reset Filter */}
            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                variant="soft"
                color="gray"
                size="2"
                style={{ borderRadius: 0 }}
                className="cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <X className="h-4 w-4" />
                Reset
              </Button>
            )}

            {/* Stats */}
            <div className="ml-auto flex items-center gap-1.5 text-xs font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 shadow-sm">
                <span className="text-slate-600">Total:</span>
                <span className="font-bold text-slate-900">{stats.total}</span>
              </div>
              {stats.aktif > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-300 shadow-sm">
                  <span className="inline-flex h-2 w-2 rounded-full bg-green-600" />
                  <span className="text-green-700">Aktif:</span>
                  <span className="font-bold text-green-900">{stats.aktif}</span>
                </div>
              )}
              {stats.nonaktif > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-300 shadow-sm">
                  <span className="inline-flex h-2 w-2 rounded-full bg-red-600" />
                  <span className="text-red-700">Non-Aktif:</span>
                  <span className="font-bold text-red-900">{stats.nonaktif}</span>
                </div>
              )}
              {hasActiveFilters && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 shadow-sm">
                  <span className="text-emerald-700">Tampil:</span>
                  <span className="font-bold text-emerald-900">{filteredData.length}</span>
                </div>
              )}
            </div>

            {/* Button Tambah Baru */}
            <div>
              <Button
                onClick={onAdd}
                className="cursor-pointer text-white font-medium shadow-sm hover:shadow transition-all"
                size="2"
                style={{ 
                  borderRadius: 0,
                  backgroundColor: '#0066cc',
                  border: '1px solid #0052a3'
                }}
              >
                <Plus className="h-4 w-4" />
                Tambah Baru
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
                <col key="col-1" style={{ width: '12%' }} />,
                <col key="col-2" style={{ width: '18%' }} />,
                <col key="col-3" style={{ width: '25%' }} />,
                <col key="col-4" style={{ width: '12%' }} />,
                <col key="col-5" style={{ width: '12%' }} />,
                <col key="col-6" style={{ width: '12%' }} />,
                <col key="col-7" style={{ width: '9%' }} />,
              ]}</colgroup>
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
                    <td colSpan="7" className="px-4 py-12 text-center text-slate-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : isEmpty ? (
                  <tr>
                    <td colSpan="7" className="px-4 py-12 text-center">
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
