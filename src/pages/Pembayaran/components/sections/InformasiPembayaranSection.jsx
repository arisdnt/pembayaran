import { Text, TextField, TextArea } from '@radix-ui/themes'

export function InformasiPembayaranSection({ formData, onChange, errors = {}, disabled = false }) {
  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg shrink-0">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3">
        <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
          Informasi Pembayaran
        </Text>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <Text size="2" mb="1" weight="medium">Nomor Pembayaran</Text>
          <TextField.Root
            value={formData.nomor_pembayaran || ''}
            onChange={(e) => onChange('nomor_pembayaran', e.target.value)}
            placeholder="PAY-2024-001"
            style={{ borderRadius: 0 }}
            disabled={true}
          />
          {errors.nomor_pembayaran && (
            <Text size="1" color="red" mt="1">
              {errors.nomor_pembayaran}
            </Text>
          )}
        </div>

        <div>
          <Text size="2" mb="1" weight="medium">Catatan</Text>
          <TextArea
            value={formData.catatan || ''}
            onChange={(e) => onChange('catatan', e.target.value)}
            placeholder="Catatan pembayaran (opsional)"
            style={{ borderRadius: 0 }}
            rows={4}
            disabled={disabled}
          />
        </div>
      </div>
    </div>
  )
}
