import { Text } from '@radix-ui/themes'
import { Receipt } from 'lucide-react'

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

export function TagihanTable({ data, loading }) {
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
          <Receipt className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Tagihan Terbaru
          </Text>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <table className="w-full">
          <thead className="bg-slate-100 sticky top-0">
            <tr>
              <th className="px-4 py-2 text-left border-b-2 border-slate-300">
                <Text size="1" weight="bold" className="text-slate-700">Nomor</Text>
              </th>
              <th className="px-4 py-2 text-left border-b-2 border-slate-300">
                <Text size="1" weight="bold" className="text-slate-700">Siswa</Text>
              </th>
              <th className="px-4 py-2 text-left border-b-2 border-slate-300">
                <Text size="1" weight="bold" className="text-slate-700">Kelas</Text>
              </th>
              <th className="px-4 py-2 text-left border-b-2 border-slate-300">
                <Text size="1" weight="bold" className="text-slate-700">Tanggal</Text>
              </th>
              <th className="px-4 py-2 text-right border-b-2 border-slate-300">
                <Text size="1" weight="bold" className="text-slate-700">Total</Text>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center">
                  <Text size="2" className="text-slate-500">Tidak ada data tagihan</Text>
                </td>
              </tr>
            ) : (
              data.map((item, index) => {
                const total = item.rincian_tagihan?.reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0) || 0
                const isEven = index % 2 === 0
                
                return (
                  <tr key={item.id} className={`border-b border-slate-200 hover:bg-slate-50 ${isEven ? 'bg-white' : 'bg-slate-50'}`}>
                    <td className="px-4 py-3">
                      <Text size="2" className="text-slate-900 font-mono">{item.nomor_tagihan}</Text>
                    </td>
                    <td className="px-4 py-3">
                      <Text size="2" className="text-slate-700">{item.riwayat_kelas_siswa?.siswa?.nama_lengkap}</Text>
                    </td>
                    <td className="px-4 py-3">
                      <Text size="2" className="text-slate-700">
                        {item.riwayat_kelas_siswa?.kelas?.tingkat} {item.riwayat_kelas_siswa?.kelas?.nama_sub_kelas}
                      </Text>
                    </td>
                    <td className="px-4 py-3">
                      <Text size="2" className="text-slate-600">{formatDate(item.tanggal_tagihan)}</Text>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Text size="2" weight="bold" className="text-green-600 font-mono">{formatCurrency(total)}</Text>
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
