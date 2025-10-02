import { Card, Text, TextField, TextArea } from '@radix-ui/themes'

export function PembayaranInfoForm({ formData, onChange }) {
  return (
    <Card style={{ borderRadius: 0 }}>
      <div className="p-6 space-y-4">
        <Text size="3" weight="bold">2. Informasi Pembayaran</Text>
        
        <div>
          <Text size="2" mb="1" weight="medium">Nomor Pembayaran *</Text>
          <TextField.Root
            value={formData.nomor_pembayaran}
            onChange={(e) => onChange('nomor_pembayaran', e.target.value)}
            placeholder="PAY-2024-001"
            style={{ borderRadius: 0 }}
          />
        </div>

        <div>
          <Text size="2" mb="1" weight="medium">Catatan</Text>
          <TextArea
            value={formData.catatan}
            onChange={(e) => onChange('catatan', e.target.value)}
            placeholder="Catatan pembayaran (opsional)"
            style={{ borderRadius: 0 }}
            rows={2}
          />
        </div>
      </div>
    </Card>
  )
}
