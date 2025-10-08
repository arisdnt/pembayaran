import { TextField, Select, Button } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Plus, X, Calendar, GraduationCap, FileText } from 'lucide-react'

export function FilterToolbar({
  searchQuery,
  setSearchQuery,
  filterTahunAjaran,
  setFilterTahunAjaran,
  filterTingkatKelas,
  setFilterTingkatKelas,
  filterJudul,
  setFilterJudul,
  tahunAjaranList,
  tingkatKelasOptions,
  judulOptions,
  hasActiveFilters,
  onClearFilters,
  stats,
  onAdd,
}) {
  return (
    <div className="border-b border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
      <div
        className="grid items-center gap-2"
        style={{
          gridTemplateColumns: 'repeat(10, calc((100% - (9 * 0.5rem)) / 10))',
          gap: '0.5rem',
          whiteSpace: 'nowrap',
          boxSizing: 'border-box'
        }}
      >
        {/* Kolom 1: Search */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <TextField.Root
            placeholder="Cari nomor, judul, siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="2"
            style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', height: '36px' }}
            className="font-sans w-full"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
            {searchQuery && (
              <TextField.Slot>
                <button onClick={() => setSearchQuery('')} className="cursor-pointer text-slate-400 hover:text-slate-600 flex-shrink-0" type="button">
                  <X className="h-4 w-4" />
                </button>
              </TextField.Slot>
            )}
          </TextField.Root>
        </div>

        {/* Kolom 2: Tahun Ajaran */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Select.Root value={filterTahunAjaran} onValueChange={setFilterTahunAjaran}>
            <Select.Trigger placeholder="Pilih Tahun Ajaran" style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', width: '100%', height: '36px' }} className="cursor-pointer font-sans truncate text-sm px-2" />
            <Select.Content
              style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }}
              position="popper"
              sideOffset={4}
            >
              <Select.Item value="all" className="cursor-pointer hover:bg-slate-100">
                <span className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" />
                  <span>Semua Tahun Ajaran</span>
                </span>
              </Select.Item>
              {tahunAjaranList.map((tahun) => (
                <Select.Item key={tahun.id} value={tahun.id} className="cursor-pointer hover:bg-slate-100">
                  <span className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-blue-600" />
                    <span>{tahun.nama}</span>
                  </span>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        {/* Kolom 3: Tingkat */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Select.Root value={filterTingkatKelas} onValueChange={setFilterTingkatKelas}>
            <Select.Trigger placeholder="Pilih Tingkat Kelas" style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', width: '100%', height: '36px' }} className="cursor-pointer font-sans truncate text-sm px-2" />
            <Select.Content
              style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }}
              position="popper"
              sideOffset={4}
            >
              <Select.Item value="all" className="cursor-pointer hover:bg-slate-100">
                <span className="flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                  <span>Semua Tingkat</span>
                </span>
              </Select.Item>
              {tingkatKelasOptions.slice(1).map((tingkat) => (
                <Select.Item key={tingkat} value={tingkat} className="cursor-pointer hover:bg-slate-100">
                  <span className="flex items-center gap-2">
                    <GraduationCap className="h-3.5 w-3.5 text-indigo-600" />
                    <span>Tingkat {tingkat}</span>
                  </span>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        {/* Kolom 4: Judul Tagihan */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Select.Root value={filterJudul} onValueChange={setFilterJudul}>
            <Select.Trigger placeholder="Pilih Judul Tagihan" style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', width: '100%', height: '36px' }} className="cursor-pointer font-sans truncate text-sm px-2" />
            <Select.Content
              style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }}
              position="popper"
              sideOffset={4}
            >
              <Select.Item value="all" className="cursor-pointer hover:bg-slate-100">
                <span className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-slate-700" />
                  <span>Semua Judul Tagihan</span>
                </span>
              </Select.Item>
              {judulOptions.slice(1).map((judul) => (
                <Select.Item key={judul} value={judul} className="cursor-pointer hover:bg-slate-100">
                  <span className="flex items-center gap-2">
                    <FileText className="h-3.5 w-3.5 text-slate-700" />
                    <span>{judul}</span>
                  </span>
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        {/* Kolom 5: Reset */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Button onClick={onClearFilters} size="2" style={{ borderRadius: 0, height: '36px', backgroundColor: '#dc2626', border: '1px solid #b91c1c' }} className={`cursor-pointer text-white hover:brightness-95 transition-colors w-full truncate ${!hasActiveFilters ? 'opacity-50' : ''}`} disabled={!hasActiveFilters}>
            <X className="h-4 w-4 flex-shrink-0 text-white" />
            <span className="truncate">Reset</span>
          </Button>
        </div>

        {/* Kolom 6-8: Reserved */}
        <div style={{ gridColumn: 'span 3' }} className="min-w-0 overflow-hidden" aria-hidden="true" />

        {/* Kolom 9: Statcard */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <div className="grid grid-cols-2 items-center border border-slate-300 shadow-sm overflow-hidden" style={{ borderRadius: 0, height: '36px' }}>
            <div className="flex items-center justify-center px-2 min-w-0">
              <span className="text-slate-800 text-xs font-semibold tracking-wide truncate">T : {stats.total}</span>
            </div>
            <div className="flex items-center justify-center px-2 min-w-0 border-l border-slate-300">
              <span className="text-emerald-700 text-xs font-semibold tracking-wide truncate">A : {stats.filtered}</span>
            </div>
          </div>
        </div>

        {/* Kolom 10: Tambah */}
        <div style={{ gridColumn: 'span 1' }} className="min-w-0 overflow-hidden">
          <Button onClick={onAdd} className="cursor-pointer text-white font-medium shadow-sm hover:shadow transition-all w-full truncate" size="2" style={{ borderRadius: 0, backgroundColor: '#0066cc', border: '1px solid #0052a3', height: '36px' }}>
            <Plus className="h-4 w-4 flex-shrink-0" />
            <span className="truncate">Tambah</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
