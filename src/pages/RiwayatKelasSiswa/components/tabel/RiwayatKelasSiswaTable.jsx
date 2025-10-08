import { useTableFilters } from './hooks/useTableFilters'
import { FilterToolbar } from './components/FilterToolbar'
import { TableRow } from './components/TableRow'
import { EmptyState } from './components/EmptyState'
import { SkeletonRow } from './components/SkeletonRow'
import { useMemo } from 'react'

export function RiwayatKelasSiswaTable({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  onAdd,
  selectedItem,
  onSelectItem,
  onViewDetail
}) {
  const {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterTahunAjaran,
    setFilterTahunAjaran,
    filterTingkatKelas,
    setFilterTingkatKelas,
    tahunAjaranOptions,
    tingkatKelasOptions,
    filteredData,
    hasActiveFilters,
    handleClearFilters,
  } = useTableFilters(data)

  const isEmpty = !isLoading && filteredData.length === 0
  const stats = useMemo(() => ({
    total: data.length,
    active: data.filter(x => (x.status || '').toLowerCase() === 'aktif').length,
    filtered: filteredData.length,
  }), [data, filteredData])

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col border border-slate-300 bg-white shadow-lg">
        <FilterToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterTahunAjaran={filterTahunAjaran}
          setFilterTahunAjaran={setFilterTahunAjaran}
          filterTingkatKelas={filterTingkatKelas}
          setFilterTingkatKelas={setFilterTingkatKelas}
          tahunAjaranOptions={tahunAjaranOptions}
          tingkatKelasOptions={tingkatKelasOptions}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onAdd={onAdd}
          stats={stats}
        />

        <div className="relative flex-1 min-h-0">
          <div className="h-full overflow-auto excel-scrollbar">
            <table className="min-w-full table-fixed text-sm border-collapse">
              <colgroup>{[
                <col key="col-1" style={{ width: '18%' }} />,
                <col key="col-2" style={{ width: '12%' }} />,
                <col key="col-3" style={{ width: '12%' }} />,
                <col key="col-4" style={{ width: '12%' }} />,
                <col key="col-5" style={{ width: '10%' }} />,
                <col key="col-6" style={{ width: '10%' }} />,
                <col key="col-7" style={{ width: '10%' }} />,
                <col key="col-8" style={{ width: '10%' }} />,
                <col key="col-9" style={{ width: '6%' }} />,
              ]}</colgroup>
              <thead>
                <tr className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10 border-b border-slate-300 shadow-sm">
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    <div className="flex items-center gap-2">Nama Siswa</div>
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Tahun Ajaran
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Kelas
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Wali Kelas
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Tgl Masuk
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Tgl Keluar
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Diperbarui
                  </th>
                  <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, index) => <SkeletonRow key={index} index={index} />)
                  : filteredData.map((item, index) => (
                      <TableRow
                        key={item.id}
                        item={item}
                        index={index}
                        selectedItem={selectedItem}
                        onSelectItem={onSelectItem}
                        onViewDetail={onViewDetail}
                        onEdit={onEdit}
                        onDelete={onDelete}
                      />
                    ))}
                {isEmpty ? <EmptyState hasActiveFilters={hasActiveFilters} onClearFilters={handleClearFilters} /> : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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
  )
}
