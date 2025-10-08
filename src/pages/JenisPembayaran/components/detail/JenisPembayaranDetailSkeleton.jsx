import { Text } from '@radix-ui/themes'
import { DollarSign } from 'lucide-react'

export function JenisPembayaranDetailSkeleton() {
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

      {/* Skeleton Content */}
      <div className="flex-1 min-h-0 overflow-auto excel-scrollbar">
        <div className="py-4 space-y-3 animate-pulse">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="p-3 bg-slate-50 border border-slate-300 mx-4">
              <div className="h-3 w-24 bg-slate-200 mb-2" />
              <div className="h-4 w-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
        <div className="h-3 w-48 bg-slate-200 mx-auto" />
      </div>
    </div>
  )
}
