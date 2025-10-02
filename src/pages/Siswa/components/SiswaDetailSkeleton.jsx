import { Text } from '@radix-ui/themes'
import { User } from 'lucide-react'

export function SiswaDetailSkeleton() {
  return (
    <div className="relative flex h-full flex-col border border-slate-300 bg-white shadow-lg">
      {/* Header */}
      <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Siswa
          </Text>
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 p-4 space-y-0 animate-pulse">
        {/* Nama section */}
        <div className="bg-slate-100 border border-slate-200 p-3 mb-3">
          <div className="h-3 w-20 bg-slate-200 mb-2" />
          <div className="h-5 w-40 bg-slate-200" />
        </div>

        {/* Fields */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border-b border-slate-200 pb-3 mb-3">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="h-3.5 w-3.5 bg-slate-200" />
              <div className="h-3 w-24 bg-slate-200" />
            </div>
            <div className="ml-5">
              <div className="h-4 w-32 bg-slate-200" />
            </div>
          </div>
        ))}

        {/* Metadata section */}
        <div className="pt-3 mt-3 border-t-2 border-slate-300 space-y-3">
          <div className="pb-2">
            <div className="flex items-center gap-1.5 mb-2">
              <div className="h-3.5 w-3.5 bg-slate-200" />
              <div className="h-3 w-20 bg-slate-200" />
            </div>
            <div className="ml-5">
              <div className="h-3 w-36 bg-slate-200" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
