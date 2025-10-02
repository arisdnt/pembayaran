import { Text, Button, Card } from '@radix-ui/themes'
import { Plus } from 'lucide-react'
import { RincianItemCard } from './RincianItemCard'

export function RincianSection({ 
  rincianItems, 
  jenisPembayaranList, 
  onAdd, 
  onRemove, 
  onChange, 
  totalTagihan 
}) {
  return (
    <Card style={{ borderRadius: 0 }}>
      <div className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <Text size="3" weight="bold">Rincian Item Pembayaran</Text>
          <Button onClick={onAdd} size="2" style={{ borderRadius: 0 }} className="cursor-pointer">
            <Plus className="h-4 w-4" />
            Tambah Item
          </Button>
        </div>

        {rincianItems.length === 0 ? (
          <div className="text-center py-8 text-slate-400">
            <Text size="2">Belum ada rincian item. Klik "Tambah Item" untuk menambahkan.</Text>
          </div>
        ) : (
          <div className="space-y-3">
            {rincianItems.map((item, idx) => (
              <RincianItemCard
                key={idx}
                item={item}
                index={idx}
                jenisPembayaranList={jenisPembayaranList}
                onRemove={() => onRemove(idx)}
                onChange={(field, value) => onChange(idx, field, value)}
              />
            ))}

            <div className="p-4 bg-emerald-50 border border-emerald-200">
              <div className="flex items-center justify-between">
                <Text size="2" weight="bold" className="text-emerald-900">Total Tagihan</Text>
                <Text size="5" weight="bold" className="text-emerald-700">
                  {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(totalTagihan)}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  )
}
