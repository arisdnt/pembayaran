import { useEffect } from 'react'
import { useTableFilters } from '../../hooks/useTableFilters'
import { useFilterOptions } from '../../hooks/useFilterOptions'
import { TableToolbar } from './components/TableToolbar'
import { TableHeader } from './components/TableHeader'
import { TableRow } from './components/TableRow'
import { TableSkeleton } from './components/TableSkeleton'
import { TableEmpty } from './components/TableEmpty'

export function SiswaTable({
  data,
  isLoading = false,
  onEdit,
  onDelete,
  onToggleStatus,
  onAdd,
  selectedItem,
  onSelectItem,
  onViewDetail,
}) {
  const {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterTahunAjaran,
    setFilterTahunAjaran,
    filterTingkat,
    setFilterTingkat,
    filterKelas,
    setFilterKelas,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  } = useTableFilters(data)

  const { tahunAjaranOptions, tingkatOptions, kelasOptions } = useFilterOptions(data)

  // Auto-reset invalid filters
  useEffect(() => {
    if (filterTahunAjaran !== 'all' && !tahunAjaranOptions.some((opt) => opt.value === filterTahunAjaran)) {
      setFilterTahunAjaran('all')
    }
  }, [filterTahunAjaran, tahunAjaranOptions, setFilterTahunAjaran])

  useEffect(() => {
    if (filterTingkat !== 'all' && !tingkatOptions.includes(filterTingkat)) {
      setFilterTingkat('all')
    }
  }, [filterTingkat, tingkatOptions, setFilterTingkat])

  useEffect(() => {
    if (filterKelas !== 'all' && !kelasOptions.some((opt) => opt.value === filterKelas)) {
      setFilterKelas('all')
    }
  }, [filterKelas, kelasOptions, setFilterKelas])

  const isEmpty = !isLoading && filteredData.length === 0

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col border border-slate-300 bg-white shadow-lg">
        <TableToolbar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterStatus={filterStatus}
          setFilterStatus={setFilterStatus}
          filterTahunAjaran={filterTahunAjaran}
          setFilterTahunAjaran={setFilterTahunAjaran}
          filterTingkat={filterTingkat}
          setFilterTingkat={setFilterTingkat}
          filterKelas={filterKelas}
          setFilterKelas={setFilterKelas}
          tahunAjaranOptions={tahunAjaranOptions}
          tingkatOptions={tingkatOptions}
          kelasOptions={kelasOptions}
          stats={stats}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onAdd={onAdd}
        />

        <div className="relative flex-1 min-h-0">
          <div className="h-full overflow-auto excel-scrollbar">
            <table className="min-w-full table-fixed text-sm border-collapse">
              <colgroup>
                <col style={{ width: '17%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '11%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '10%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '8%' }} />
                <col style={{ width: '9%' }} />
                <col style={{ width: '6%' }} />
              </colgroup>
              
              <TableHeader />
              
              <tbody>
                {isLoading ? (
                  <TableSkeleton />
                ) : (
                  filteredData.map((item, index) => (
                    <TableRow
                      key={item.id}
                      item={item}
                      index={index}
                      isSelected={selectedItem?.id === item.id}
                      onSelect={onSelectItem}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onToggleStatus={onToggleStatus}
                      onViewDetail={onViewDetail}
                    />
                  ))
                )}
                {isEmpty && (
                  <TableEmpty
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                  />
                )}
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
        
        button[role="switch"],
        button[role="switch"]:focus,
        button[role="switch"]:focus-visible,
        button[role="switch"]:active {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
        
        .rt-SwitchRoot:focus,
        .rt-SwitchRoot:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  )
}
