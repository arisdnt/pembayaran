import { Text, TextField, TextArea, Select, Badge, IconButton } from '@radix-ui/themes'
import { Trash2 } from 'lucide-react'

export function RincianPembayaranItem({ item, index, onChange, onRemove }) {
  const handleChange = (field, value) => {
    onChange(field, value)
  }

  return (
    <div className="p-4 border border-slate-200 bg-slate-50 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div className="flex items-center gap-3">
          <Badge size="2">Transaksi {index + 1}</Badge>
          <Text size="1" className="text-slate-500">
            Cicilan ke-{item.cicilan_ke || index + 1}
          </Text>
        </div>
        <IconButton
          size="1"
          variant="ghost"
          color="red"
          onClick={onRemove}
          className="cursor-pointer"
          aria-label={`Hapus transaksi ${index + 1}`}
        >
          <Trash2 className="h-4 w-4" />
        </IconButton>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Text size="2" mb="1" weight="medium">Nomor Transaksi *</Text>
          <TextField.Root
            value={item.nomor_transaksi || ''}
            onChange={(e) => handleChange('nomor_transaksi', e.target.value)}
            placeholder="TRX-001"
            style={{ borderRadius: 0 }}
          />
        </div>
        <div>
          <Text size="2" mb="1" weight="medium">Jumlah Dibayar (Rp) *</Text>
          <TextField.Root
            type="number"
            value={item.jumlah_dibayar ?? ''}
            onChange={(e) => handleChange('jumlah_dibayar', e.target.value)}
            placeholder="500000"
            style={{ borderRadius: 0 }}
            min="0"
            step="1000"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <Text size="2" mb="1" weight="medium">Tanggal Bayar *</Text>
          <input
            type="date"
            value={item.tanggal_bayar || ''}
            onChange={(e) => handleChange('tanggal_bayar', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <Text size="2" mb="1" weight="medium">Metode Pembayaran *</Text>
          <Select.Root
            value={item.metode_pembayaran || ''}
            onValueChange={(value) => handleChange('metode_pembayaran', value)}
          >
            <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih metode pembayaran" />
            <Select.Content style={{ borderRadius: 0 }}>
              <Select.Item value="transfer">Transfer Bank</Select.Item>
              <Select.Item value="tunai">Tunai</Select.Item>
              <Select.Item value="qris">QRIS</Select.Item>
              <Select.Item value="virtual_account">Virtual Account</Select.Item>
              <Select.Item value="kartu_kredit">Kartu Kredit</Select.Item>
              <Select.Item value="debit">Kartu Debit</Select.Item>
            </Select.Content>
          </Select.Root>
        </div>
      </div>

      <div>
        <Text size="2" mb="1" weight="medium">Referensi Pembayaran</Text>
        <TextField.Root
          value={item.referensi_pembayaran || ''}
          onChange={(e) => handleChange('referensi_pembayaran', e.target.value)}
          placeholder="No. Rekening / ID Transaksi"
          style={{ borderRadius: 0 }}
        />
      </div>

      <div>
        <Text size="2" mb="1" weight="medium">Catatan Transaksi</Text>
        <TextArea
          value={item.catatan || ''}
          onChange={(e) => handleChange('catatan', e.target.value)}
          placeholder="Catatan untuk transaksi ini"
          style={{ borderRadius: 0 }}
          rows={2}
        />
      </div>
    </div>
  )
}
