import { Text, TextField, Select, TextArea, Badge } from '@radix-ui/themes'
import { Trash2, Edit3, CreditCard } from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

function formatDate(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0]
}

export function EditRincianList({ rincianItems, onChange, onRemove, disabled }) {
  const totalPembayaran = rincianItems.reduce(
    (sum, item) => sum + parseFloat(item.jumlah_dibayar || 0), 0
  )

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col flex-1 overflow-hidden">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Rincian Transaksi
          </Text>
          <Badge color="blue" size="2" style={{ borderRadius: 0 }}>
            {rincianItems.length} transaksi
          </Badge>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4 space-y-3">
        {rincianItems.map((item, index) => (
          <div key={index} className="border-2 border-slate-300 bg-white">
            {/* Header Item */}
            <div className="bg-gradient-to-b from-slate-100 to-slate-50 px-3 py-2 border-b-2 border-slate-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Badge color="blue" variant="soft" size="1" style={{ borderRadius: 0 }}>
                  Cicilan #{item.cicilan_ke}
                </Badge>
                <Text size="1" className="font-mono text-slate-600">
                  {item.nomor_transaksi}
                </Text>
              </div>
              <button
                type="button"
                onClick={() => onRemove(index)}
                disabled={disabled}
                className="p-1 hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50"
                title="Hapus"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* Form Fields */}
            <div className="p-3 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 mb-2">
                    <Text size="2" weight="medium" className="text-slate-700">
                      Jumlah <span className="text-red-500">*</span>
                    </Text>
                  </label>
                  <TextField.Root
                    type="number"
                    value={item.jumlah_dibayar}
                    onChange={(e) => onChange(index, 'jumlah_dibayar', e.target.value)}
                    placeholder="0"
                    style={{ borderRadius: 0 }}
                    disabled={disabled}
                  />
                </div>
                <div>
                  <label className="flex items-center gap-1.5 mb-2">
                    <Text size="2" weight="medium" className="text-slate-700">
                      Tanggal <span className="text-red-500">*</span>
                    </Text>
                  </label>
                  <input
                    type="date"
                    value={formatDate(item.tanggal_bayar)}
                    onChange={(e) => onChange(index, 'tanggal_bayar', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    style={{ borderRadius: 0 }}
                    disabled={disabled}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 mb-2">
                    <CreditCard className="h-3.5 w-3.5 text-slate-600" />
                    <Text size="2" weight="medium" className="text-slate-700">
                      Metode <span className="text-red-500">*</span>
                    </Text>
                  </label>
                  <Select.Root
                    value={item.metode_pembayaran}
                    onValueChange={(value) => onChange(index, 'metode_pembayaran', value)}
                    disabled={disabled}
                  >
                    <Select.Trigger style={{ borderRadius: 0, width: '100%' }} />
                    <Select.Content style={{ borderRadius: 0 }}>
                      <Select.Item value="cash">Tunai</Select.Item>
                      <Select.Item value="transfer">Transfer</Select.Item>
                      <Select.Item value="qris">QRIS</Select.Item>
                      <Select.Item value="e-wallet">E-Wallet</Select.Item>
                      <Select.Item value="kartu_debit">Debit</Select.Item>
                      <Select.Item value="kartu_kredit">Kredit</Select.Item>
                    </Select.Content>
                  </Select.Root>
                </div>
                <div>
                  <label className="flex items-center gap-1.5 mb-2">
                    <Text size="2" weight="medium" className="text-slate-700">
                      Referensi
                    </Text>
                  </label>
                  <TextField.Root
                    value={item.referensi_pembayaran}
                    onChange={(e) => onChange(index, 'referensi_pembayaran', e.target.value)}
                    placeholder="No. referensi"
                    style={{ borderRadius: 0 }}
                    disabled={disabled}
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-1.5 mb-2">
                  <Text size="2" weight="medium" className="text-slate-700">
                    Catatan
                  </Text>
                </label>
                <TextArea
                  value={item.catatan}
                  onChange={(e) => onChange(index, 'catatan', e.target.value)}
                  placeholder="Catatan (opsional)"
                  style={{ borderRadius: 0, minHeight: '60px' }}
                  disabled={disabled}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Total */}
      <div className="shrink-0 border-t-2 border-slate-300 bg-emerald-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <Text size="3" weight="bold" className="text-emerald-900 uppercase tracking-wider">
            Total Pembayaran
          </Text>
          <Text size="4" weight="bold" className="text-emerald-700 font-mono">
            {formatCurrency(totalPembayaran)}
          </Text>
        </div>
      </div>
    </div>
  )
}
