import { Text } from '@radix-ui/themes'
import { useJenisPembayaranFilters } from '../hooks/useJenisPembayaranFilters'
import { JenisPembayaranFilters } from './JenisPembayaranFilters'
import { JenisPembayaranTableRow } from './JenisPembayaranTableRow'
import { JenisPembayaranEmptyState } from './JenisPembayaranEmptyState'
import { JenisPembayaranTableSkeleton } from './JenisPembayaranTableSkeleton'

export function JenisPembayaranTable({ data, isLoading, isRefreshing, onEdit, onDelete, onAdd, onViewDetail, selectedItem, onSelectItem }) {
  const filters = useJenisPembayaranFilters(data)
  const isEmpty = filters.filteredData.length === 0

  const stats = {
    total: data.length,
    active: data.filter(item => item.status_aktif).length,
    filtered: filters.filteredData.length,
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col border border-slate-300 bg-white shadow-lg relative">
        <JenisPembayaranFilters
          searchQuery={filters.searchQuery}
          setSearchQuery={filters.setSearchQuery}
          filterTipe={filters.filterTipe}
          setFilterTipe={filters.setFilterTipe}
          filterStatus={filters.filterStatus}
          setFilterStatus={filters.setFilterStatus}
          filterTahunId={filters.filterTahunId}
          setFilterTahunId={filters.setFilterTahunId}
          filterTingkat={filters.filterTingkat}
          setFilterTingkat={filters.setFilterTingkat}
          tahunList={filters.tahunList}
          tingkatList={filters.tingkatList}
          hasActiveFilters={filters.hasActiveFilters}
          handleClearFilters={filters.handleClearFilters}
          onAdd={onAdd}
          stats={stats}
        />

        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10">
              <tr className="border-b-2 border-slate-300">
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Kode
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Nama
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Jumlah Default
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Tipe
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Tahun Ajaran
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Tingkat
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Wajib
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Status
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
              {isLoading ? (
                <JenisPembayaranTableSkeleton />
              ) : (
                <>
                  {filters.filteredData.map((item, index) => (
                    <JenisPembayaranTableRow
                      key={item.id}
                      item={item}
                      index={index}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onViewDetail={onViewDetail}
                      selectedItem={selectedItem}
                      onSelectItem={onSelectItem}
                    />
                  ))}
                  {isEmpty && (
                    <JenisPembayaranEmptyState
                      hasActiveFilters={filters.hasActiveFilters}
                      onClearFilters={filters.handleClearFilters}
                    />
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
