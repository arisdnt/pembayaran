import { TextField, Select, Button } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Plus, X } from 'lucide-react'

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
  onAdd,
}) {
  return (
    <div className="border-b border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[240px] max-w-xs">
          <TextField.Root
            placeholder="Cari nomor, judul, siswa..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="2"
            style={{ borderRadius: 0 }}
            className="border-slate-300"
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
            {searchQuery && (
              <TextField.Slot>
                <button
                  onClick={() => setSearchQuery('')}
                  className="cursor-pointer text-slate-400 hover:text-slate-600"
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </TextField.Slot>
            )}
          </TextField.Root>
        </div>

        <Select.Root value={filterTahunAjaran} onValueChange={setFilterTahunAjaran}>
          <Select.Trigger
            placeholder="Pilih Tahun Ajaran"
            style={{ borderRadius: 0, minWidth: '160px' }}
            className="border border-slate-300 bg-white text-slate-700 cursor-pointer"
          />
          <Select.Content style={{ borderRadius: 0 }}>
            <Select.Item value="all">📅 Semua Tahun Ajaran</Select.Item>
            {tahunAjaranList.map((tahun) => (
              <Select.Item key={tahun.id} value={tahun.id}>
                {tahun.nama}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Select.Root value={filterTingkatKelas} onValueChange={setFilterTingkatKelas}>
          <Select.Trigger
            placeholder="Pilih Tingkat Kelas"
            style={{ borderRadius: 0, minWidth: '160px' }}
            className="border border-slate-300 bg-white text-slate-700 cursor-pointer"
          />
          <Select.Content style={{ borderRadius: 0 }}>
            <Select.Item value="all">🏫 Semua Tingkat</Select.Item>
            {tingkatKelasOptions.slice(1).map((tingkat) => (
              <Select.Item key={tingkat} value={tingkat}>
                Tingkat {tingkat}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        <Select.Root value={filterJudul} onValueChange={setFilterJudul}>
          <Select.Trigger
            placeholder="Pilih Judul Tagihan"
            style={{ borderRadius: 0, minWidth: '180px' }}
            className="border border-slate-300 bg-white text-slate-700 cursor-pointer"
          />
          <Select.Content style={{ borderRadius: 0 }}>
            <Select.Item value="all">📝 Semua Judul Tagihan</Select.Item>
            {judulOptions.slice(1).map((judul) => (
              <Select.Item key={judul} value={judul}>
                {judul}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

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
            Tambah Tagihan
          </Button>
        </div>
      </div>
    </div>
  )
}
