import { Text } from '@radix-ui/themes'
import { Clock } from 'lucide-react'

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
    year: 'numeric'
  })
}

export function PembayaranPendingTable({ data, loading }) {
  if (loading) {
    return (
      <div className="border-2 border-slate-300 bg-white shadow-lg h-full flex items-center justify-center">
        <Text size="2" className="text-slate-500">Memuat data...</Text>
      </div>
    )
  }

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col h-full overflow-hidden">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Pembayaran Pending Verifikasi
          </Text>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-slate-100 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left border-b-2 border-slate-300">
                <Text size="1" weight="bold" className="text-slate-700">No. Transaksi</Text>
              </th>
              <th className="px-4 py-2 text-left border-b-2 border-slate-300">
                <Text size="1" weight="bold" className="text-slate-700">Siswa</Text>
              </th>
              <th className="px-4 py-2 text-left border-b-2 border-slate-300">
                <Text size="1" weight="bold" className="text-slate-700">Tanggal</Text>
              </th>
              <th className="px-4 py-2 text-right border-b-2 border-slate-300">
                <Text size="1" weight="bold" className="text-slate-700">Jumlah</Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center">
                  <Text size="2" className="text-slate-500">Tidak ada pembayaran pending</Text>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const isEven = index % 2 === 0
                
                return (
                  <tr key={item.id} className={`border-b border-slate-200 hover:bg-slate-50 ${isEven ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className="px-4 py-3">
                      <Text size="2" className="text-slate-900 font-mono">{item.nomor_transaksi}</Text>
                    </td>
                    <td className="px-4 py-3">
                      <Text size="2" className="text-slate-700">
                        {item.pembayaran?.tagihan?.riwayat_kelas_siswa?.siswa?.nama_lengkap}
                      </Text>
                    </td>
                    <td className="px-4 py-3">
                      <Text size="2" className="text-slate-600">{formatDate(item.tanggal_bayar)}</Text>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Text size="2" weight="bold" className="text-amber-600 font-mono">
                        {formatCurrency(item.jumlah_dibayar)}
                      </Text>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
