import { useState } from 'react'
import { Dialog, Button, Text } from '@radix-ui/themes'
import { AlertTriangle, X } from 'lucide-react'

export function DeleteConfirmDialog({
  open,
  onOpenChange,
  onConfirm,
  itemName,
  title = 'Hapus Data',
  description = 'Apakah Anda yakin ingin menghapus'
}) {
  const [submitting, setSubmitting] = useState(false)

  const handleDelete = async () => {
    setSubmitting(true)
    try {
      await onConfirm()
      onOpenChange(false)
    } catch (err) {
      console.error('Delete failed:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{
          maxWidth: '500px',
          width: '95vw',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header - Excel style */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-red-50 to-red-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center border border-red-700 bg-red-600 shadow-sm">
              <AlertTriangle className="h-5 w-5 text-white" />
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                {title}
              </Text>
              <Text size="1" className="text-slate-600">
                Konfirmasi penghapusan data
              </Text>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-100 hover:border-red-400 transition-all border border-slate-300 group"
            aria-label="Close"
            type="button"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-white p-6">
          <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-200 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
            <div>
              <Text size="2" weight="medium" className="text-red-900 mb-1 block">
                Peringatan
              </Text>
              <Text size="2" className="text-red-700">
                Tindakan ini tidak dapat dibatalkan. Data yang sudah dihapus tidak dapat dikembalikan.
              </Text>
            </div>
          </div>

          <Text size="2" className="text-slate-700 leading-relaxed">
            {description} <strong className="text-slate-900 font-semibold">{itemName}</strong>?
          </Text>
        </div>

        {/* Footer - Excel style */}
        <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <Button
            type="button"
            variant="soft"
            color="gray"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
            style={{ borderRadius: 0 }}
            className="cursor-pointer border border-slate-300 shadow-sm hover:shadow"
          >
            Batal
          </Button>
          <Button
            onClick={handleDelete}
            disabled={submitting}
            style={{
              borderRadius: 0,
              backgroundColor: '#dc2626',
              border: '1px solid #b91c1c'
            }}
            className="cursor-pointer text-white shadow-sm hover:shadow"
          >
            {submitting ? 'Menghapus...' : 'Hapus'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
