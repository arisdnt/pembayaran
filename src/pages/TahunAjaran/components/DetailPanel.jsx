import { TahunAjaranDetailSkeleton } from './TahunAjaranDetailSkeleton'
import { TahunAjaranDetailEmpty } from './TahunAjaranDetailEmpty'
import { TahunAjaranDetailInfo } from './TahunAjaranDetailInfo'
import { Text } from '@radix-ui/themes'
import { Calendar } from 'lucide-react'

export function DetailPanel({ selectedItem, isLoading = false, isRefreshing = false }) {
  if (isLoading) {
    return <TahunAjaranDetailSkeleton />
  }

  if (!selectedItem) {
    return <TahunAjaranDetailEmpty />
  }

  return (
    <div className="relative flex h-full flex-col border border-slate-300 bg-white shadow-lg">
      {/* Header - Excel style */}
      <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Tahun Ajaran
          </Text>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-4">
        <TahunAjaranDetailInfo tahunAjaran={selectedItem} />
      </div>
    </div>
  )
}
