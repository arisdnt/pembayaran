import { Dialog, Text, Button } from '@radix-ui/themes'
import { Receipt, X } from 'lucide-react'
import { TagihanDetailInfo } from './TagihanDetailInfo'

export function TagihanDetailModal({ open, onOpenChange, tagihan }) {
  if (!tagihan) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{
          maxWidth: '1100px',
          width: '95vw',
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center border border-blue-700 bg-blue-600 shadow-sm">
              <Receipt className="h-4 w-4 text-white" />
            </div>
            <div>
              <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
                Detail Tagihan
              </Text>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="overflow-auto bg-white p-6" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <TagihanDetailInfo tagihan={tagihan} />
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
          <Button
            size="2"
            type="button"
            variant="soft"
            color="gray"
            onClick={() => onOpenChange(false)}
            style={{ borderRadius: 0 }}
            className="cursor-pointer border border-slate-300 shadow-sm hover:shadow flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Tutup
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
