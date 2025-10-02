import { useJenisPembayaranFilters } from '../hooks/useJenisPembayaranFilters'
import { JenisPembayaranFilters } from './JenisPembayaranFilters'
import { JenisPembayaranTableHeader } from './JenisPembayaranTableHeader'
import { JenisPembayaranTableRow } from './JenisPembayaranTableRow'
import { JenisPembayaranEmptyState } from './JenisPembayaranEmptyState'

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

        <div className="relative flex-1 min-h-0">
          <div className="h-full overflow-auto">
            <table className="min-w-full table-fixed text-sm">
              <colgroup>{[
                <col key="kode" style={{ width: '10%' }} />,
                <col key="nama" style={{ width: '18%' }} />,
                <col key="jumlah-default" style={{ width: '12%' }} />,
                <col key="tipe" style={{ width: '10%' }} />,
                <col key="tahun-ajaran" style={{ width: '14%' }} />,
                <col key="kelas" style={{ width: '14%' }} />,
                <col key="wajib" style={{ width: '8%' }} />,
                <col key="status" style={{ width: '8%' }} />,
                <col key="aksi" style={{ width: '6%' }} />,
              ]}</colgroup>
              <JenisPembayaranTableHeader />
              <tbody className="divide-y divide-slate-100">
                {filters.filteredData.map((item) => (
                  <JenisPembayaranTableRow
                    key={item.id}
                    item={item}
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
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
