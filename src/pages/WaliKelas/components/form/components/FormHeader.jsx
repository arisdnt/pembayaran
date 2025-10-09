import { Text } from '@radix-ui/themes'
import { UserPlus, Edit3, X } from 'lucide-react'

export function FormHeader({ isEdit, onClose }) {
  return (
    <div className="flex items-center border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
      <div className="flex items-center gap-2">
        <div className={`flex h-7 w-7 items-center justify-center border shadow-sm ${
          isEdit ? 'bg-amber-600 border-amber-700' : 'bg-green-600 border-green-700'
        }`}>
          {isEdit ? (
            <Edit3 className="h-4 w-4 text-white" />
          ) : (
            <UserPlus className="h-4 w-4 text-white" />
          )}
        </div>
        <div>
          <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
            {isEdit ? 'Edit Wali Kelas' : 'Tambah Wali Kelas'}
          </Text>
        </div>
      </div>
    </div>
  )
}
