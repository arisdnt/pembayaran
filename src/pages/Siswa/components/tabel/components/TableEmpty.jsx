import { Text, Button } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Users } from 'lucide-react'

export function TableEmpty({ hasActiveFilters, onClearFilters }) {
  return (
    <tr>
      <td colSpan={12} className="relative border-r-0">
        <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 bg-slate-50">
          {hasActiveFilters ? (
            <>
              <div className="mb-4 p-4 bg-slate-100 border border-slate-300">
                <MagnifyingGlassIcon className="h-12 w-12 text-slate-400" />
              </div>
              <Text size="4" weight="medium" className="text-slate-600 mb-2">
                Tidak ada data yang sesuai
              </Text>
              <Text size="2" className="text-slate-500 mb-5">
                Coba ubah kata kunci pencarian atau filter yang Anda gunakan
              </Text>
              <Button
                onClick={onClearFilters}
                variant="soft"
                size="2"
                style={{ borderRadius: 0 }}
                className="cursor-pointer shadow-sm"
              >
                Reset Pencarian
              </Button>
            </>
          ) : (
            <>
              <div className="mb-4 p-4 bg-slate-100 border border-slate-300">
                <Users className="h-12 w-12 text-slate-400" />
              </div>
              <Text size="4" weight="medium" className="text-slate-600 mb-2">
                Belum ada data siswa
              </Text>
              <Text size="2" className="text-slate-500">
                Tambahkan siswa baru melalui tombol di atas untuk mulai mengelola daftar ini.
              </Text>
            </>
          )}
        </div>
      </td>
    </tr>
  )
}
