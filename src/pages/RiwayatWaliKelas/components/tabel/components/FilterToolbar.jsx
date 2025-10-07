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
  tahunAjaranList,
  hasActiveFilters,
  onClearFilters,
  stats,
  onAdd,
}) {
  return (
    <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
        <div className="flex-1 min-w-[240px] max-w-xs">
          <TextField.Root
            placeholder="Cari wali kelas, kelas..."
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
              <Select.Item value="selesai">○ Selesai</Select.Item>
              <Select.Item value="diganti">🔄 Diganti</Select.Item>
            </Select.Content>
          </Select.Root>
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
              {tahunAjaranList.map((tahun) => (
                <Select.Item key={tahun.id} value={tahun.id}>
                  {tahun.nama}
                </Select.Item>
              ))}
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

        <div className="ml-auto flex items-center gap-1.5 text-xs font-medium">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 shadow-sm">
            <span className="text-slate-600">Total:</span>
            <span className="font-bold text-slate-900">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 shadow-sm">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600" />
            <span className="text-emerald-700">Aktif:</span>
            <span className="font-bold text-emerald-900">{stats.aktif}</span>
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-300 shadow-sm">
              <span className="text-blue-700">Tampil:</span>
              <span className="font-bold text-blue-900">{stats.filtered}</span>
            </div>
          )}
        </div>

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
