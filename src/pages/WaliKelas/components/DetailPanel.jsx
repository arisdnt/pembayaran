import { WaliKelasDetailSkeleton } from './WaliKelasDetailSkeleton'
import { WaliKelasDetailEmpty } from './WaliKelasDetailEmpty'
import { WaliKelasDetailInfo } from './WaliKelasDetailInfo'
import { Text } from '@radix-ui/themes'
import { UserCheck } from 'lucide-react'

export function DetailPanel({ selectedItem, isLoading = false, isRefreshing = false }) {
  if (isLoading) {
    return <WaliKelasDetailSkeleton />
  }

  if (!selectedItem) {
    return <WaliKelasDetailEmpty />
  }

  return (
    <div className="relative flex h-full flex-col border border-slate-300 bg-white shadow-lg">
      {/* Header - Excel style */}
      <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <UserCheck className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Wali Kelas
          </Text>
        </div>
      </div>

      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse z-10" />
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <WaliKelasDetailInfo waliKelas={selectedItem} />
      </div>
    </div>
  )
}
