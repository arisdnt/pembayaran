import { Text, Badge } from '@radix-ui/themes'
import { Receipt } from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function calculateSummary(tagihan) {
  const total = (tagihan.rincian_tagihan || []).reduce(
    (sum, r) => sum + parseFloat(r.jumlah || 0), 0
  )
  const dibayar = (tagihan.pembayaran || []).reduce((sum, p) =>
    sum + (p.rincian_pembayaran || []).reduce(
      (s, rp) => s + parseFloat(rp.jumlah_dibayar || 0), 0
    ), 0
  )
  return { total, dibayar, sisa: total - dibayar }
}

export function UnpaidTagihanList({ tagihanList, onPayClick, selectedIds = [], selectedSiswa }) {
  // State: Siswa belum dipilih
  if (!selectedSiswa) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Receipt className="h-16 w-16 text-slate-300 mb-3" />
        <Text size="3" className="text-slate-500 font-medium">
          Siswa Belum Dipilih
        </Text>
        <Text size="2" className="text-slate-400 mt-1">
          Pilih siswa terlebih dahulu untuk melihat daftar tagihan
        </Text>
      </div>
    )
  }

  // State: Siswa sudah dipilih tapi tidak ada tagihan
  if (!tagihanList || tagihanList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center px-6">
        <Receipt className="h-16 w-16 text-slate-300 mb-4" />
        <Text size="3" className="text-slate-500 font-medium mb-3">
          Tidak Ada Tagihan
        </Text>
        <div className="max-w-md">
          <Text size="2" className="text-slate-500 block mb-2">
            Siswa dengan nama
          </Text>
          <div className="bg-slate-100 border-2 border-slate-300 px-4 py-2 mb-2">
            <Text size="3" weight="bold" className="text-slate-800">
              {selectedSiswa.nama_lengkap}
            </Text>
          </div>
          <Text size="2" className="text-slate-500">
            tidak memiliki tagihan yang belum lunas
          </Text>
        </div>
      </div>
    )
  }

  return (
    <table className="w-full border-collapse text-sm">
      <thead className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10">
        <tr className="border-b-2 border-slate-300">
            <th className="px-2 py-2 text-left border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Nomor
              </Text>
            </th>
            <th className="px-2 py-2 text-left border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Judul
              </Text>
            </th>
            <th className="px-2 py-2 text-center border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Tahun Ajaran
              </Text>
            </th>
            <th className="px-2 py-2 text-center border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Kelas
              </Text>
            </th>
            <th className="px-2 py-2 text-right border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Total
              </Text>
            </th>
            <th className="px-2 py-2 text-right border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Dibayar
              </Text>
            </th>
            <th className="px-2 py-2 text-right border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Sisa
              </Text>
            </th>
            <th className="px-2 py-2 text-center border-r border-slate-200">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Jatuh Tempo
              </Text>
            </th>
            <th className="px-2 py-2 text-center">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Aksi
              </Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {tagihanList.map((tagihan, idx) => {
            const summary = calculateSummary(tagihan)
            const isSelected = selectedIds.includes(tagihan.id)
            const isOverdue = tagihan.tanggal_jatuh_tempo &&
              new Date(tagihan.tanggal_jatuh_tempo) < new Date()

            return (
              <tr
                key={tagihan.id}
                className={`border-b border-slate-200 ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                } ${isSelected ? 'bg-green-50' : ''}`}
              >
                <td className="px-2 py-2 border-r border-slate-200">
                  <Text size="1" className="font-mono text-slate-700">
                    {tagihan.nomor_tagihan}
                  </Text>
                </td>
                <td className="px-2 py-2 border-r border-slate-200">
                  <Text size="2" weight="medium" className="text-slate-800">
                    {tagihan.judul}
                  </Text>
                </td>
                <td className="px-2 py-2 text-center border-r border-slate-200">
                  <Text size="1" className="text-slate-600">
                    {tagihan.tahun_ajaran || '-'}
                  </Text>
                </td>
                <td className="px-2 py-2 text-center border-r border-slate-200">
                  <Badge color="blue" variant="soft" size="1" style={{ borderRadius: 0 }}>
                    {tagihan.kelas || '-'}
                  </Badge>
                </td>
                <td className="px-2 py-2 text-right border-r border-slate-200">
                  <Text size="1" className="font-mono text-slate-700">
                    {formatCurrency(summary.total)}
                  </Text>
                </td>
                <td className="px-2 py-2 text-right border-r border-slate-200">
                  <Text size="1" className="font-mono text-green-700">
                    {formatCurrency(summary.dibayar)}
                  </Text>
                </td>
                <td className="px-2 py-2 text-right border-r border-slate-200">
                  <Text size="2" weight="bold" className="font-mono text-red-700">
                    {formatCurrency(summary.sisa)}
                  </Text>
                </td>
                <td className="px-2 py-2 text-center border-r border-slate-200">
                  <div className="flex flex-col items-center gap-1">
                    <Text size="1" className="text-slate-600">
                      {formatDate(tagihan.tanggal_jatuh_tempo)}
                    </Text>
                    {isOverdue && (
                      <Badge color="red" variant="soft" size="1" style={{ borderRadius: 0 }}>
                        Terlambat
                      </Badge>
                    )}
                  </div>
                </td>
                <td className="px-2 py-2 text-center">
                  <button
                    type="button"
                    onClick={() => onPayClick(tagihan, summary)}
                    className={`px-2 py-1 text-xs font-medium transition-colors ${
                      isSelected
                        ? 'bg-amber-600 hover:bg-amber-700 text-white border border-amber-700'
                        : 'bg-green-600 hover:bg-green-700 text-white border border-green-700'
                    }`}
                  >
                    {isSelected ? '+' : 'Bayar'}
                  </button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
  )
}
