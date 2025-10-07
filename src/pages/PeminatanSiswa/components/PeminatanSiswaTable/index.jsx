import { usePeminatanSiswaFilters } from '../../hooks/usePeminatanSiswaFilters'
import { PeminatanSiswaTableRow } from '../PeminatanSiswaTableRow'
import { TableToolbar } from './components/TableToolbar'
import { TableHeader } from './components/TableHeader'
import { EmptyState } from './components/EmptyState'
import { tableStyles } from './styles/tableStyles'

export function PeminatanSiswaTable({
  data,
  isLoading = false,
  isRefreshing = false,
  onEdit,
  onDelete,
  onAdd,
  onViewDetail,
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

  // Use Map to deduplicate objects by their id property
  const peminatanMap = new Map()
  const tahunAjaranMap = new Map()
  
  data.forEach(item => {
    if (item.peminatan?.id) {
      peminatanMap.set(item.peminatan.id, item.peminatan)
    }
    if (item.tahun_ajaran?.id) {
      tahunAjaranMap.set(item.tahun_ajaran.id, item.tahun_ajaran)
    }
  })
  
  const peminatanOptions = Array.from(peminatanMap.values()).sort((a, b) => 
    (a.kode || '').localeCompare(b.kode || '')
  )
  const tahunAjaranOptions = Array.from(tahunAjaranMap.values()).sort((a, b) => 
    (a.nama || '').localeCompare(b.nama || '')
  )
  const tingkatOptions = [...new Set(data.map(item => item.tingkat).filter(Boolean))].sort()

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
        
        <TableToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterPeminatan={filterPeminatan}
          onFilterPeminatanChange={setFilterPeminatan}
          filterTahunAjaran={filterTahunAjaran}
          onFilterTahunAjaranChange={setFilterTahunAjaran}
          filterTingkat={filterTingkat}
          onFilterTingkatChange={setFilterTingkat}
          peminatanOptions={peminatanOptions}
          tahunAjaranOptions={tahunAjaranOptions}
          tingkatOptions={tingkatOptions}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          stats={stats}
          filteredCount={filteredData.length}
          onAdd={onAdd}
        />

        <div className="relative flex-1 min-h-0">
          <div className="h-full overflow-auto excel-scrollbar">
            {isRefreshing && !isLoading ? (
              <div className="pointer-events-none sticky top-0 z-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" />
            ) : null}
            
            <table className="min-w-full table-fixed text-sm border-collapse">
              <colgroup>{[
                <col key="col-1" style={{ width: '17%' }} />,
                <col key="col-2" style={{ width: '11%' }} />,
                <col key="col-3" style={{ width: '17%' }} />,
                <col key="col-4" style={{ width: '11%' }} />,
                <col key="col-5" style={{ width: '9%' }} />,
                <col key="col-6" style={{ width: '11%' }} />,
                <col key="col-7" style={{ width: '11%' }} />,
                <col key="col-8" style={{ width: '13%' }} />,
              ]}</colgroup>
              
              <TableHeader />
              
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan="8" className="px-4 py-12 text-center text-slate-500">
                      Memuat data...
                    </td>
                  </tr>
                ) : isEmpty ? (
                  <EmptyState 
                    hasActiveFilters={hasActiveFilters} 
                    onClearFilters={handleClearFilters} 
                  />
                ) : (
                  filteredData.map((item, index) => (
                    <PeminatanSiswaTableRow
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      onSelect={onSelectItem}
                      onEdit={onEdit}
                      onDelete={onDelete}
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

      <style>{tableStyles}</style>
    </div>
  )
}
