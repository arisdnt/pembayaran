import { Button } from '@radix-ui/themes'
import { Plus, X } from 'lucide-react'
import { SearchField } from './SearchField'
import { FilterSelect } from './FilterSelect'
import { StatsDisplay } from './StatsDisplay'

export function TableToolbar({
  searchQuery,
  onSearchChange,
  filterPeminatan,
  onFilterPeminatanChange,
  filterTahunAjaran,
  onFilterTahunAjaranChange,
  filterTingkat,
  onFilterTingkatChange,
  peminatanOptions,
  tahunAjaranOptions,
  tingkatOptions,
  hasActiveFilters,
  onClearFilters,
  stats,
  filteredCount,
  onAdd,
}) {
  return (
    <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
        <SearchField
          value={searchQuery}
          onChange={onSearchChange}
          placeholder="Cari siswa atau peminatan..."
        />

        <FilterSelect
          value={filterPeminatan}
          onChange={onFilterPeminatanChange}
          options={peminatanOptions}
          allLabel="📚 Semua Peminatan"
          minWidth="160px"
          renderOption={(p) => `${p.kode} - ${p.nama}`}
        />

        <FilterSelect
          value={filterTahunAjaran}
          onChange={onFilterTahunAjaranChange}
          options={tahunAjaranOptions}
          allLabel="📅 Semua Tahun"
          minWidth="140px"
          renderOption={(ta) => ta.nama}
        />

        <FilterSelect
          value={filterTingkat}
          onChange={onFilterTingkatChange}
          options={tingkatOptions}
          allLabel="🎓 Semua Tingkat"
          minWidth="120px"
          renderOption={(t) => `Tingkat ${t}`}
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

        <StatsDisplay
          total={stats.total}
          filtered={filteredCount}
          hasActiveFilters={hasActiveFilters}
        />

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
  )
}
