import { Button, Text } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Calendar } from 'lucide-react'

export function KelasEmptyState({ hasActiveFilters, onClearFilters }) {
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
                Coba ubah kata kunci pencarian atau filter yang Anda gunakan
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
              <Calendar className="h-12 w-12 text-slate-300 mb-4" />
              <Text size="3" className="text-slate-500 mb-1">
                Belum ada data kelas
              </Text>
              <Text size="2" className="text-slate-400">
                Tambahkan kelas baru melalui tombol di atas untuk mulai mengelola daftar ini.
              </Text>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
