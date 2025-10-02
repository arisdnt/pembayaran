import { Card, Text, Button } from '@radix-ui/themes'
import { Plus } from 'lucide-react'
import { RincianPembayaranItem } from './RincianPembayaranItem'
import { formatCurrency } from '../utils/currencyHelpers'

export function RincianPembayaranList({
  rincianItems,
  selectedTagihan,
  totalPembayaran,
  onAdd,
  onChange,
  onRemove,
}) {
  return (
    <Card style={{ borderRadius: 0 }}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Text size="3" weight="bold">3. Rincian Transaksi Pembayaran</Text>
          <Button onClick={onAdd} size="2" style={{ borderRadius: 0 }} className="cursor-pointer">
            <Plus className="h-4 w-4" />
            Tambah Transaksi
          </Button>
        </div>

        {rincianItems.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Text size="2">Belum ada rincian transaksi. Klik "Tambah Transaksi" untuk menambahkan.</Text>
          </div>
        ) : (
          <div className="space-y-3">
            {rincianItems.map((item, idx) => (
              <RincianPembayaranItem
                key={idx}
                item={item}
                index={idx}
                onChange={(field, value) => onChange(idx, field, value)}
                onRemove={() => onRemove(idx)}
              />
            ))}

            <div className="p-4 bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <Text size="2" weight="bold" className="text-emerald-900">Total Pembayaran</Text>
                <Text size="5" weight="bold" className="text-emerald-700">
                  {formatCurrency(totalPembayaran)}
                </Text>
              </div>
              {selectedTagihan && totalPembayaran > selectedTagihan.sisa_tagihan && (
                <Text size="1" className="text-orange-700 mt-2">
                  ⚠️ Total pembayaran melebihi sisa tagihan
                </Text>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
