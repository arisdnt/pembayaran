import { Button } from '@radix-ui/themes'
import { X, UserPlus, Edit3 } from 'lucide-react'

export function FormFooter({ isEdit, submitting, onCancel, onSubmit }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
      <Button
        type="button"
        variant="soft"
        color="gray"
        disabled={submitting}
        onClick={onCancel}
        style={{ borderRadius: 0 }}
        className="cursor-pointer border border-slate-300 shadow-sm hover:shadow"
      >
        <X className="h-3.5 w-3.5" />
        Batal
      </Button>
      <Button
        onClick={onSubmit}
        disabled={submitting}
        style={{
          borderRadius: 0,
          backgroundColor: isEdit ? '#d97706' : '#16a34a',
          border: isEdit ? '1px solid #b45309' : '1px solid #15803d'
        }}
        className="cursor-pointer text-white shadow-sm hover:shadow"
      >
        {isEdit ? <Edit3 className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
        {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
      </Button>
    </div>
  )
}
