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
  filterTahunId,
  setFilterTahunId,
  filterTingkat,
  setFilterTingkat,
  tahunList,
  tingkatList,
  stats,
  hasActiveFilters,
  handleClearFilters,
  onAdd,
}) {
  return (
    <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Grid 10 kolom: masing-masing 10% dan single-row, tidak wrap */}
      <div 
        className="grid items-center gap-2 px-4 py-2.5"
        style={{ 
          gridTemplateColumns: 'repeat(10, calc((100% - (9 * 0.5rem)) / 10))',
          gap: '0.5rem',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box'
        }}
      >
        {/* Kolom 1 (10%): Search Bar */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        </div>
        
        {/* Kolom 2 (10%): Filter Status */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <FilterControls
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterTahunId={filterTahunId}
            setFilterTahunId={setFilterTahunId}
            filterTingkat={filterTingkat}
            setFilterTingkat={setFilterTingkat}
            tahunList={tahunList}
            tingkatList={tingkatList}
            columnIndex={0}
          />
        </div>

        {/* Kolom 3 (10%): Filter Tahun Ajaran */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <FilterControls
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterTahunId={filterTahunId}
            setFilterTahunId={setFilterTahunId}
            filterTingkat={filterTingkat}
            setFilterTingkat={setFilterTingkat}
            tahunList={tahunList}
            tingkatList={tingkatList}
            columnIndex={1}
          />
        </div>

        {/* Kolom 4 (10%): Filter Tingkat */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <FilterControls
            filterStatus={filterStatus}
            setFilterStatus={setFilterStatus}
            filterTahunId={filterTahunId}
            setFilterTahunId={setFilterTahunId}
            filterTingkat={filterTingkat}
            setFilterTingkat={setFilterTingkat}
            tahunList={tahunList}
            tingkatList={tingkatList}
            columnIndex={2}
          />
        </div>

        {/* Kolom 5 (10%): Reset Button */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Button
            onClick={handleClearFilters}
            size="2"
            style={{ 
              borderRadius: 0, 
              height: '36px', 
              backgroundColor: '#dc2626',
              border: '1px solid #b91c1c'
            }}
            disabled={!hasActiveFilters}
            className={`cursor-pointer text-white hover:brightness-95 transition-colors w-full truncate ${!hasActiveFilters ? 'opacity-50' : ''}`}
          >
            <X className="h-4 w-4 flex-shrink-0 text-white" />
            <span className="truncate">Reset</span>
          </Button>
        </div>

        {/* Kolom 6-8 (30%): Reserved */}
        <div style={{ gridColumn: 'span 3' }} className="min-w-0 overflow-hidden" aria-hidden="true" />

        {/* Kolom 9 (10%): Stats Display */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <StatsDisplay stats={stats} hasActiveFilters={hasActiveFilters} />
        </div>

        {/* Kolom 10 (10%): Tambah Baru Button */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Button
            onClick={onAdd}
            className="cursor-pointer text-white font-medium shadow-sm hover:shadow transition-all w-full truncate"
            size="2"
            style={{ 
              borderRadius: 0,
              backgroundColor: '#0066cc',
              border: '1px solid #0052a3',
              height: '36px'
            }}
          >
            <Plus className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Tambah</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
