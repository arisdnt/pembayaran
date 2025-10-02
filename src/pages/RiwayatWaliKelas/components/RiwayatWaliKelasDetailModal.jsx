import { Dialog, Text } from '@radix-ui/themes'
import { UserCheck, X } from 'lucide-react'
import { RiwayatWaliKelasDetailInfo } from './RiwayatWaliKelasDetailInfo'

export function RiwayatWaliKelasDetailModal({ open, onOpenChange, riwayat }) {
  if (!riwayat) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{
          maxWidth: '1100px',
          width: '95vw',
          maxHeight: '90vh',
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
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                Detail Riwayat Wali Kelas
              </Text>
              <Text size="1" className="text-slate-600">
                Informasi lengkap riwayat penugasan wali kelas
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
        <div className="overflow-auto bg-white p-6" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          <RiwayatWaliKelasDetailInfo riwayat={riwayat} />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
