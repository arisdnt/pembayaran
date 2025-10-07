import { Button, Text } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Wallet } from 'lucide-react'

export function PembayaranEmptyState({ hasActiveFilters, onClearFilters }) {
  return (
    <tr>
      <td colSpan={6} className="relative">
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
          {hasActiveFilters ? (
            <>
              <MagnifyingGlassIcon className="h-12 w-12 text-slate-300 mb-4" />
              <Text size="3" className="text-slate-500 mb-1">
                Tidak ada data yang sesuai
              </Text>
              <Text size="2" className="text-slate-400 mb-4">
                Coba ubah kata kunci pencarian
              </Text>
              <Button
                onClick={onClearFilters}
                variant="soft"
                size="2"
                style={{ borderRadius: 0 }}
                className="cursor-pointer"
              >
                Reset Pencarian
              </Button>
            </>
          ) : (
            <>
              <Wallet className="h-12 w-12 text-slate-300 mb-4" />
              <Text size="3" className="text-slate-500 mb-1">
                Belum ada pembayaran
              </Text>
              <Text size="2" className="text-slate-400">
                Tambahkan pembayaran baru melalui tombol di atas.
              </Text>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
