import { Text, Badge } from '@radix-ui/themes'
import { ShoppingCart, Trash2, Edit3 } from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
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

export function SelectedPaymentList({ payments, onRemove, onEdit, totalAmount }) {
  if (!payments || payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center py-12">
        <ShoppingCart className="h-16 w-16 text-slate-300 mb-3" />
        <Text size="3" className="text-slate-500 font-medium">
          Belum ada pembayaran dipilih
        </Text>
        <Text size="2" className="text-slate-400 mt-1">
          Pilih tagihan dari daftar di sebelah kiri
        </Text>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* List */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-sm">
          <tbody>
            {payments.map((item, index) => (
              <tr key={index} className="border-b-2 border-slate-200">
                <td className="px-3 py-3">
                  <div className="space-y-2">
                    {/* Header Row */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge color="blue" variant="soft" size="1" style={{ borderRadius: 0 }}>
                          #{index + 1}
                        </Badge>
                        <Text size="2" weight="bold" className="text-slate-800">
                          {item.tagihan.judul}
                        </Text>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onEdit(index)}
                          className="p-1 hover:bg-amber-100 text-amber-600 transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemove(index)}
                          className="p-1 hover:bg-red-100 text-red-600 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>

                    {/* Info Row */}
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <Text size="1" className="text-slate-500">No:</Text>
                        <Text size="1" className="font-mono text-slate-700">
                          {item.tagihan.nomor_tagihan}
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text size="1" className="text-slate-500">Sisa:</Text>
                        <Text size="1" className="font-mono text-red-700">
                          {formatCurrency(item.summary.sisa)}
                        </Text>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-slate-200">
                        <Text size="1" weight="bold" className="text-green-900">
                          Bayar:
                        </Text>
                        <Text size="2" weight="bold" className="font-mono text-green-700">
                          {formatCurrency(item.payment.jumlah_dibayar)}
                        </Text>
                      </div>
                    </div>

                    {/* Metode */}
                    <div className="flex items-center gap-2">
                      <Badge color="indigo" variant="soft" size="1" style={{ borderRadius: 0 }}>
                        {getMetodeLabel(item.payment.metode_pembayaran)}
                      </Badge>
                      {item.payment.referensi_pembayaran && (
                        <Text size="1" className="font-mono text-slate-500">
                          {item.payment.referensi_pembayaran}
                        </Text>
                      )}
                    </div>

                    {item.payment.catatan && (
                      <Text size="1" className="text-slate-500 italic line-clamp-2">
                        "{item.payment.catatan}"
                      </Text>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Total */}
      <div className="shrink-0 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-white px-3 py-3">
        <div className="flex items-center justify-between mb-1">
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Total:
          </Text>
          <Text size="4" weight="bold" className="text-green-600 font-mono">
            {formatCurrency(totalAmount)}
          </Text>
        </div>
        <Text size="1" className="text-slate-500">
          {payments.length} tagihan
        </Text>
      </div>
    </div>
  )
}
