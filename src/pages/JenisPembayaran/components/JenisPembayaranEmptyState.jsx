import { Button, Text } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { CreditCard } from 'lucide-react'

export function JenisPembayaranEmptyState({ hasActiveFilters, onClearFilters }) {
  return (
    <tr>
      <td colSpan={9} className="relative">
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
          {hasActiveFilters ? (
            <>
              <MagnifyingGlassIcon className="h-12 w-12 text-slate-300 mb-4" />
              <Text size="3" className="text-slate-500 mb-1">
                Tidak ada data yang sesuai
              </Text>
              <Text size="2" className="text-slate-400 mb-4">
                Coba ubah filter pencarian
              </Text>
              <Button
                onClick={onClearFilters}
                variant="soft"
                size="2"
                style={{ borderRadius: 0 }}
                className="cursor-pointer"
              >
                Reset Filter
              </Button>
            </>
          ) : (
            <>
              <CreditCard className="h-12 w-12 text-slate-300 mb-4" />
              <Text size="3" className="text-slate-500 mb-1">
                Belum ada jenis pembayaran
              </Text>
              <Text size="2" className="text-slate-400">
                Tambahkan jenis pembayaran baru melalui tombol di atas.
              </Text>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
