import { Button } from '@radix-ui/themes'

export function FormActions({ submitting, isEdit, onCancel }) {
  return (
    <div className="flex items-center justify-end gap-3">
      <Button 
        type="button"
        variant="soft" 
        color="gray" 
        disabled={submitting}
        onClick={onCancel}
        style={{ borderRadius: 0 }}
        className="cursor-pointer border border-slate-300 shadow-sm hover:shadow"
      >
        Batal
      </Button>
      <Button 
        type="submit" 
        disabled={submitting} 
        style={{ 
          borderRadius: 0,
          backgroundColor: isEdit ? '#d97706' : '#059669',
          border: isEdit ? '1px solid #b45309' : '1px solid #047857'
        }}
        className="cursor-pointer text-white shadow-sm hover:shadow"
      >
        {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
      </Button>
    </div>
  )
}
