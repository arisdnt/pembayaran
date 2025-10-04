import { Text } from '@radix-ui/themes'
import { Edit3, UserPlus, X } from 'lucide-react'

export function FormDialogHeader({ isEdit, onClose }) {
  return (
    <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
      <div className="flex items-center gap-2.5">
        <div className={`flex h-10 w-10 items-center justify-center border shadow-sm ${
          isEdit ? 'bg-amber-600 border-amber-700' : 'bg-green-600 border-green-700'
        }`}>
          {isEdit ? (
            <Edit3 className="h-5 w-5 text-white" />
          ) : (
            <UserPlus className="h-5 w-5 text-white" />
          )}
        </div>
        <div>
          <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
            {isEdit ? 'Edit Siswa' : 'Tambah Siswa'}
          </Text>
          <Text size="1" className="text-slate-500 block mt-0.5">
            {isEdit ? 'Perbarui informasi siswa' : 'Tambahkan siswa baru ke sistem'}
          </Text>
        </div>
      </div>
      <button
        onClick={onClose}
        className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
        aria-label="Close"
        type="button"
      >
        <X className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
      </button>
    </div>
  )
}
