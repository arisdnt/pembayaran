import { Text } from '@radix-ui/themes'
import { Users, User } from 'lucide-react'

export function SiswaDetailEmpty() {
  return (
    <div className="flex h-full flex-col border border-slate-300 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Siswa
          </Text>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center">
          <div className="mb-4 p-4 bg-slate-100 border border-slate-300 inline-block">
            <Users className="h-12 w-12 text-slate-400" />
          </div>
          <Text size="3" weight="medium" className="text-slate-600 mb-2 block">
            Tidak ada data dipilih
          </Text>
          <Text size="2" className="text-slate-500">
            Pilih baris pada tabel untuk melihat detail
          </Text>
        </div>
      </div>
    </div>
  )
}
