import { useKelasFilters } from '../hooks/useKelasFilters'
import { KelasTableHeader } from './KelasTableHeader'
import { KelasTableRow } from './KelasTableRow'
import { KelasTableSkeleton } from './KelasTableSkeleton'
import { KelasEmptyState } from './KelasEmptyState'
import { GraduationCap, Plus, Search, Filter, X } from 'lucide-react'
import { TextField, Button, Select, Badge } from '@radix-ui/themes'

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
}) {
  const {
    searchQuery,
    setSearchQuery,
    filterTingkat,
    setFilterTingkat,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  } = useKelasFilters(data)

  const isEmpty = !isLoading && filteredData.length === 0

  return (
    <div className="h-full flex flex-col">
      {/* Excel-style Container */}
      <div className="h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
        
        {/* Toolbar Section - Excel-inspired ribbon */}
        <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100">
          <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
            {/* Search */}
            <div className="flex-1 min-w-[240px] max-w-xs">
              <TextField.Root
                placeholder="Cari kelas..."
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

            {/* Filter Tingkat */}
            <div className="flex items-center gap-2">
              <Select.Root value={filterTingkat} onValueChange={setFilterTingkat}>
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
                    📚 Semua Tingkat
                  </Select.Item>
                  <Select.Item value="10" style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                    🔟 Tingkat 10
                  </Select.Item>
                  <Select.Item value="11" style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                    1️⃣1️⃣ Tingkat 11
                  </Select.Item>
                  <Select.Item value="12" style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                    🎓 Tingkat 12
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

            {/* Stats - Excel-style status bar */}
            <div className="ml-auto flex items-center gap-1.5 text-xs font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 shadow-sm">
                <span className="text-slate-600">Total:</span>
                <span className="font-bold text-slate-900">{stats.total}</span>
              </div>
              {stats.tingkat10 > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-300 shadow-sm">
                  <span className="inline-flex h-2 w-2 rounded-full bg-blue-600" />
                  <span className="text-blue-700">Tingkat 10:</span>
                  <span className="font-bold text-blue-900">{stats.tingkat10}</span>
                </div>
              )}
              {stats.tingkat11 > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-300 shadow-sm">
                  <span className="inline-flex h-2 w-2 rounded-full bg-indigo-600" />
                  <span className="text-indigo-700">Tingkat 11:</span>
                  <span className="font-bold text-indigo-900">{stats.tingkat11}</span>
                </div>
              )}
              {stats.tingkat12 > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 border border-purple-300 shadow-sm">
                  <span className="inline-flex h-2 w-2 rounded-full bg-purple-600" />
                  <span className="text-purple-700">Tingkat 12:</span>
                  <span className="font-bold text-purple-900">{stats.tingkat12}</span>
                </div>
              )}
              {hasActiveFilters && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 shadow-sm">
                  <span className="text-emerald-700">Tampil:</span>
                  <span className="font-bold text-emerald-900">{filteredData.length}</span>
                </div>
              )}
            </div>

            {/* Button Tambah Baru - Excel-style button */}
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
                <col key="col-1" style={{ width: '15%' }} />,
                <col key="col-2" style={{ width: '20%' }} />,
                <col key="col-3" style={{ width: '15%' }} />,
                <col key="col-4" style={{ width: '25%' }} />,
                <col key="col-5" style={{ width: '17%' }} />,
                <col key="col-6" style={{ width: '8%' }} />,
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
