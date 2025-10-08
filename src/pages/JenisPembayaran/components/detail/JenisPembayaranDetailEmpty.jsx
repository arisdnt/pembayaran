import { Text } from '@radix-ui/themes'
import { DollarSign, ChevronRight } from 'lucide-react'

export function JenisPembayaranDetailEmpty() {
  const schoolName = import.meta.env.VITE_SCHOOL_NAME || 'Nama Sekolah'

  return (
    <div className="relative h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-indigo-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Jenis Pembayaran
          </Text>
        </div>
      </div>

      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 mb-4">
          <DollarSign className="h-8 w-8 text-slate-300" />
        </div>
        <Text size="2" weight="medium" className="text-slate-500 mb-1">
          Tidak ada data dipilih
        </Text>
        <div className="flex items-center gap-1 text-slate-400 text-xs mt-2">
          <ChevronRight className="h-3 w-3" />
          <Text size="1">
            Pilih jenis pembayaran dari tabel untuk melihat detail
          </Text>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
        <Text size="1" className="text-slate-600 text-center block">
          Data Jenis Pembayaran - {schoolName}
        </Text>
      </div>
    </div>
  )
}
