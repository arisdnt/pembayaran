import { Dialog, Text } from '@radix-ui/themes'
import { X, Printer } from 'lucide-react'
import { useRef } from 'react'
import { PaymentInvoiceDocument } from '../documents/PaymentInvoiceDocument'

export function PaymentInvoiceModal({ open, onOpenChange, paymentData }) {
  const printRef = useRef()

  const handlePrint = () => {
    // Langsung print konten yang ada di modal tanpa render ulang
    window.print()
  }


  if (!paymentData) return null

  return (
    <>
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{ maxWidth: '900px', width: '95vw', padding: 0, borderRadius: 0 }}
        className="border-2 border-slate-300 shadow-2xl print:border-0 print:shadow-none print:max-w-none print:w-full"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
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

      {/* Enhanced print styles to match modal appearance exactly */}
      <style>{`
        @media print {
          /* Force color printing only for invoice content */
          #invoice-content * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Hide print button and close button */
          .print\\:hidden { display: none !important; }

          /* Reset modal dialog positioning */
          [role="dialog"] {
            position: static !important;
            transform: none !important;
            margin: 0 !important;
            padding: 0 !important;
            max-width: none !important;
            width: 100% !important;
            height: auto !important;
            box-shadow: none !important;
            border: none !important;
          }

          /* Ensure backgrounds and colors are preserved */
          .bg-slate-800 {
            background-color: #1e293b !important;
            color: white !important;
          }

          .text-white {
            color: white !important;
          }

          .bg-slate-100 {
            background-color: #f1f5f9 !important;
          }

          .bg-slate-200 {
            background-color: #e2e8f0 !important;
          }

          .border-slate-800 {
            border-color: #1e293b !important;
          }

          .border-slate-300 {
            border-color: #cbd5e1 !important;
          }

          .border-slate-600 {
            border-color: #475569 !important;
          }

          .text-slate-900 {
            color: #0f172a !important;
          }

          .text-slate-700 {
            color: #334155 !important;
          }

          .text-slate-600 {
            color: #475569 !important;
          }

          .text-slate-500 {
            color: #64748b !important;
          }

          /* Preserve all borders */
          table, th, td {
            border-collapse: collapse !important;
          }

          .border-2 {
            border-width: 2px !important;
          }

          .border-4 {
            border-width: 4px !important;
          }

          .border-b-4 {
            border-bottom-width: 4px !important;
          }

          .border-b {
            border-bottom-width: 1px !important;
          }

          .border-r {
            border-right-width: 1px !important;
          }

          .border-t-2 {
            border-top-width: 2px !important;
          }

          /* Page setup */
          @page {
            size: A4;
            margin: 10mm;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
          }
        }
      `}</style>
    </Dialog.Root>

    </>
  )
}
