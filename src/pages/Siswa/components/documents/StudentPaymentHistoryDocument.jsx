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

export const StudentPaymentHistoryDocument = forwardRef(function StudentPaymentHistoryDocument({ historyData, contentId = 'student-history-content' }, ref) {
  if (!historyData) return null

  const { siswaInfo, ledgerEntries = [], grandTotal = {}, timestamp } = historyData
  const profile = SCHOOL_IDENTITY.profile

  return (
    <div id={contentId} ref={ref} className="bg-white print:p-0">
      <div className="p-8 print:pt-2 print:px-6 print:pb-6 max-w-[210mm] mx-auto">
        {/* Header Sekolah - 3 Kolom */}
        <div className="grid grid-cols-[auto_1fr_1fr] gap-4 border-b-2 border-slate-800 pb-3 mb-3" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src="/logo.svg"
              alt="Logo Sekolah"
              className="h-16 w-16 object-contain"
            />
          </div>

          {/* Nama Sekolah */}
          <div className="flex items-center">
            <div>
              <Text size="4" weight="bold" className="text-slate-900 uppercase tracking-wide leading-tight block">
                {profile.name}
              </Text>
              <Text size="1" className="text-slate-600 mt-1 block">
                NSS: {profile.nss} | NPSN: {profile.npsn}
              </Text>
            </div>
          </div>

          {/* Alamat Sekolah */}
          <div className="flex items-center text-xs leading-tight text-slate-600 text-right">
            <div className="w-full">
              {profile.address.street}, {profile.address.village}, {profile.address.district}, {profile.address.city}, {profile.address.province} {profile.address.postalCode}
              <div className="mt-1">
                Telp: {profile.phone} | Email: {profile.email}
              </div>
            </div>
          </div>
        </div>

        {/* Identitas Siswa & Judul - 2 Kolom */}
        <div className="grid grid-cols-2 gap-4 border-b-2 border-slate-800 pb-3 mb-4" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
          {/* Kiri: Identitas Siswa */}
          <div>
            <div className="text-xs grid grid-cols-[auto_auto_1fr] gap-x-2 gap-y-0.5">
              <span className="text-slate-600">Nama</span>
              <span className="text-slate-600">:</span>
              <span className="text-slate-900"><strong>{siswaInfo?.nama_lengkap || '-'}</strong></span>
              
              <span className="text-slate-600">NISN</span>
              <span className="text-slate-600">:</span>
              <span className="text-slate-900 font-mono">{siswaInfo?.nisn || '-'}</span>
              
              <span className="text-slate-600">Kelas</span>
              <span className="text-slate-600">:</span>
              <span className="text-slate-900">{siswaInfo?.kelas || '-'}</span>
            </div>
          </div>

          {/* Kanan: Judul & Tanggal Cetak */}
          <div className="text-right flex flex-col justify-center">
            <Text size="4" weight="bold" className="text-slate-900 uppercase tracking-wider block">
              LEDGER RIWAYAT PEMBAYARAN
            </Text>
            <Text size="1" className="text-slate-600 mt-1 block">
              Tanggal Cetak: {formatDate(timestamp)}
            </Text>
          </div>
        </div>

        <div className="mb-4 bg-slate-100 border-2 border-slate-300 p-3 flex justify-between items-center" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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
          <div className="mb-4 font-mono text-xs leading-relaxed">
            {/* Ledger Header */}
            <div className="border-y-2 border-slate-800 py-1.5 mb-2 font-bold text-slate-800 flex" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div style={{ width: '80px' }}>TANGGAL</div>
              <div style={{ width: '360px' }}>KETERANGAN</div>
              <div style={{ width: '120px' }} className="text-right">DEBIT</div>
              <div style={{ width: '120px' }} className="text-right">KREDIT</div>
              <div style={{ width: '120px' }} className="text-right">SALDO</div>
            </div>

            {/* Ledger Entries */}
            <div className="space-y-0">
              {ledgerEntries.map((entry, index) => {
                // Status Pembayaran Row
                if (entry.type === 'status_pembayaran') {
                  const statusText = entry.sisaTagihan <= 0 ? '✓ LUNAS' :
                                     entry.sisaTagihan > 0 ? `KURANG BAYAR ${formatCurrency(entry.sisaTagihan)}` : ''
                  const statusBg = entry.sisaTagihan <= 0 ? 'bg-green-100' : 'bg-red-100'
                  const statusTextColor = entry.sisaTagihan <= 0 ? 'text-green-800' : 'text-red-800'

                  return (
                    <div key={index} className={`${statusBg} ${statusTextColor} border-y border-slate-400 py-1.5 px-2 mb-2 font-bold flex justify-between`} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                      <span>STATUS: {entry.namaTagihan}</span>
                      <span>{statusText}</span>
                    </div>
                  )
                }

                // Tagihan Row (Header Tagihan)
                if (entry.type === 'tagihan') {
                  return (
                    <div key={index} className="bg-blue-50 border-t border-blue-200 py-1.5 flex font-bold" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                      <div style={{ width: '80px' }} className="text-slate-700">
                        {formatDate(entry.tanggal)}
                      </div>
                      <div style={{ width: '360px' }} className="text-slate-900">
                        <div className="uppercase">{entry.namaTagihan}</div>
                        <div className="text-[0.65rem] text-slate-600 font-normal">
                          {entry.tahunAjaran} • Kelas {entry.kelas} • Ref: {entry.referensi}
                        </div>
                      </div>
                      <div style={{ width: '120px' }} className="text-left pl-2 text-blue-700">
                        {formatCurrency(entry.nominalTagihan)}
                      </div>
                      <div style={{ width: '120px' }} className="text-right">
                        
                      </div>
                      <div style={{ width: '120px' }} className="text-right text-red-700">
                        {formatCurrency(Math.abs(entry.saldo))}
                      </div>
                    </div>
                  )
                }

                // Rincian Tagihan Row (Breakdown)
                if (entry.type === 'rincian_tagihan') {
                  return (
                    <div key={index} className="py-0.5 flex text-[0.7rem] text-indigo-700" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                      <div style={{ width: '80px' }}>
                        
                      </div>
                      <div style={{ width: '480px' }} className="pl-6 flex items-center">
                        <span className="whitespace-nowrap">↳ {entry.jenisPembayaran}</span>
                        {entry.deskripsi && <span className="text-slate-500 whitespace-nowrap"> • {entry.deskripsi}</span>}
                        {entry.referensi && <span className="text-slate-500 whitespace-nowrap"> [{entry.referensi}]</span>}
                        <span className="flex-1 border-b border-dotted border-slate-400 mx-2 min-w-[20px]"></span>
                        <span className="whitespace-nowrap">{formatCurrency(entry.nominalJenis)}</span>
                      </div>
                      <div style={{ width: '120px' }} className="text-right">
                        
                      </div>
                      <div style={{ width: '120px' }} className="text-right">
                        
                      </div>
                    </div>
                  )
                }

                // Pembayaran Row
                if (entry.type === 'pembayaran') {
                  return (
                    <div key={index} className="bg-green-50 py-1.5 flex" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                      <div style={{ width: '80px' }} className="text-slate-700">
                        {formatDate(entry.tanggal)}
                      </div>
                      <div style={{ width: '480px' }} className="text-slate-900 flex items-center">
                        <div className="whitespace-nowrap">
                          <div>Pembayaran: {entry.namaTagihan}</div>
                          <div className="text-[0.65rem] text-slate-600">
                            Ref: {entry.referensi} • {entry.metode ? getMetodeLabel(entry.metode) : '-'}
                          </div>
                        </div>
                        <span className="flex-1 border-b border-dotted border-slate-400 mx-2 min-w-[20px]"></span>
                        <span className="whitespace-nowrap text-green-700 font-bold">{formatCurrency(entry.nominalBayar)}</span>
                      </div>
                      <div style={{ width: '120px' }} className={`text-right font-bold ${
                        entry.saldo > 0 ? 'text-red-700' : entry.saldo === 0 ? 'text-slate-700' : 'text-green-700'
                      }`}>
                        {formatCurrency(Math.abs(entry.saldo))}
                      </div>
                    </div>
                  )
                }

                return null
              })}
            </div>

            {/* Ledger Footer - Grand Total */}
            <div className="border-t-2 border-slate-800 mt-4 pt-2 space-y-1" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <div className="flex font-bold text-slate-800">
                <div style={{ width: '440px' }} className="text-right pr-4">
                  TOTAL TAGIHAN:
                </div>
                <div style={{ width: '120px' }} className="text-right text-blue-700">
                  {formatCurrency(grandTotal.totalTagihan || 0)}
                </div>
                <div style={{ width: '120px' }} className="text-right">
                  
                </div>
                <div style={{ width: '120px' }} className="text-right">
                  
                </div>
              </div>
              <div className="flex font-bold text-slate-800">
                <div style={{ width: '440px' }} className="text-right pr-4">
                  TOTAL DIBAYAR:
                </div>
                <div style={{ width: '120px' }} className="text-right">
                  
                </div>
                <div style={{ width: '120px' }} className="text-right text-green-700">
                  {formatCurrency(grandTotal.totalDibayar || 0)}
                </div>
                <div style={{ width: '120px' }} className="text-right">
                  
                </div>
              </div>
              <div className={`flex font-bold text-lg ${
                grandTotal.sisaTagihan > 0 ? 'text-red-700' : grandTotal.sisaTagihan === 0 ? 'text-green-700' : 'text-slate-700'
              }`}>
                <div style={{ width: '560px' }} className="text-right pr-4">
                  SALDO AKHIR:
                </div>
                <div style={{ width: '120px' }} className="text-right">
                  {grandTotal.sisaTagihan > 0 ? '- ' : ''}{formatCurrency(Math.abs(grandTotal.sisaTagihan || 0))}
                </div>
              </div>
              {grandTotal.sisaTagihan <= 0 && (
                <div className="text-center text-green-700 font-bold text-sm pt-2">
                  ✓ SEMUA TAGIHAN LUNAS
                </div>
              )}
            </div>

            <div className="mt-6 mb-4 border-2 border-slate-300 p-3 bg-slate-50" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <Text size="2" className="text-slate-700 font-sans">
                Terbilang: <span className="font-semibold text-slate-900 italic">
                  {angkaTerbilang(grandTotal.totalDibayar || 0)}
                </span>
              </Text>
            </div>
          </div>
        )}

        <div className="flex justify-end mb-8" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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

        <div className="text-center pt-4 border-t border-slate-300" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
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
