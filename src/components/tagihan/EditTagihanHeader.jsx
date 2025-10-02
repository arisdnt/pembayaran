import { Text, Button } from '@radix-ui/themes'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export function EditTagihanHeader({ onBack, error }) {
  return (
    <>
      <div className="shrink-0 border-b border-slate-200 bg-white px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="soft"
            color="gray"
            onClick={onBack}
            style={{ borderRadius: 0 }}
            className="cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali
          </Button>
          <div>
            <Text size="5" weight="bold" className="text-slate-900">
              Edit Tagihan
            </Text>
            <Text size="2" className="text-slate-500">
              Perbarui informasi tagihan dan rincian item pembayaran
            </Text>
          </div>
        </div>
      </div>

      {error && (
        <div className="shrink-0 mx-6 mt-4 flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
          <Text size="2" className="text-red-700">{error}</Text>
        </div>
      )}
    </>
  )
}
