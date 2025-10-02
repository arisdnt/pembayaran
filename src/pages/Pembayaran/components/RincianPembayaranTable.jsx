import { Text, Badge } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getMetodeBadgeColor(metode) {
  const colors = {
    cash: 'green',
    transfer: 'blue',
    qris: 'purple',
    'e-wallet': 'orange',
    kartu_debit: 'cyan',
    kartu_kredit: 'pink',
  }
  return colors[metode] || 'gray'
}

function getMetodeLabel(metode) {
  const labels = {
    cash: 'Tunai',
    transfer: 'Transfer',
    qris: 'QRIS',
    'e-wallet': 'E-Wallet',
    kartu_debit: 'Debit',
    kartu_kredit: 'Kredit',
  }
  return labels[metode] || metode
}

export function RincianPembayaranTable({ 
  rincianItems, 
  onEdit, 
  onRemove,
  nextCicilanKe 
}) {
  return (
    <div className="overflow-auto">
      <table className="w-full border-collapse text-sm">
        <thead className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10">
          <tr className="border-b-2 border-slate-300">
            <th className="px-4 py-3 text-left border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                #
              </Text>
            </th>
            <th className="px-4 py-3 text-left border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                No. Transaksi
              </Text>
            </th>
            <th className="px-4 py-3 text-left border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Jumlah
              </Text>
            </th>
            <th className="px-4 py-3 text-left border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Tanggal
              </Text>
            </th>
            <th className="px-4 py-3 text-left border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Metode
              </Text>
            </th>
            <th className="px-4 py-3 text-left border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Referensi
              </Text>
            </th>
            <th className="px-4 py-3 text-center">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Aksi
              </Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {rincianItems.map((item, index) => {
            const isEven = index % 2 === 0
            return (
              <tr
                key={index}
                className={`border-b border-slate-200 ${
                  isEven ? 'bg-white' : 'bg-slate-50'
                }`}
              >
                <td className="px-4 py-3 border-r border-slate-200">
                  <Badge color="blue" variant="soft" size="2" style={{ borderRadius: 0 }}>
                    Cicilan ke-{nextCicilanKe + index}
                  </Badge>
                </td>
                <td className="px-4 py-3 border-r border-slate-200">
                  <Text size="2" weight="medium" className="text-slate-900 font-mono">
                    {item.nomor_transaksi || '—'}
                  </Text>
                </td>
                <td className="px-4 py-3 border-r border-slate-200">
                  <Text size="2" weight="bold" className="text-green-700">
                    {formatCurrency(item.jumlah_dibayar)}
                  </Text>
                </td>
                <td className="px-4 py-3 border-r border-slate-200">
                  <Text size="2" className="text-slate-700">
                    {formatDate(item.tanggal_bayar)}
                  </Text>
                </td>
                <td className="px-4 py-3 border-r border-slate-200">
                  <Badge 
                    color={getMetodeBadgeColor(item.metode_pembayaran)}
                    variant="soft"
                    size="1"
                    style={{ borderRadius: 0 }}
                  >
                    {getMetodeLabel(item.metode_pembayaran)}
                  </Badge>
                </td>
                <td className="px-4 py-3 border-r border-slate-200">
                  <Text size="2" className="text-slate-600 font-mono">
                    {item.referensi_pembayaran || '—'}
                  </Text>
                  {item.catatan && (
                    <Text size="1" className="text-slate-500 line-clamp-1 mt-0.5">
                      {item.catatan}
                    </Text>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => onEdit(index)}
                      className="p-1.5 hover:bg-amber-100 text-amber-600 transition-colors border border-transparent hover:border-amber-300"
                      title="Edit"
                      type="button"
                    >
                      <Pencil1Icon className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => onRemove(index)}
                      className="p-1.5 hover:bg-red-100 text-red-600 transition-colors border border-transparent hover:border-red-300"
                      title="Hapus"
                      type="button"
                    >
                      <TrashIcon className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
