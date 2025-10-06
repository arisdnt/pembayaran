import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { Receipt, CheckCircle2 } from 'lucide-react'
import {
  getSchoolName,
  getSchoolAddress,
  getSchoolPhone,
  getSchoolEmail,
  getAppPublisher,
  getAppLegalNotice,
} from '../../../config/appInfo'

function formatCurrency(value) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value || 0)
}

export function ReceiptLayout({ siswa, riwayatKelas, tagihanData }) {
  const currentRiwayat = riwayatKelas.find(r => r.status?.toLowerCase() === 'aktif') || riwayatKelas[0]
  const totalKeseluruhan = tagihanData.reduce((sum, g) => sum + g.totalTagihan, 0)
  const totalDibayar = tagihanData.reduce((sum, g) => sum + g.totalDibayar, 0)
  const totalTunggakan = totalKeseluruhan - totalDibayar

  const tanggalLahir = siswa.tanggal_lahir
    ? format(new Date(siswa.tanggal_lahir), 'dd MMM yyyy', { locale: id })
    : null

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-2xl mx-auto p-4">
        {/* Receipt Paper */}
        <div className="bg-white shadow-lg border border-slate-200">

          {/* Header */}
          <div className="text-white p-4" style={{ backgroundColor: '#476EAE' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Receipt className="w-6 h-6 flex-shrink-0 mt-1" />
                <div>
                  <p className="text-xl font-bold">{siswa.nama_lengkap}</p>
                  <p className="text-sm text-white/70">
                    {siswa.nisn}
                    {tanggalLahir && <span> | {tanggalLahir}</span>}
                  </p>
                </div>
              </div>
              <div className="sm:text-right text-xs leading-relaxed">
                {currentRiwayat && (
                  <p className="text-white/90">
                    Kelas: <span className="font-semibold">{currentRiwayat.kelas?.tingkat} {currentRiwayat.kelas?.nama_sub_kelas}</span> | TA: <span className="font-semibold">{currentRiwayat.tahun_ajaran?.nama}</span>
                  </p>
                )}
                <p className="text-white/90">
                  Status: <span className={`font-semibold ${siswa.status_aktif ? 'text-green-300' : 'text-red-300'}`}>
                    {siswa.status_aktif ? 'AKTIF' : 'TIDAK AKTIF'}
                  </span>
                </p>
                {siswa.nama_wali_siswa && (
                  <p className="text-white/90">
                    Wali: <span className="font-semibold">{siswa.nama_wali_siswa}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Summary */}
          {tagihanData.length > 0 && (
            <div className="p-6 bg-slate-50 border-b-2 border-dashed">
              <div className="space-y-2">
                <div className="flex justify-between text-base">
                  <span className="text-slate-600">Total Tagihan</span>
                  <span className="font-bold">{formatCurrency(totalKeseluruhan)}</span>
                </div>
                <div className="flex justify-between text-base text-green-700">
                  <span>Sudah Dibayar</span>
                  <span className="font-bold">- {formatCurrency(totalDibayar)}</span>
                </div>
                <div className="border-t-2 border-slate-300 pt-2 mt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-slate-800">SISA TUNGGAKAN</span>
                    <span className={`text-2xl font-bold ${totalTunggakan > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {formatCurrency(totalTunggakan)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Detail Per Periode */}
          <div className="p-6">
            {tagihanData.length === 0 ? (
              <div className="text-center py-12 text-slate-500">
                <Receipt className="w-16 h-16 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">Belum Ada Tagihan</p>
                <p className="text-sm">Tagihan akan muncul di sini ketika sudah dibuat</p>
              </div>
            ) : (
              <div className="space-y-8">
                {tagihanData.map((group, gIdx) => (
                  <div key={gIdx}>
                    {/* Periode Header */}
                    <div className="mb-4 pb-3 border-b-2 border-slate-300">
                      <h2 className="font-bold text-lg text-slate-800">
                        {group.tahunAjaran} - {group.kelas}
                      </h2>
                      <div className="flex justify-between text-sm mt-2">
                        <span className="text-slate-600">
                          Tagihan: {formatCurrency(group.totalTagihan)} |
                          Dibayar: {formatCurrency(group.totalDibayar)}
                        </span>
                        <span className={`font-bold ${group.sisaTagihan > 0 ? 'text-red-600' : 'text-green-600'}`}>
                          Sisa: {formatCurrency(group.sisaTagihan)}
                        </span>
                      </div>
                    </div>

                    {/* Tagihan List */}
                    <div className="space-y-6">
                      {group.tagihan.map((item) => {
                        const isPaid = item.sisaTagihan <= 0
                        return (
                          <div key={item.id} className="border-l-4 border-slate-300 pl-4">
                            {/* Tagihan Header */}
                            <div className="mb-3">
                              <div className="flex justify-between items-center pb-2 border-b-2 border-slate-300">
                                <div className="flex-1">
                                  <h3 className="font-bold text-base text-slate-800">{item.judul}</h3>
                                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                                    <span className="font-mono">{item.nomor_tagihan}</span>
                                    <span>{format(new Date(item.tanggal_tagihan), 'dd MMM yyyy', { locale: id })}</span>
                                  </div>
                                </div>
                                {isPaid && <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 ml-3" />}
                              </div>
                            </div>

                            {/* Rincian Tagihan */}
                            <div className="mb-3 space-y-1">
                              {(item.rincian_tagihan || []).map((rincian, rIdx) => (
                                <div key={rIdx} className="flex justify-between items-center text-sm pb-1 border-b border-slate-200">
                                  <div className="flex-1">
                                    <span className="text-slate-700 font-bold">
                                      {rincian.jenis_pembayaran?.nama || rincian.keterangan || 'Item'}
                                    </span>
                                    {rincian.keterangan && rincian.jenis_pembayaran?.nama && (
                                      <span className="text-xs text-slate-500 ml-2">({rincian.keterangan})</span>
                                    )}
                                  </div>
                                  <span className="font-semibold text-slate-800 ml-3">
                                    {formatCurrency(rincian.jumlah)}
                                  </span>
                                </div>
                              ))}
                            </div>

                            {/* Rincian Pembayaran */}
                            {item.pembayaran && item.pembayaran.length > 0 && (
                              <div className="mb-2 bg-green-50 p-2">
                                <p className="text-xs font-bold text-green-800 uppercase tracking-wide mb-1">
                                  Riwayat Pembayaran
                                </p>
                                <div className="space-y-0.5">
                                  {item.pembayaran.map((pembayaran) => {
                                    const tglPembayaran = pembayaran.tanggal_pembayaran
                                      ? format(new Date(pembayaran.tanggal_pembayaran), 'dd/MM/yy', { locale: id })
                                      : '-'
                                    return (pembayaran.rincian_pembayaran || []).map((rp, rpIdx) => {
                                      const tglBayar = rp.tanggal_bayar
                                        ? format(new Date(rp.tanggal_bayar), 'dd/MM/yy', { locale: id })
                                        : tglPembayaran
                                      return (
                                        <div key={`${pembayaran.id}-${rpIdx}`} className="flex justify-between items-center text-sm">
                                          <div className="flex-1 flex items-center gap-2">
                                            <span className="text-green-800 font-medium">
                                              {rp.nomor_transaksi || pembayaran.nomor_pembayaran || `Cicilan ${rp.cicilan_ke || '-'}`}
                                            </span>
                                            <span className="text-xs text-green-600">| {tglBayar}</span>
                                          </div>
                                          <span className="font-semibold text-green-800">
                                            {formatCurrency(rp.jumlah_dibayar)}
                                          </span>
                                        </div>
                                      )
                                    })
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Summary */}
                            <div className="border-t border-dashed pt-2 space-y-1">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-600">Total Tagihan</span>
                                <span className="font-bold">{formatCurrency(item.totalTagihan)}</span>
                              </div>
                              <div className="flex justify-between text-sm text-green-700">
                                <span>Sudah Dibayar</span>
                                <span className="font-bold">- {formatCurrency(item.totalDibayar)}</span>
                              </div>
                              <div className="flex justify-between items-center pt-1 border-t">
                                <span className="font-bold text-slate-700">
                                  {isPaid ? 'Status' : 'Sisa Tagihan'}
                                </span>
                                {isPaid ? (
                                  <span className="bg-green-600 text-white px-3 py-1 text-xs font-bold">
                                    ✓ LUNAS
                                  </span>
                                ) : (
                                  <span className="text-lg font-bold text-red-600">
                                    {formatCurrency(item.sisaTagihan)}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="text-white p-4 text-xs" style={{ backgroundColor: '#476EAE' }}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="leading-tight">
                <p className="font-semibold text-white">{getAppPublisher()}</p>
                <p className="text-white/70">{getAppLegalNotice()}</p>
                <p className="text-white/60">
                  Digenerate: {format(new Date(), 'dd/MM/yyyy HH:mm', { locale: id })}
                </p>
              </div>
              <div className="sm:text-right leading-tight">
                <p className="font-bold text-white">{getSchoolName()}</p>
                <p className="text-white/80">{getSchoolAddress()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
