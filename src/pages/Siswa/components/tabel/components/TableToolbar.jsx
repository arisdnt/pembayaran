import { Button } from '@radix-ui/themes'
import { Plus, X } from 'lucide-react'
import { SearchBar } from './SearchBar'
import { FilterControls } from './FilterControls'
import { StatsDisplay } from './StatsDisplay'

export function TableToolbar({
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
  tahunAjaranOptions,
  tingkatOptions,
  kelasOptions,
  stats,
  hasActiveFilters,
  onClearFilters,
  onAdd,
}) {
  return (
    <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        
        <FilterControls
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
        />

        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
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

        <StatsDisplay stats={stats} hasActiveFilters={hasActiveFilters} />

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
  )
}
