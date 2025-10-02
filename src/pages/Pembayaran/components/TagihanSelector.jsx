import { Card, Text, Select } from '@radix-ui/themes'
import { formatCurrency } from '../utils/currencyHelpers'

export function TagihanSelector({ tagihanList, selectedTagihan, value, onChange }) {
  return (
    <Card style={{ borderRadius: 0 }}>
      <div className="p-6 space-y-4">
        <Text size="3" weight="bold">1. Pilih Tagihan</Text>
        
        <div>
          <Text size="2" mb="1" weight="medium">Tagihan *</Text>
          <Select.Root value={value} onValueChange={onChange}>
            <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tagihan" />
            <Select.Content style={{ borderRadius: 0 }}>
              {tagihanList.map(t => (
                <Select.Item key={t.id} value={t.id}>
                  {t.nomor_tagihan} - {t.judul} ({t.riwayat_kelas_siswa?.siswa?.nama_lengkap}) - {formatCurrency(t.total_tagihan)}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
        </div>

        {selectedTagihan && (
          <div className="p-4 bg-blue-50 border border-blue-200 space-y-2">
            <div className="flex justify-between">
              <Text size="2" className="text-blue-900">Total Tagihan</Text>
              <Text size="2" weight="bold" className="text-blue-900">
                {formatCurrency(selectedTagihan.total_tagihan)}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text size="2" className="text-blue-900">Sudah Dibayar</Text>
              <Text size="2" weight="bold" className="text-green-700">
                {formatCurrency(selectedTagihan.total_dibayar || 0)}
              </Text>
            </div>
            <div className="flex justify-between pt-2 border-t border-blue-300">
              <Text size="2" weight="bold" className="text-blue-900">Sisa Tagihan</Text>
              <Text size="3" weight="bold" className="text-orange-700">
                {formatCurrency(selectedTagihan.sisa_tagihan || selectedTagihan.total_tagihan)}
              </Text>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
