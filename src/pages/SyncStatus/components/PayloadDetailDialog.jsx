import { Dialog, Text } from '@radix-ui/themes'
import { XCircle } from 'lucide-react'

export function PayloadDetailDialog({ selectedItem, onClose }) {
  return (
    <Dialog.Root open={!!selectedItem} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Content
        style={{
          maxWidth: '640px',
          width: '95vw',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden',
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {selectedItem && (
          <div className="bg-white">
            <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
              <div>
                <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                  Detail Payload
                </Text>
                <Text size="1" className="text-red-600 block mt-0.5 font-medium">
                  Tabel: {selectedItem.table} • Operasi: {selectedItem.op}
                </Text>
              </div>
              <Dialog.Close asChild>
                <button
                  className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
                  aria-label="Tutup"
                  type="button"
                >
                  <XCircle className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
                </button>
              </Dialog.Close>
            </div>
            <div className="p-5">
              <div className="max-h-96 overflow-auto border border-slate-200 bg-slate-900 text-slate-100 p-3 text-[0.7rem] leading-relaxed">
                <pre className="whitespace-pre-wrap break-words">
                  {selectedItem.payload ? JSON.stringify(selectedItem.payload, null, 2) : 'Tidak ada payload'}
                </pre>
              </div>
            </div>

            <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
              <div className="flex justify-end">
                <Dialog.Close asChild>
                  <button
                    className="px-6 py-2 border border-slate-400 bg-white text-slate-700 hover:bg-slate-50 font-medium transition-colors"
                  >
                    Tutup
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </div>
        )}
      </Dialog.Content>
    </Dialog.Root>
  )
}
