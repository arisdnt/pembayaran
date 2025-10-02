import { Text, TextField, Select, Badge, IconButton } from '@radix-ui/themes'
import { Trash2 } from 'lucide-react'

export function RincianItemCard({ item, index, jenisPembayaranList, onRemove, onChange }) {
  return (
    <div className="p-4 border border-slate-200 bg-slate-50 space-y-3">
      <div className="flex items-center justify-between">
        <Badge size="2">Item {index + 1}</Badge>
        <IconButton
          size="1"
          variant="ghost"
          color="red"
          onClick={onRemove}
          className="cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>
      
      <div>
        <Text size="2" mb="1" weight="medium">Jenis Pembayaran *</Text>
        <Select.Root value={item.id_jenis_pembayaran} onValueChange={(v) => onChange('id_jenis_pembayaran', v)}>
          <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih jenis" />
          <Select.Content style={{ borderRadius: 0 }}>
            {jenisPembayaranList.map(j => (
              <Select.Item key={j.id} value={j.id}>
                {j.kode} - {j.nama}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      <div>
        <Text size="2" mb="1" weight="medium">Deskripsi *</Text>
        <TextField.Root
          value={item.deskripsi}
          onChange={(e) => onChange('deskripsi', e.target.value)}
          placeholder="Deskripsi item"
          style={{ borderRadius: 0 }}
        />
      </div>

      <div>
        <Text size="2" mb="1" weight="medium">Jumlah (Rp) *</Text>
        <TextField.Root
          type="number"
          value={item.jumlah}
          onChange={(e) => onChange('jumlah', e.target.value)}
          placeholder="500000"
          style={{ borderRadius: 0 }}
          min="0"
          step="1000"
        />
      </div>
    </div>
  )
}
