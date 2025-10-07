import { Text } from '@radix-ui/themes'
import { useTagihanFilters } from './hooks/useTagihanFilters'
import { FilterToolbar } from './table-components/FilterToolbar'
import { TableRow } from './table-components/TableRow'
import { EmptyState } from './table-components/EmptyState'

export function TagihanTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onAdd,
  selectedItem,
  onSelectItem,
  onViewDetail,
  tahunAjaranList = [],
}) {
  const {
    searchQuery,
    setSearchQuery,
    filterTahunAjaran,
    setFilterTahunAjaran,
    filterTingkatKelas,
    setFilterTingkatKelas,
    filterJudul,
    setFilterJudul,
    tingkatKelasOptions,
    judulOptions,
    filteredData,
    hasActiveFilters,
    handleClearFilters,
  } = useTagihanFilters(data)

  const isEmpty = filteredData.length === 0

  return (
    <div className="h-full flex flex-col border border-slate-300 bg-white shadow-lg">
      <FilterToolbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filterTahunAjaran={filterTahunAjaran}
        setFilterTahunAjaran={setFilterTahunAjaran}
        filterTingkatKelas={filterTingkatKelas}
        setFilterTingkatKelas={setFilterTingkatKelas}
        filterJudul={filterJudul}
        setFilterJudul={setFilterJudul}
        tahunAjaranList={tahunAjaranList}
        tingkatKelasOptions={tingkatKelasOptions}
        judulOptions={judulOptions}
        onAdd={onAdd}
      />

      <div className="flex-1 overflow-auto min-h-0">
        {isLoading ? (
          <div className="p-4 space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-slate-200 py-4">
                <div className="h-4 w-24 bg-slate-200" />
                <div className="h-4 w-32 bg-slate-200" />
                <div className="h-4 w-28 bg-slate-200" />
                <div className="h-4 w-20 bg-slate-200" />
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10">
              <tr className="border-b-2 border-slate-300">
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    No. Tagihan
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Judul
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Siswa
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Kelas
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Total Tagihan
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Dibayar
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Kekurangan
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Tgl Tagihan
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Jatuh Tempo
                  </Text>
                </th>
                <th className="px-4 py-3 text-center">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Aksi
                  </Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {isEmpty ? (
                <EmptyState hasActiveFilters={hasActiveFilters} onClearFilters={handleClearFilters} />
              ) : (
                filteredData.map((item, index) => (
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
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
