import { Text } from '@radix-ui/themes'
import { Receipt, ArrowLeft, Save, Edit3 } from 'lucide-react'

export function CreateTagihanHeader({ onBack, onSubmit, submitting, canSubmit, isEdit = false }) {
  return (
    <div className="shrink-0 bg-white px-6 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isEdit ? (
            <Edit3 className="h-5 w-5 text-amber-600" />
          ) : (
            <Receipt className="h-5 w-5 text-green-600" />
          )}
          <Text size="4" weight="bold" className="text-slate-900">
            {isEdit ? 'Edit Tagihan' : 'Buat Tagihan Baru'}
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
            className={`flex items-center gap-2 px-4 py-2 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors ${
              isEdit 
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-green-600 hover:bg-green-700'
            }`}
            type="button"
          >
            <Save className="h-4 w-4" />
            <Text size="2" weight="medium" className="text-white">
              {submitting ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Simpan Tagihan'}
            </Text>
          </button>
        </div>
      </div>
    </div>
  )
}
