import { Text } from '@radix-ui/themes'
import { DollarSign } from 'lucide-react'

export function JenisPembayaranDetailSkeleton() {
  return (
    <div className="relative flex h-full flex-col border border-slate-300 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Jenis Pembayaran
          </Text>
        </div>
      </div>

      {/* Skeleton Content */}
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4 animate-pulse">
          {/* Nama section */}
          <div className="bg-slate-50 border border-slate-200 p-3">
            <div className="h-3 w-20 bg-slate-200 mb-2" />
            <div className="h-5 w-full bg-slate-200" />
          </div>

          {/* Fields */}
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="border-b border-slate-200 pb-3">
              <div className="h-3 w-24 bg-slate-200 mb-2" />
              <div className="ml-5">
                <div className="h-4 w-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
