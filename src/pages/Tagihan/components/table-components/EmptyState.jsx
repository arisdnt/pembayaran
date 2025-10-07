import { Text, Button } from '@radix-ui/themes'
import { Receipt } from 'lucide-react'

export function EmptyState({ hasActiveFilters, onClearFilters }) {
  return (
    <tr>
      <td colSpan={10} className="p-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 p-6 bg-slate-100 border-2 border-slate-300">
            <Receipt className="h-16 w-16 text-slate-400" />
          </div>
          {hasActiveFilters ? (
            <>
              <Text size="5" weight="bold" className="text-slate-700 mb-2">
                Tidak ada tagihan yang sesuai
              </Text>
              <Text size="3" className="text-slate-500 mb-6 max-w-md">
                Tidak ditemukan tagihan yang sesuai dengan filter yang Anda terapkan.
                Coba ubah atau reset filter.
              </Text>
              <Button
                onClick={onClearFilters}
                variant="soft"
                size="3"
                style={{ borderRadius: 0 }}
                className="cursor-pointer"
              >
                Reset Filter
              </Button>
            </>
          ) : (
            <>
              <Text size="5" weight="bold" className="text-slate-700 mb-2">
                Belum ada tagihan
              </Text>
              <Text size="3" className="text-slate-500 max-w-md">
                Belum ada data tagihan yang terdaftar. Klik tombol "Tambah Tagihan" untuk membuat tagihan baru.
              </Text>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
