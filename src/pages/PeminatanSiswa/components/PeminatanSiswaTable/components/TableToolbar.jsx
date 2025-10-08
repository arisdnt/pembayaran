import { Button } from '@radix-ui/themes'
import { Plus, X, BookOpen, Calendar, GraduationCap } from 'lucide-react'
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
      <div
        className="grid items-center gap-2 px-4 py-2.5"
        style={{
          gridTemplateColumns: 'repeat(10, calc((100% - (9 * 0.5rem)) / 10))',
          gap: '0.5rem',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box'
        }}
      >
        {/* Kolom 1: Search */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <SearchField
            value={searchQuery}
            onChange={onSearchChange}
            placeholder="Cari siswa atau peminatan..."
          />
        </div>

        {/* Kolom 2: Peminatan */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <FilterSelect
            value={filterPeminatan}
            onChange={onFilterPeminatanChange}
            options={peminatanOptions}
            allLabel={<span className="flex items-center gap-2"><BookOpen className="h-3.5 w-3.5 text-purple-600" /> <span>Semua Peminatan</span></span>}
            minWidth="140px"
            renderOption={(p) => (
              <span className="flex items-center gap-2">
                <BookOpen className="h-3.5 w-3.5 text-purple-600" />
                <span>{p.kode} - {p.nama}</span>
              </span>
            )}
          />
        </div>

        {/* Kolom 3: Tahun Ajaran */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <FilterSelect
            value={filterTahunAjaran}
            onChange={onFilterTahunAjaranChange}
            options={tahunAjaranOptions}
            allLabel={<span className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-blue-600" /> <span>Semua Tahun</span></span>}
            minWidth="140px"
            renderOption={(ta) => (
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
                <span>{ta.nama}</span>
              </span>
            )}
          />
        </div>

        {/* Kolom 4: Tingkat */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <FilterSelect
            value={filterTingkat}
            onChange={onFilterTingkatChange}
            options={tingkatOptions}
            allLabel={<span className="flex items-center gap-2"><GraduationCap className="h-3.5 w-3.5 text-indigo-600" /> <span>Semua Tingkat</span></span>}
            minWidth="120px"
            renderOption={(t) => (
              <span className="flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                <span>Tingkat {t}</span>
              </span>
            )}
          />
        </div>

        {/* Kolom 5: Reset */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Button
            onClick={onClearFilters}
            size="2"
            style={{ borderRadius: 0, height: '36px', backgroundColor: '#dc2626', border: '1px solid #b91c1c' }}
            disabled={!hasActiveFilters}
            className={`cursor-pointer text-white hover:brightness-95 transition-colors w-full truncate ${!hasActiveFilters ? 'opacity-50' : ''}`}
          >
            <X className="h-4 w-4 flex-shrink-0 text-white" />
            <span className="truncate">Reset</span>
          </Button>
        </div>

        {/* Kolom 6-8: Reserved */}
        <div style={{ gridColumn: 'span 3' }} className="min-w-0 overflow-hidden" aria-hidden="true" />

        {/* Kolom 9: Statcard T/A */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <StatsDisplay total={stats.total} filtered={filteredCount} />
        </div>

        {/* Kolom 10: Tambah */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Button
            onClick={onAdd}
            className="cursor-pointer text-white font-medium shadow-sm hover:shadow transition-all w-full truncate"
            size="2"
            style={{ borderRadius: 0, backgroundColor: '#0066cc', border: '1px solid #0052a3', height: '36px' }}
          >
            <Plus className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Tambah</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
