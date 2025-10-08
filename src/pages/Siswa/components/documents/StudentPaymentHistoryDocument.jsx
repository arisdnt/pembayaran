import { forwardRef } from 'react'
import { Text } from '@radix-ui/themes'
import { SCHOOL_IDENTITY } from '../../../../config/appInfo'

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
    month: 'long',
    year: 'numeric',
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
  })
}

function terbilang(angka) {
  const bilangan = [
    '', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan',
    'sepuluh', 'sebelas'
  ]

  if (angka < 12) return bilangan[angka]
  if (angka < 20) return bilangan[angka - 10] + ' belas'
  if (angka < 100) return bilangan[Math.floor(angka / 10)] + ' puluh ' + bilangan[angka % 10]
  if (angka < 200) return 'seratus ' + terbilang(angka - 100)
  if (angka < 1000) return bilangan[Math.floor(angka / 100)] + ' ratus ' + terbilang(angka % 100)
  if (angka < 2000) return 'seribu ' + terbilang(angka - 1000)
  if (angka < 1000000) return terbilang(Math.floor(angka / 1000)) + ' ribu ' + terbilang(angka % 1000)
  if (angka < 1000000000) return terbilang(Math.floor(angka / 1000000)) + ' juta ' + terbilang(angka % 1000000)
  if (angka < 1000000000000) return terbilang(Math.floor(angka / 1000000000)) + ' miliar ' + terbilang(angka % 1000000000)
  if (angka < 1000000000000000) return terbilang(Math.floor(angka / 1000000000000)) + ' triliun ' + terbilang(angka % 1000000000000)
  return angka.toString()
}

function angkaTerbilang(angka) {
  if (!angka || angka === 0) return 'nol rupiah'
  const hasil = terbilang(Math.floor(angka)).trim()
  return hasil.charAt(0).toUpperCase() + hasil.slice(1) + ' rupiah'
}

function getMetodeLabel(metode) {
  const labels = {
    tunai: 'Tunai',
    non_tunai: 'Non Tunai',
    cash: 'Tunai',
    transfer: 'Transfer',
    qris: 'QRIS',
    'e-wallet': 'E-Wallet',
    kartu_debit: 'Debit',
    kartu_kredit: 'Kredit',
  }
  return labels[metode] || metode || '-'
}

function getMetodeLabel(metode) {
  const labels = {
    tunai: 'Tunai',
    non_tunai: 'Non Tunai',
    cash: 'Tunai',
    transfer: 'Transfer',
    qris: 'QRIS',
    'e-wallet': 'E-Wallet',
    kartu_debit: 'Debit',
    kartu_kredit: 'Kredit',
  }
  return labels[metode] || metode || '-'
}

export const StudentPaymentHistoryDocument = forwardRef(function StudentPaymentHistoryDocument({ historyData, contentId = 'student-history-content' }, ref) {
  if (!historyData) return null

  const { siswaInfo, ledgerEntries = [], grandTotal = {}, timestamp } = historyData
  const profile = SCHOOL_IDENTITY.profile

  return (
    <div id={contentId} ref={ref} className="bg-white print:p-0" style={{ minHeight: '297mm' }}>
      <div className="p-8 print:p-12 max-w-[210mm] mx-auto">
        <div className="grid grid-cols-2 gap-6 border-b-4 border-slate-800 pb-4 mb-6">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <img
                src="/logo.svg"
                alt="Logo Sekolah"
                className="h-20 w-20 object-contain"
              />
            </div>

            <div className="flex-1 text-left">
              <Text size="5" weight="bold" className="text-slate-900 block uppercase tracking-wide leading-tight mb-2 underline">
                {profile.name}
              </Text>
              <div className="space-y-0.5">
                <Text size="1" className="text-slate-600 block leading-tight">
                  {profile.address.street}, {profile.address.village}, {profile.address.district}
                </Text>
                <Text size="1" className="text-slate-600 block leading-tight">
                  {profile.address.city}, {profile.address.province} {profile.address.postalCode}
                </Text>
                <Text size="1" className="text-slate-600 block mt-1.5 leading-tight">
                  Telp: {profile.phone} | Email: {profile.email}
                </Text>
              </div>
            </div>
          </div>

          <div className="text-right pl-6">
            <table className="w-full text-sm">
              <tbody>
                <tr>
                  <td className="py-0 pr-3 text-right" style={{ width: '100px' }}>
                    <Text size="1" className="text-slate-600 leading-tight">Nama</Text>
                  </td>
                  <td className="py-0 pr-2 text-right">:</td>
                  <td className="py-0 text-right">
                    <Text size="1" weight="bold" className="text-slate-900 leading-tight">
                      {siswaInfo?.nama_lengkap || '-'}
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td className="py-0 pr-3 text-right">
                    <Text size="1" className="text-slate-600 leading-tight">NISN</Text>
                  </td>
                  <td className="py-0 pr-2 text-right">:</td>
                  <td className="py-0 text-right">
                    <Text size="1" className="font-mono text-slate-900 leading-tight">
                      {siswaInfo?.nisn || '-'}
                    </Text>
                  </td>
                </tr>
                <tr>
                  <td className="py-0 pr-3 text-right">
                    <Text size="1" className="text-slate-600 leading-tight">Kelas</Text>
                  </td>
                  <td className="py-0 pr-2 text-right">:</td>
                  <td className="py-0 text-right">
                    <Text size="1" className="text-slate-900 leading-tight">
                      {siswaInfo?.kelas || '-'}
                    </Text>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="text-center mb-4">
          <div className="inline-block bg-slate-800 text-white px-8 py-3">
            <Text size="5" weight="bold" className="uppercase tracking-wider">
              LEDGER RIWAYAT PEMBAYARAN
            </Text>
          </div>
          <Text size="2" className="text-slate-500 mt-2 block">
            Tanggal Cetak: {formatDate(timestamp)}
          </Text>
        </div>

        <div className="mb-4 bg-slate-100 border-2 border-slate-300 p-3 flex justify-between items-center">
          <Text size="2" weight="bold" className="text-slate-800">
            RINGKASAN
          </Text>
          <div className="flex gap-6 text-sm">
            <span className="text-slate-700">Total Tagihan: <span className="font-bold text-blue-700">{formatCurrency(grandTotal.totalTagihan || 0)}</span></span>
            <span className="text-slate-700">Terbayar: <span className="font-bold text-green-700">{formatCurrency(grandTotal.totalDibayar || 0)}</span></span>
            <span className={`font-bold ${grandTotal.sisaTagihan <= 0 ? 'text-green-700' : 'text-red-700'}`}>
              {grandTotal.sisaTagihan <= 0 ? 'LUNAS' : `Sisa: ${formatCurrency(grandTotal.sisaTagihan)}`}
            </span>
          </div>
        </div>

        {ledgerEntries.length === 0 ? (
          <div className="mb-6 border-2 border-slate-300 p-6 text-center">
            <Text size="3" className="text-slate-500">
              Belum ada riwayat pembayaran
            </Text>
          </div>
        ) : (
          <>
            {tagihanData.map((tagihan, tagihanIndex) => (
              <div key={tagihanIndex} className="mb-6 break-inside-avoid">
                <div className="bg-slate-100 border-2 border-slate-300 p-3 mb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <Text size="3" weight="bold" className="text-slate-900 block">
                        {tagihan.judul || '-'}
                      </Text>
                      <div className="flex gap-4 mt-1">
                        <Text size="1" className="text-slate-600">
                          No. Tagihan: <span className="font-mono">{tagihan.nomor_tagihan || '-'}</span>
                        </Text>
                        <Text size="1" className="text-slate-600">
                          Tahun Ajaran: {tagihan.tahun_ajaran || '-'}
                        </Text>
                      </div>
                    </div>
                    <div className="text-right">
                      <Text size="1" className="text-slate-600 block">Total Tagihan</Text>
                      <Text size="3" weight="bold" className="text-slate-900 font-mono">
                        {formatCurrency(tagihan.total_tagihan)}
                      </Text>
                    </div>
                  </div>
                </div>

                <table className="w-full text-sm border-2 border-slate-300 mb-4">
                  <thead>
                    <tr className="bg-slate-700 text-white">
                      <th className="py-2 px-3 text-left border-r border-slate-600" style={{ width: '40px' }}>
                        <Text size="2" weight="bold">No</Text>
                      </th>
                      <th className="py-2 px-3 text-left border-r border-slate-600" style={{ width: '120px' }}>
                        <Text size="2" weight="bold">Tanggal</Text>
                      </th>
                      <th className="py-2 px-3 text-center border-r border-slate-600" style={{ width: '80px' }}>
                        <Text size="2" weight="bold">Cicilan</Text>
                      </th>
                      <th className="py-2 px-3 text-center border-r border-slate-600" style={{ width: '120px' }}>
                        <Text size="2" weight="bold">Metode</Text>
                      </th>
                      <th className="py-2 px-3 text-right" style={{ width: '150px' }}>
                        <Text size="2" weight="bold">Jumlah</Text>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tagihan.pembayaran.map((pembayaran, index) => (
                      <tr key={index} className="border-b border-slate-300">
                        <td className="py-2 px-3 border-r border-slate-300 text-center">
                          <Text size="2" className="text-slate-700">{index + 1}</Text>
                        </td>
                        <td className="py-2 px-3 border-r border-slate-300">
                          <Text size="2" className="text-slate-700">
                            {formatDateTime(pembayaran.tanggal_bayar)}
                          </Text>
                        </td>
                        <td className="py-2 px-3 border-r border-slate-300 text-center">
                          <Text size="2" className="text-slate-700">
                            {pembayaran.cicilan_ke || '-'}
                          </Text>
                        </td>
                        <td className="py-2 px-3 border-r border-slate-300 text-center">
                          <Text size="2" className="text-slate-700">
                            {getMetodeLabel(pembayaran.metode_pembayaran)}
                          </Text>
                        </td>
                        <td className="py-2 px-3 text-right">
                          <Text size="2" weight="bold" className="font-mono text-slate-900">
                            {formatCurrency(pembayaran.jumlah_dibayar)}
                          </Text>
                        </td>
                      </tr>
                    ))}
                    <tr className="bg-slate-100">
                      <td colSpan="4" className="py-2 px-3 text-right">
                        <Text size="2" weight="bold" className="text-slate-900">
                          Total Dibayar
                        </Text>
                      </td>
                      <td className="py-2 px-3 text-right bg-slate-200">
                        <Text size="3" weight="bold" className="font-mono text-slate-900">
                          {formatCurrency(tagihan.total_dibayar)}
                        </Text>
                      </td>
                    </tr>
                    <tr className={tagihan.status_lunas ? 'bg-green-50' : 'bg-red-50'}>
                      <td colSpan="4" className="py-2 px-3 text-right">
                        <Text size="2" weight="bold" className={tagihan.status_lunas ? 'text-green-700' : 'text-red-700'}>
                          {tagihan.status_lunas ? 'Status: LUNAS' : 'Sisa Tagihan'}
                        </Text>
                      </td>
                      <td className="py-2 px-3 text-right">
                        <Text size="3" weight="bold" className={`font-mono ${tagihan.status_lunas ? 'text-green-700' : 'text-red-700'}`}>
                          {formatCurrency(tagihan.sisa_tagihan)}
                        </Text>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ))}

            <div className="border-t-4 border-slate-800 pt-4 mb-8">
              <div className="flex justify-between items-center bg-slate-800 text-white p-4">
                <Text size="4" weight="bold" className="uppercase">
                  Total Seluruh Pembayaran
                </Text>
                <Text size="5" weight="bold" className="font-mono">
                  {formatCurrency(totalAmount)}
                </Text>
              </div>
            </div>

            <div className="mb-8 border-2 border-slate-300 p-3">
              <Text size="2" className="text-slate-600">
                Terbilang: <span className="font-semibold text-slate-900 italic">
                  # {angkaTerbilang(totalAmount)} #
                </span>
              </Text>
            </div>
          </>
        )}

        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="text-center mb-1">
              <Text size="2" className="text-slate-600 block mb-1">
                {profile.address.city}, {formatDate(timestamp)}
              </Text>
              <Text size="2" weight="bold" className="text-slate-900 block mb-16">
                Bendahara
              </Text>
            </div>
            <div className="text-center border-t-2 border-slate-800 pt-2 mt-16">
              <Text size="2" className="text-slate-600">
                ( ................................ )
              </Text>
            </div>
          </div>
        </div>

        <div className="text-center pt-4 border-t border-slate-300">
          <Text size="1" className="text-slate-500 italic">
            Dokumen ini dicetak otomatis dan sah tanpa tanda tangan basah.
          </Text>
          <Text size="1" className="text-slate-500 italic block">
            Simpan dokumen ini sebagai arsip resmi.
          </Text>
        </div>
      </div>
    </div>
  )
})
