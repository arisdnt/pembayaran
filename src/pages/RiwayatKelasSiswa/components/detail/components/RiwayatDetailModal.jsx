import { Dialog, Text } from '@radix-ui/themes'
import { BookOpen, X } from 'lucide-react'
import { RiwayatDetailInfo } from './RiwayatDetailInfo'

export function RiwayatDetailModal({ open, onOpenChange, riwayat }) {
  if (!riwayat) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{
          maxWidth: '800px',
          width: '95vw',
          maxHeight: '85vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header - Excel style */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center border border-blue-700 bg-blue-600 shadow-sm">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                Detail Riwayat Kelas
              </Text>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
            aria-label="Close"
            type="button"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-auto bg-white p-6" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          <RiwayatDetailInfo riwayat={riwayat} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold transition-colors shadow-sm hover:shadow border border-slate-400"
            style={{ borderRadius: 0 }}
          >
            <span className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Tutup
            </span>
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
