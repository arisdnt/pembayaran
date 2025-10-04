import { Dialog, Text } from '@radix-ui/themes'
import { Edit3, DollarSign, X } from 'lucide-react'

export function DialogHeader({ isEdit, onClose }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
      <div className="flex items-center gap-2.5">
        <div className={`flex h-10 w-10 items-center justify-center border shadow-sm ${
          isEdit ? 'bg-amber-600 border-amber-700' : 'bg-green-600 border-green-700'
        }`}>
          {isEdit ? <Edit3 className="h-5 w-5 text-white" /> : <DollarSign className="h-5 w-5 text-white" />}
        </div>
        <div>
          <Dialog.Title asChild>
            <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
              {isEdit ? 'Edit Jenis Pembayaran' : 'Tambah Jenis Pembayaran'}
            </Text>
          </Dialog.Title>
          <Dialog.Description asChild>
            <Text size="1" className="text-slate-600">
              {isEdit ? 'Perbarui informasi jenis pembayaran' : 'Tambahkan jenis pembayaran baru'}
            </Text>
          </Dialog.Description>
        </div>
      </div>
      <button
        onClick={() => onClose(false)}
        className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
        type="button"
      >
        <X className="h-4 w-4 text-slate-600 group-hover:text-red-600" />
      </button>
    </div>
  )
}
