import { usePeminatanSiswaFilters } from '../hooks/usePeminatanSiswaFilters'
import { PeminatanSiswaTableRow } from './PeminatanSiswaTableRow'
import { BookOpen, Plus, Search, X } from 'lucide-react'
import { TextField, Button, Select } from '@radix-ui/themes'

export function PeminatanSiswaTable({
  data,
  isLoading = false,
  isRefreshing = false,
  onEdit,
  onDelete,
  onAdd,
  selectedItem,
  onSelectItem,
}) {
  const {
    searchQuery,
    setSearchQuery,
    filterPeminatan,
    setFilterPeminatan,
    filterTahunAjaran,
    setFilterTahunAjaran,
    filterTingkat,
    setFilterTingkat,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  } = usePeminatanSiswaFilters(data)

  const isEmpty = !isLoading && filteredData.length === 0

  const peminatanOptions = [...new Set(data.map(item => item.peminatan).filter(Boolean))]
  const tahunAjaranOptions = [...new Set(data.map(item => item.tahun_ajaran).filter(Boolean))]
  const tingkatOptions = [...new Set(data.map(item => item.tingkat).filter(Boolean))].sort()

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
                placeholder="Cari siswa atau peminatan..."
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

            {/* Filter Peminatan */}
            <div className="flex items-center gap-2">
              <Select.Root value={filterPeminatan} onValueChange={setFilterPeminatan}>
                <Select.Trigger 
                  style={{ 
                    borderRadius: 0, 
                    minWidth: '160px',
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
                    📚 Semua Peminatan
                  </Select.Item>
                  {peminatanOptions.map((p) => (
                    <Select.Item key={p.id} value={p.id} style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                      {p.kode} - {p.nama}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>

            {/* Filter Tahun Ajaran */}
            <div className="flex items-center gap-2">
              <Select.Root value={filterTahunAjaran} onValueChange={setFilterTahunAjaran}>
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
                    📅 Semua Tahun
                  </Select.Item>
                  {tahunAjaranOptions.map((ta) => (
                    <Select.Item key={ta.id} value={ta.id} style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                      {ta.nama}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>

            {/* Filter Tingkat */}
            <div className="flex items-center gap-2">
              <Select.Root value={filterTingkat} onValueChange={setFilterTingkat}>
                <Select.Trigger 
                  style={{ 
                    borderRadius: 0, 
                    minWidth: '120px',
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
                    🎓 Semua Tingkat
                  </Select.Item>
                  {tingkatOptions.map((t) => (
                    <Select.Item key={t} value={t} style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                      Tingkat {t}
                    </Select.Item>
                  ))}
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
                <col key="col-1" style={{ width: '18%' }} />,
                <col key="col-2" style={{ width: '12%' }} />,
                <col key="col-3" style={{ width: '18%' }} />,
                <col key="col-4" style={{ width: '12%' }} />,
                <col key="col-5" style={{ width: '10%' }} />,
                <col key="col-6" style={{ width: '12%' }} />,
                <col key="col-7" style={{ width: '10%' }} />,
                <col key="col-8" style={{ width: '8%' }} />,
              ]}</colgroup>
              <thead>
                <tr className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10 border-b border-slate-300 shadow-sm">
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Nama Siswa
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    NISN
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Peminatan
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Tahun Ajaran
                  </th>
                  <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Tingkat
                  </th>
                  <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Tanggal Mulai
                  </th>
                  <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Tanggal Selesai
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
                            {hasActiveFilters ? 'Tidak ada data yang cocok' : 'Belum ada data peminatan siswa'}
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
                    <PeminatanSiswaTableRow
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      onSelect={onSelectItem}
                      onEdit={onEdit}
                      onDelete={onDelete}
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
