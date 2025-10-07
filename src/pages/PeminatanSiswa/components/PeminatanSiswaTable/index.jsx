import React from 'react'
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

  // Group data by tahun_ajaran + tingkat + peminatan
  const dataWithGroups = React.useMemo(() => {
    const groupMap = new Map()
    const groupColors = [
      { bg: 'bg-blue-50/70', hover: 'hover:bg-blue-100', selected: 'bg-blue-200' },
      { bg: 'bg-green-50/70', hover: 'hover:bg-green-100', selected: 'bg-green-200' },
      { bg: 'bg-yellow-50/70', hover: 'hover:bg-yellow-100', selected: 'bg-yellow-200' },
      { bg: 'bg-purple-50/70', hover: 'hover:bg-purple-100', selected: 'bg-purple-200' },
      { bg: 'bg-pink-50/70', hover: 'hover:bg-pink-100', selected: 'bg-pink-200' },
      { bg: 'bg-indigo-50/70', hover: 'hover:bg-indigo-100', selected: 'bg-indigo-200' },
      { bg: 'bg-orange-50/70', hover: 'hover:bg-orange-100', selected: 'bg-orange-200' },
      { bg: 'bg-teal-50/70', hover: 'hover:bg-teal-100', selected: 'bg-teal-200' },
    ]

    return filteredData.map(item => {
      // Create unique group key from tahun_ajaran + tingkat + peminatan
      const groupKey = `${item.id_tahun_ajaran || 'none'}-${item.tingkat || 'none'}-${item.id_peminatan || 'none'}`
      
      // Assign color index for this group
      if (!groupMap.has(groupKey)) {
        groupMap.set(groupKey, groupMap.size)
      }
      
      const groupIndex = groupMap.get(groupKey)
      const colorIndex = groupIndex % groupColors.length
      
      return {
        ...item,
        groupKey,
        groupIndex,
        groupColors: groupColors[colorIndex]
      }
    })
  }, [filteredData])

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
                  dataWithGroups.map((item) => (
                    <PeminatanSiswaTableRow
                      key={item.id}
                      item={item}
                      isSelected={selectedItem?.id === item.id}
                      onSelect={onSelectItem}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onViewDetail={onViewDetail}
                      groupColors={item.groupColors}
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
