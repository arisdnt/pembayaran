import { Dialog, Text } from '@radix-ui/themes'
import { X, Printer } from 'lucide-react'
import { useRef } from 'react'
import { PaymentInvoiceDocument } from './PaymentInvoiceDocument'

export function PaymentInvoiceModal({ open, onOpenChange, paymentData }) {
  const printRef = useRef()

  const handlePrint = () => {
    window.print()
  }

  if (!paymentData) return null

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{ maxWidth: '900px', width: '95vw', padding: 0, borderRadius: 0 }}
        className="border-2 border-slate-300 shadow-2xl print:border-0 print:shadow-none print:max-w-none print:w-full"
      >
        <div className="print:hidden flex items-center justify-end bg-white px-5 py-2">
          <Dialog.Title className="sr-only">Bukti Pembayaran</Dialog.Title>
          <Dialog.Description className="sr-only">Pembayaran berhasil disimpan</Dialog.Description>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 px-4 py-2 w-28 bg-green-600 hover:bg-green-700 text-white font-medium transition-colors"
              type="button"
            >
              <Printer className="h-4 w-4" />
              <Text size="2" weight="medium" className="text-white">
                Print
              </Text>
            </button>
            <button
              onClick={() => onOpenChange(false)}
              className="flex items-center justify-center gap-2 px-4 py-2 w-28 bg-red-600 hover:bg-red-700 text-white font-medium transition-colors"
              type="button"
            >
              <X className="h-4 w-4" />
              <Text size="2" weight="medium" className="text-white">
                Tutup
              </Text>
            </button>
          </div>
        </div>

        <PaymentInvoiceDocument ref={printRef} paymentData={paymentData} contentId="invoice-content" />
      </Dialog.Content>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }

          #invoice-content,
          #invoice-content * {
            visibility: visible;
          }

          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          .print\\:hidden {
            display: none !important;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </Dialog.Root>
  )
}
