import { Button, TextField } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Plus, X } from 'lucide-react'
import { formatCurrency } from '../utils/helpers'

export function RincianTagihanTableHeader({
  searchQuery,
  setSearchQuery,
  stats,
  hasActiveFilters,
  onClearFilters,
  onAdd,
}) {
  return (
    <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white">
      <div className="flex flex-wrap items-center gap-4 px-6 py-4">
        <div className="flex-1 min-w-[240px] max-w-xs">
          <TextField.Root
            placeholder="Cari tagihan, jenis..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="2"
            style={{ borderRadius: 0 }}
          >
            <TextField.Slot>
              <MagnifyingGlassIcon height="16" width="16" />
            </TextField.Slot>
            {searchQuery && (
              <TextField.Slot>
                <button
                  onClick={() => setSearchQuery('')}
                  className="cursor-pointer text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </TextField.Slot>
            )}
          </TextField.Root>
        </div>

        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="soft"
            color="gray"
            size="2"
            style={{ borderRadius: 0 }}
            className="cursor-pointer"
          >
            <X className="h-4 w-4" />
          </Button>
        )}

        <div className="ml-auto flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200">
            <span className="text-slate-500">Total Item:</span>
            <span className="font-semibold text-slate-900">{stats.total}</span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200">
            <span className="text-emerald-700">Total Nilai:</span>
            <span className="font-semibold text-emerald-900">{formatCurrency(stats.totalJumlah)}</span>
          </div>
          {hasActiveFilters && (
            <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-200">
              <span className="text-blue-700">Ditampilkan:</span>
              <span className="font-semibold text-blue-900">{stats.filtered}</span>
            </div>
          )}
        </div>

        <div>
          <Button
            onClick={onAdd}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
            size="2"
            style={{ borderRadius: 0 }}
          >
            <Plus className="h-4 w-4" />
            Tambah Rincian
          </Button>
        </div>
      </div>
    </div>
  )
}
