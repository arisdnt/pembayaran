import { Button } from '@radix-ui/themes'
import { X, UserPlus, Edit3 } from 'lucide-react'

export function FormFooter({ isEdit, submitting, onCancel, onSubmit }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
      <Button
        size="2"
        type="button"
        variant="soft"
        color="gray"
        disabled={submitting}
        onClick={onCancel}
        style={{ borderRadius: 0 }}
        className="cursor-pointer border border-slate-300 shadow-sm hover:shadow"
      >
        <X className="h-4 w-4" />
        Batal
      </Button>
      <Button
        size="2"
        onClick={onSubmit}
        disabled={submitting}
        style={{
          borderRadius: 0,
          backgroundColor: isEdit ? '#d97706' : '#16a34a',
          border: isEdit ? '1px solid #b45309' : '1px solid #15803d'
        }}
        className="cursor-pointer text-white shadow-sm hover:shadow"
      >
        {isEdit ? <Edit3 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
        {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
      </Button>
    </div>
  )
}
