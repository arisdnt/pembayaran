import { JenisPembayaranDetailSkeleton } from './JenisPembayaranDetailSkeleton'
import { JenisPembayaranDetailEmpty } from './JenisPembayaranDetailEmpty'
import { JenisPembayaranDetailInfo } from './JenisPembayaranDetailInfo'
import { Text } from '@radix-ui/themes'
import { DollarSign } from 'lucide-react'

export function DetailPanel({ selectedItem, isLoading = false, isRefreshing = false }) {
  const schoolName = import.meta.env.VITE_SCHOOL_NAME || 'Nama Sekolah'

  if (isLoading) {
    return <JenisPembayaranDetailSkeleton />
  }

  if (!selectedItem) {
    return <JenisPembayaranDetailEmpty />
  }

  return (
    <div className="relative h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
      {isRefreshing ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent animate-pulse" />
      ) : null}

      {/* Header */}
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-indigo-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Jenis Pembayaran
          </Text>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto excel-scrollbar">
        <div className="py-4 space-y-3">
          <JenisPembayaranDetailInfo jenisPembayaran={selectedItem} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
        <Text size="1" className="text-slate-600 text-center block">
          Data Jenis Pembayaran - {schoolName}
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
