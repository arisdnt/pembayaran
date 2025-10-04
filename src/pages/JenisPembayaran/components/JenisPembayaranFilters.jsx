import { Badge, TextField, Select, Button } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Plus, X } from 'lucide-react'

export function JenisPembayaranFilters({
  searchQuery,
  setSearchQuery,
  filterTipe,
  setFilterTipe,
  filterStatus,
  setFilterStatus,
  filterTahunId,
  setFilterTahunId,
  filterTingkat,
  setFilterTingkat,
  tahunList,
  tingkatList,
  hasActiveFilters,
  handleClearFilters,
  onAdd,
  stats,
}) {
  return (
    <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100">
      <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
        {/* Search */}
        <div className="flex-1 min-w-[200px] max-w-xs">
          <TextField.Root
            placeholder="Cari kode atau nama..."
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
                  type="button"
                >
                  <X className="h-4 w-4" />
                </button>
              </TextField.Slot>
            )}
          </TextField.Root>
        </div>

        {/* Filter Tipe */}
        <Select.Root value={filterTipe} onValueChange={setFilterTipe}>
          <Select.Trigger
            placeholder="Tipe"
            style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', width: '140px' }}
          />
          <Select.Content style={{ borderRadius: 0 }}>
            <Select.Item value="all">Semua Tipe</Select.Item>
            <Select.Item value="bulanan">Bulanan</Select.Item>
            <Select.Item value="tahunan">Tahunan</Select.Item>
            <Select.Item value="sekali">Sekali</Select.Item>
          </Select.Content>
        </Select.Root>

        {/* Filter Status */}
        <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
          <Select.Trigger
            placeholder="Status"
            style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', width: '130px' }}
          />
          <Select.Content style={{ borderRadius: 0 }}>
            <Select.Item value="all">Semua Status</Select.Item>
            <Select.Item value="active">Aktif</Select.Item>
            <Select.Item value="inactive">Nonaktif</Select.Item>
          </Select.Content>
        </Select.Root>

        {/* Filter Tahun Ajaran */}
        <Select.Root value={filterTahunId} onValueChange={setFilterTahunId}>
          <Select.Trigger
            placeholder="Tahun Ajaran"
            style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', width: '150px' }}
          />
          <Select.Content style={{ borderRadius: 0 }}>
            <Select.Item value="all">Semua Tahun</Select.Item>
            {tahunList.map((tahun) => (
              <Select.Item key={tahun.id} value={tahun.id}>
                {tahun.nama}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        {/* Filter Tingkat */}
        <Select.Root value={filterTingkat} onValueChange={setFilterTingkat}>
          <Select.Trigger
            placeholder="Tingkat"
            style={{ borderRadius: 0, border: '1px solid #cbd5e1', backgroundColor: '#ffffff', width: '140px' }}
          />
          <Select.Content style={{ borderRadius: 0 }}>
            <Select.Item value="all">Semua Tingkat</Select.Item>
            {tingkatList.map((tingkat) => (
              <Select.Item key={tingkat} value={tingkat}>
                Tingkat {tingkat}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            onClick={handleClearFilters}
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

        {/* Spacer */}
        <div className="flex-1 min-w-[20px]" />

        {/* Add Button */}
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
