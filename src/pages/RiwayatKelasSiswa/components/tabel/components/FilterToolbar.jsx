import { Button, TextField, Select } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Plus, X } from 'lucide-react'

export function FilterToolbar({
  searchQuery,
  setSearchQuery,
  filterStatus,
  setFilterStatus,
  filterTahunAjaran,
  setFilterTahunAjaran,
  filterTingkatKelas,
  setFilterTingkatKelas,
  tahunAjaranOptions,
  tingkatKelasOptions,
  hasActiveFilters,
  onClearFilters,
  onAdd,
}) {
  return (
    <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
        <div className="flex-1 min-w-[240px] max-w-xs">
          <TextField.Root
            placeholder="Cari siswa, kelas, tahun..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="2"
            style={{
              borderRadius: 0,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff'
            }}
            className="font-sans"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
            {searchQuery && (
              <TextField.Slot>
                <button
                  onClick={() => setSearchQuery('')}
                  className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </TextField.Slot>
            )}
          </TextField.Root>
        </div>

        <div className="flex items-center gap-2">
          <Select.Root value={filterTahunAjaran} onValueChange={setFilterTahunAjaran}>
            <Select.Trigger
              style={{
                borderRadius: 0,
                minWidth: '160px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff'
              }}
              className="cursor-pointer font-sans"
            />
            <Select.Content style={{ borderRadius: 0 }}>
              <Select.Item value="all">📅 Semua Tahun Ajaran</Select.Item>
              {tahunAjaranOptions.slice(1).map((tahun) => (
                <Select.Item key={tahun} value={tahun}>{tahun}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <div className="flex items-center gap-2">
          <Select.Root value={filterTingkatKelas} onValueChange={setFilterTingkatKelas}>
            <Select.Trigger
              style={{
                borderRadius: 0,
                minWidth: '140px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff'
              }}
              className="cursor-pointer font-sans"
            />
            <Select.Content style={{ borderRadius: 0 }}>
              <Select.Item value="all">🏫 Semua Tingkat</Select.Item>
              {tingkatKelasOptions.slice(1).map((tingkat) => (
                <Select.Item key={tingkat} value={tingkat}>{tingkat}</Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        <div className="flex items-center gap-2">
          <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
            <Select.Trigger
              style={{
                borderRadius: 0,
                minWidth: '140px',
                border: '1px solid #cbd5e1',
                backgroundColor: '#ffffff'
              }}
              className="cursor-pointer font-sans"
            />
            <Select.Content style={{ borderRadius: 0 }}>
              <Select.Item value="all">📋 Semua Status</Select.Item>
              <Select.Item value="aktif">✅ Aktif</Select.Item>
              <Select.Item value="pindah_kelas">🔄 Pindah Kelas</Select.Item>
              <Select.Item value="lulus">🎓 Lulus</Select.Item>
              <Select.Item value="keluar">⭕ Keluar</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>

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

        <div className="ml-auto">
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
