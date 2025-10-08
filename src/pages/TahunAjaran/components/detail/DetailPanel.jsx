import { TahunAjaranDetailSkeleton } from './TahunAjaranDetailSkeleton'
import { TahunAjaranDetailEmpty } from './TahunAjaranDetailEmpty'
import { TahunAjaranDetailInfo } from './TahunAjaranDetailInfo'
import { TahunAjaranStatistics } from './statistics'
import { Text } from '@radix-ui/themes'
import { Calendar } from 'lucide-react'

export function DetailPanel({ selectedItem, isLoading = false, isRefreshing = false }) {
  if (isLoading) {
    return <TahunAjaranDetailSkeleton />
  }

  if (!selectedItem) {
    return <TahunAjaranDetailEmpty />
  }

  const schoolName = import.meta.env.VITE_SCHOOL_NAME || 'Nama Sekolah'

  return (
    <div className="relative h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
      {isRefreshing ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent animate-pulse" />
      ) : null}

      {/* Header */}
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-indigo-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Tahun Ajaran
          </Text>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto excel-scrollbar">
        <div className="p-4 space-y-3">
          <TahunAjaranDetailInfo tahunAjaran={selectedItem} />
          
          {/* Statistics Section */}
          <TahunAjaranStatistics tahunAjaranId={selectedItem.id} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
        <Text size="1" className="text-slate-600 text-center block">
          Data Tahun Ajaran - {schoolName}
        </Text>
      </div>

      {/* Excel-style scrollbar */}
      <style>{`
        .excel-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        
        .excel-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-left: 1px solid #cbd5e1;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border: 2px solid #e2e8f0;
          transition: background 0.2s;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  )
}
