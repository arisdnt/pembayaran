import { Text, Badge } from '@radix-ui/themes'
import { Receipt, DollarSign, CheckCircle, AlertCircle, Calendar } from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

export function TagihanPembayaranSection({ tagihanData }) {
  if (!tagihanData || tagihanData.length === 0) {
    return (
      <div className="border-2 border-slate-300 bg-white shadow-lg">
        <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-green-600" />
            <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
              Riwayat Tagihan & Pembayaran
            </Text>
          </div>
        </div>
        <div className="p-6 text-center">
          <Receipt className="h-12 w-12 text-slate-300 mx-auto mb-2" />
          <Text size="2" className="text-slate-500">Belum ada data tagihan dan pembayaran</Text>
        </div>
      </div>
    )
  }

  const grandTotal = {
    totalTagihan: tagihanData.reduce((sum, group) => sum + group.totalTagihan, 0),
    totalDibayar: tagihanData.reduce((sum, group) => sum + group.totalDibayar, 0),
  }
  grandTotal.sisaTagihan = grandTotal.totalTagihan - grandTotal.totalDibayar

  // Flatten semua aktivitas (tagihan dan pembayaran) untuk format ledger
  const ledgerEntries = []

  tagihanData.forEach((group) => {
    group.tagihan.forEach((tagihan) => {
      // Entry tagihan
      ledgerEntries.push({
        type: 'tagihan',
        tanggal: tagihan.tanggal_tagihan,
        tahunAjaran: group.tahunAjaran,
        kelas: group.kelas,
        namaTagihan: tagihan.judul,
        jenisPembayaran: '',
        deskripsi: '',
        referensi: tagihan.nomor_tagihan,
        metode: '',
        nominalTagihan: tagihan.totalTagihan,
        nominalJenis: 0,
        nominalBayar: 0,
        saldo: 0,
        tagihanId: tagihan.id,
        totalTagihan: tagihan.totalTagihan,
        totalDibayar: tagihan.totalDibayar,
        sisaTagihan: tagihan.sisaTagihan
      })

      // Entry rincian tagihan
      if (tagihan.rincian_tagihan && tagihan.rincian_tagihan.length > 0) {
        tagihan.rincian_tagihan.forEach((rincian) => {
          ledgerEntries.push({
            type: 'rincian_tagihan',
            tanggal: tagihan.tanggal_tagihan,
            tahunAjaran: group.tahunAjaran,
            kelas: group.kelas,
            namaTagihan: '',
            jenisPembayaran: rincian.jenis_pembayaran?.nama || '-',
            deskripsi: rincian.deskripsi,
            referensi: rincian.jenis_pembayaran?.kode || '-',
            metode: '',
            nominalTagihan: 0,
            nominalJenis: rincian.jumlah,
            nominalBayar: 0,
            saldo: 0,
            tagihanId: tagihan.id
          })
        })
      }

      // Entry pembayaran
      if (tagihan.pembayaran && tagihan.pembayaran.length > 0) {
        tagihan.pembayaran.forEach((pembayaran) => {
          if (pembayaran.rincian_pembayaran && pembayaran.rincian_pembayaran.length > 0) {
            pembayaran.rincian_pembayaran.forEach((rincian) => {
              ledgerEntries.push({
                type: 'pembayaran',
                tanggal: rincian.tanggal_bayar,
                tahunAjaran: group.tahunAjaran,
                kelas: group.kelas,
                namaTagihan: tagihan.judul,
                jenisPembayaran: 'Pembayaran',
                deskripsi: '',
                referensi: rincian.nomor_transaksi,
                metode: rincian.metode_pembayaran,
                nominalTagihan: 0,
                nominalJenis: 0,
                nominalBayar: rincian.jumlah_dibayar,
                saldo: 0,
                tagihanId: tagihan.id
              })
            })
          }
        })
      }

      // Entry status pembayaran
      ledgerEntries.push({
        type: 'status_pembayaran',
        tanggal: tagihan.tanggal_tagihan,
        tahunAjaran: group.tahunAjaran,
        kelas: group.kelas,
        namaTagihan: tagihan.judul,
        jenisPembayaran: '',
        deskripsi: '',
        referensi: '',
        metode: '',
        nominalTagihan: 0,
        nominalJenis: 0,
        nominalBayar: 0,
        saldo: 0,
        tagihanId: tagihan.id,
        totalTagihan: tagihan.totalTagihan,
        totalDibayar: tagihan.totalDibayar,
        sisaTagihan: tagihan.sisaTagihan
      })
    })
  })

  // NO SORTING! Maintain natural order from data structure
  // Entries already in correct order: tagihan -> rincian -> pembayaran -> status per group

  // Calculate running balance
  let runningBalance = 0
  ledgerEntries.forEach(entry => {
    // Hanya hitung saldo untuk entry tagihan dan pembayaran, skip rincian dan status
    if (entry.type === 'tagihan') {
      runningBalance += entry.nominalTagihan
      entry.saldo = runningBalance
    } else if (entry.type === 'pembayaran') {
      runningBalance -= entry.nominalBayar
      entry.saldo = runningBalance
    } else if (entry.type === 'status_pembayaran') {
      entry.saldo = runningBalance
    }
    // rincian_tagihan tidak mengubah saldo karena sudah termasuk dalam nominalTagihan
  })

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-green-600" />
            <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
              Ledger Tagihan & Pembayaran
            </Text>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-slate-600">Total Tagihan: {formatCurrency(grandTotal.totalTagihan)}</span>
            <span className="text-green-600">Terbayar: {formatCurrency(grandTotal.totalDibayar)}</span>
            <Badge color={grandTotal.sisaTagihan <= 0 ? 'green' : 'red'} variant="solid" style={{ borderRadius: 0 }}>
              {grandTotal.sisaTagihan <= 0 ? 'LUNAS' : `Sisa: ${formatCurrency(grandTotal.sisaTagihan)}`}
            </Badge>
          </div>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-50 sticky top-0">
            <tr className="border-b-2 border-slate-300">
              <th className="px-3 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tanggal</th>
              <th className="px-3 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tahun Ajaran / Kelas</th>
              <th className="px-3 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tagihan / Jenis Pembayaran</th>
              <th className="px-3 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Deskripsi</th>
              <th className="px-3 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Referensi</th>
              <th className="px-3 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Metode</th>
              <th className="px-3 py-2 text-right text-slate-700 font-semibold border-r border-slate-200">Nominal Tagihan</th>
              <th className="px-3 py-2 text-right text-slate-700 font-semibold border-r border-slate-200">Pembayaran</th>
              <th className="px-3 py-2 text-right text-slate-700 font-semibold">Saldo</th>
            </tr>
          </thead>
          <tbody>
            {ledgerEntries.map((entry, index) => {
              if (entry.type === 'status_pembayaran') {
                const statusText = entry.sisaTagihan <= 0 ? 'LUNAS' :
                                   entry.sisaTagihan > 0 ? `KURANG BAYAR ${formatCurrency(entry.sisaTagihan)}` : ''
                const statusColor = entry.sisaTagihan <= 0 ? 'bg-green-100 border-green-300 text-green-800' :
                                    'bg-red-100 border-red-300 text-red-800'

                return (
                  <tr key={index} className={`border-y-2 border-slate-400 ${statusColor}`}>
                    <td colSpan="9" className="px-4 py-2">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          Status Pembayaran untuk tagihan "{entry.namaTagihan}"
                        </span>
                        <span className="font-bold">
                          {statusText}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              }

              return (
                <tr
                  key={index}
                  className={`border-b border-slate-200 ${
                    entry.type === 'tagihan' ? 'bg-blue-50' :
                    entry.type === 'pembayaran' ? 'bg-green-50' :
                    'bg-white'
                  }`}
                >
                  <td className="px-3 py-2 text-slate-700 border-r border-slate-200 whitespace-nowrap">
                    {entry.type === 'rincian_tagihan' ? '' : formatDate(entry.tanggal)}
                  </td>
                  <td className="px-3 py-2 text-slate-700 border-r border-slate-200">
                    {entry.type === 'rincian_tagihan' ? '' : `${entry.tahunAjaran} / Kelas ${entry.kelas}`}
                  </td>
                  <td className={`py-2 border-r border-slate-200 ${
                    entry.type === 'tagihan' ? 'font-bold text-slate-900 px-3' :
                    entry.type === 'pembayaran' ? 'font-medium text-slate-900 px-3' :
                    'font-medium text-indigo-700 pl-8 pr-3'
                  }`}>
                    {entry.type === 'tagihan' ? entry.namaTagihan :
                     entry.type === 'pembayaran' ? entry.namaTagihan :
                     `↳ ${entry.jenisPembayaran}`}
                  </td>
                  <td className="px-3 py-2 text-slate-600 border-r border-slate-200 text-xs">
                    {entry.deskripsi || '-'}
                  </td>
                  <td className="px-3 py-2 text-slate-700 font-mono border-r border-slate-200 text-xs">
                    {entry.referensi || '-'}
                  </td>
                  <td className="px-3 py-2 text-slate-700 border-r border-slate-200 text-xs">
                    {entry.metode || '-'}
                  </td>
                  <td className={`py-2 border-r border-slate-200 text-right ${
                    entry.type === 'tagihan' ? 'font-mono text-blue-700 font-bold pr-12 pl-3' :
                    entry.type === 'rincian_tagihan' ? 'font-mono text-indigo-700 pr-3 pl-3' :
                    'pl-3 pr-3'
                  }`}>
                    {entry.type === 'tagihan' && entry.nominalTagihan > 0 && formatCurrency(entry.nominalTagihan)}
                    {entry.type === 'rincian_tagihan' && entry.nominalJenis > 0 && `↳ ${formatCurrency(entry.nominalJenis)}`}
                  </td>
                  <td className="px-3 py-2 text-right border-r border-slate-200">
                    {entry.nominalBayar > 0 && (
                      <span className="text-green-700 font-mono">{formatCurrency(entry.nominalBayar)}</span>
                    )}
                  </td>
                  <td className={`px-3 py-2 text-right font-mono font-bold ${
                    entry.type === 'rincian_tagihan' ? '' :
                    entry.saldo > 0 ? 'text-red-700' : entry.saldo < 0 ? 'text-green-700' : 'text-slate-700'
                  }`}>
                    {entry.type === 'rincian_tagihan' ? '' : formatCurrency(Math.abs(entry.saldo))}
                  </td>
                </tr>
              )
            })}
          </tbody>
          <tfoot className="bg-slate-100 border-t-2 border-slate-300">
            <tr>
              <td colSpan="6" className="px-3 py-2 text-right font-bold text-slate-800 border-r border-slate-200">
                TOTAL:
              </td>
              <td className="pr-12 pl-3 py-2 text-right font-bold text-blue-700 font-mono border-r border-slate-200">
                {formatCurrency(grandTotal.totalTagihan)}
              </td>
              <td className="px-3 py-2 text-right font-bold text-green-700 font-mono border-r border-slate-200">
                {formatCurrency(grandTotal.totalDibayar)}
              </td>
              <td className={`px-3 py-2 text-right font-bold font-mono ${
                grandTotal.sisaTagihan > 0 ? 'text-red-700' : grandTotal.sisaTagihan < 0 ? 'text-green-700' : 'text-slate-700'
              }`}>
                {grandTotal.sisaTagihan > 0 ? (
                  <span><span className="text-xl">-</span> {formatCurrency(Math.abs(grandTotal.sisaTagihan))}</span>
                ) : (
                  formatCurrency(Math.abs(grandTotal.sisaTagihan))
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  )
}
