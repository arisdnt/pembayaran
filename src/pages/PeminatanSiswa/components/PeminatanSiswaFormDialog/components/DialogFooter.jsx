import { BookOpen, Edit3, X } from 'lucide-react'

export function DialogFooter({ isEdit, submitting, onCancel, onSubmit }) {
  return (
    <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
      <div className="flex items-center justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={submitting}
          className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold transition-colors shadow-sm hover:shadow border border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ borderRadius: 0 }}
        >
          <span className="flex items-center gap-2"><X className="h-4 w-4" />Batal</span>
        </button>
        <button
          type="submit"
          disabled={submitting}
          onClick={onSubmit}
          className={`px-5 py-2 text-white text-sm font-semibold transition-colors shadow-sm hover:shadow border disabled:opacity-50 disabled:cursor-not-allowed ${
            isEdit ? 'bg-amber-600 hover:bg-amber-700 border-amber-700' : 'bg-green-600 hover:bg-green-700 border-green-700'
          }`}
          style={{ borderRadius: 0 }}
        >
          <span className="flex items-center gap-2">
            {isEdit ? <Edit3 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
            {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
          </span>
        </button>
      </div>
    </div>
  )
}
