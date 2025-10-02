import { Text } from '@radix-ui/themes'
import { Wallet, ArrowLeft, Save } from 'lucide-react'

export function CreatePembayaranHeader({ onBack, onSubmit, submitting, canSubmit }) {
  return (
    <div className="shrink-0 bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-green-600" />
          <Text size="4" weight="bold" className="text-slate-900">
            Buat Pembayaran Baru
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
            type="button"
          >
            <ArrowLeft className="h-4 w-4 text-slate-600" />
            <Text size="2" weight="medium" className="text-slate-700">
              Kembali
            </Text>
          </button>
          <button
            onClick={onSubmit}
            disabled={submitting || !canSubmit}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
            type="button"
          >
            <Save className="h-4 w-4" />
            <Text size="2" weight="medium" className="text-white">
              {submitting ? 'Menyimpan...' : 'Simpan Pembayaran'}
            </Text>
          </button>
        </div>
      </div>
    </div>
  )
}
