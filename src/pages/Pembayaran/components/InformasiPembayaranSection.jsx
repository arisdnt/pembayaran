import { Text, TextField, TextArea } from '@radix-ui/themes'
import { FileText, Hash, Sparkles } from 'lucide-react'

function generateNomorPembayaran() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  
  return `PAY-${year}${month}${day}-${hours}${minutes}${seconds}`
}

export function InformasiPembayaranSection({ formData, onChange }) {
  const handleGenerate = () => {
    const nomorBaru = generateNomorPembayaran()
    onChange('nomor_pembayaran', nomorBaru)
  }

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg shrink-0">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Informasi Pembayaran
          </Text>
        </div>
      </div>

      <div className="p-4 shrink-0">
        <div className="space-y-4">
          {/* Nomor Pembayaran */}
          <div>
            <label className="flex items-center gap-1.5 mb-2">
              <Hash className="h-3.5 w-3.5 text-blue-500" />
              <Text size="2" weight="medium" className="text-slate-700">
                Nomor Pembayaran <span className="text-red-500">*</span>
              </Text>
            </label>
            <div className="flex gap-2 items-stretch">
              <TextField.Root
                placeholder="Contoh: PAY-2024-001"
                value={formData.nomor_pembayaran}
                onChange={(e) => onChange('nomor_pembayaran', e.target.value)}
                style={{ borderRadius: 0 }}
                className="flex-1"
              />
              <button
                onClick={handleGenerate}
                className="flex items-center gap-2 px-4 bg-blue-600 hover:bg-blue-700 text-white transition-colors shrink-0"
                style={{ borderRadius: 0 }}
                type="button"
              >
                <Sparkles className="h-4 w-4" />
                <Text size="2" weight="medium" className="text-white">
                  Generate
                </Text>
              </button>
            </div>
            <Text size="1" className="text-slate-500 mt-1">
              Nomor unik untuk identifikasi pembayaran
            </Text>
          </div>

          {/* Catatan */}
          <div>
            <label className="flex items-center gap-1.5 mb-2">
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <Text size="2" weight="medium" className="text-slate-700">
                Catatan
              </Text>
            </label>
            <TextArea
              placeholder="Catatan pembayaran (opsional)"
              value={formData.catatan}
              onChange={(e) => onChange('catatan', e.target.value)}
              style={{ borderRadius: 0, minHeight: '100px' }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
