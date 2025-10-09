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
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center border-b-2 border-slate-300 bg-gradient-to-b from-orange-50 to-orange-100 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center border border-orange-700 bg-orange-600 shadow-sm">
              <AlertTriangle className="h-4 w-4 text-white" />
            </div>
            <div>
              <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
                {title}
              </Text>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-3">
          <div className="flex items-start gap-3 p-2 bg-orange-50 border-2 border-orange-200">
            <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <Text size="2" weight="medium" className="text-orange-900 mb-1 block">
                {description} <strong className="font-semibold">{itemName}</strong>?
              </Text>
              <Text size="2" className="text-orange-700">
                Tindakan ini tidak dapat dibatalkan. Data yang sudah dihapus tidak dapat dikembalikan.
              </Text>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
          <Button
            size="2"
            type="button"
            variant="soft"
            color="gray"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
            style={{ borderRadius: 0 }}
            className="cursor-pointer border border-slate-300 shadow-sm hover:shadow flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Batal
          </Button>
          <Button
            size="2"
            onClick={handleDelete}
            disabled={submitting}
            style={{
              borderRadius: 0,
              backgroundColor: '#dc2626',
              border: '1px solid #b91c1c'
            }}
            className="cursor-pointer text-white shadow-sm hover:shadow flex items-center gap-2"
          >
            <AlertTriangle className="h-4 w-4" />
            {submitting ? 'Menghapus...' : 'Hapus'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
