import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageLayout } from '../../layout/PageLayout'
import { Text, Badge } from '@radix-ui/themes'
import { ArrowLeft, Wallet, Hash, Receipt, FileText, Calendar, CreditCard, Clock, CheckCircle, XCircle } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

function DetailPembayaranContent() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [pembayaran, setPembayaran] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPembayaran = async () => {
      try {
        setLoading(true)

        const { data, error } = await supabase
          .from('pembayaran')
          .select(`
            *,
            tagihan:id_tagihan(
              *,
              riwayat_kelas_siswa:id_riwayat_kelas_siswa(
                siswa:id_siswa(nama_lengkap, nisn),
                kelas:id_kelas(tingkat, nama_sub_kelas),
                tahun_ajaran:id_tahun_ajaran(nama)
              ),
              rincian_tagihan(
                id, deskripsi, jumlah,
                jenis_pembayaran:id_jenis_pembayaran(kode, nama)
              )
            ),
            rincian_pembayaran(
              *
            )
          `)
          .eq('id', id)
          .single()

        if (error) throw error
        setPembayaran(data)
      } catch (err) {
        console.error('Error fetching pembayaran:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPembayaran()
    }
  }, [id])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <Text size="3" className="text-slate-500">Memuat data pembayaran...</Text>
        </div>
      </PageLayout>
    )
  }

  if (error || !pembayaran) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <Text size="4" className="text-red-600">Gagal memuat data pembayaran</Text>
          {error && <Text size="2" className="text-slate-500">{error}</Text>}
          <button
            onClick={() => navigate('/pembayaran')}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Kembali ke Daftar Pembayaran
          </button>
        </div>
      </PageLayout>
    )
  }

  const totalTagihan = pembayaran.tagihan?.rincian_tagihan?.reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0) || 0
  const totalPembayaran = pembayaran.rincian_pembayaran?.reduce((sum, r) => sum + parseFloat(r.jumlah_dibayar || 0), 0) || 0
  const totalVerified = pembayaran.rincian_pembayaran?.filter(r => r.status === 'verified').reduce((sum, r) => sum + parseFloat(r.jumlah_dibayar || 0), 0) || 0

  return (
    <PageLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="shrink-0 bg-white px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-blue-600" />
              <Text size="4" weight="bold" className="text-slate-900">
                Detail Pembayaran
              </Text>
            </div>
            <button
              onClick={() => navigate('/pembayaran')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 text-slate-600" />
              <Text size="2" weight="medium" className="text-slate-700">
                Kembali
              </Text>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto px-6 pb-6">
          <div className="max-w-6xl mx-auto space-y-4">
            {/* Header Info */}
            <div className="border-2 border-slate-300 bg-white shadow-lg">
              <div className="bg-gradient-to-b from-slate-100 to-slate-50 px-6 py-4 border-b-2 border-slate-300">
                <Text size="1" className="text-slate-600 uppercase tracking-wider mb-2 block">
                  Nomor Pembayaran
                </Text>
                <Text size="6" weight="bold" className="text-slate-900 font-mono">
                  {pembayaran.nomor_pembayaran}
                </Text>
              </div>
              <div className="p-6 grid grid-cols-3 gap-6">
                <div>
                  <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">ID Pembayaran</Text>
                  <Text size="2" className="text-slate-700 font-mono">{pembayaran.id}</Text>
                </div>
                <div>
                  <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Tanggal Dibuat</Text>
                  <Text size="2" className="text-slate-700">{formatDateTime(pembayaran.tanggal_dibuat)}</Text>
                </div>
                {pembayaran.catatan && (
                  <div className="col-span-3">
                    <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Catatan</Text>
                    <Text size="2" className="text-slate-700">{pembayaran.catatan}</Text>
                  </div>
                )}
              </div>
            </div>

            {/* Tagihan Info */}
            {pembayaran.tagihan && (
              <div className="border-2 border-slate-300 bg-white shadow-lg">
                <div className="bg-gradient-to-b from-slate-100 to-slate-50 px-6 py-3 border-b-2 border-slate-300">
                  <div className="flex items-center gap-2">
                    <Receipt className="h-4 w-4 text-slate-600" />
                    <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                      Informasi Tagihan
                    </Text>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Nomor Tagihan</Text>
                      <Text size="2" weight="bold" className="text-slate-900 font-mono">{pembayaran.tagihan.nomor_tagihan}</Text>
                    </div>
                    <div>
                      <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Judul</Text>
                      <Text size="2" className="text-slate-700">{pembayaran.tagihan.judul}</Text>
                    </div>
                  </div>
                  {pembayaran.tagihan.riwayat_kelas_siswa && (
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                      <div>
                        <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Nama Siswa</Text>
                        <Text size="2" className="text-slate-900">{pembayaran.tagihan.riwayat_kelas_siswa.siswa?.nama_lengkap}</Text>
                        <Text size="1" className="text-slate-500 font-mono">{pembayaran.tagihan.riwayat_kelas_siswa.siswa?.nisn}</Text>
                      </div>
                      <div>
                        <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Kelas</Text>
                        <Text size="2" className="text-slate-700">
                          {pembayaran.tagihan.riwayat_kelas_siswa.kelas?.tingkat} {pembayaran.tagihan.riwayat_kelas_siswa.kelas?.nama_sub_kelas}
                        </Text>
                        <Text size="1" className="text-slate-500">{pembayaran.tagihan.riwayat_kelas_siswa.tahun_ajaran?.nama}</Text>
                      </div>
                    </div>
                  )}
                  <div className="pt-4 border-t border-slate-200">
                    <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Total Tagihan</Text>
                    <Text size="4" weight="bold" className="text-slate-900 font-mono">{formatCurrency(totalTagihan)}</Text>
                  </div>
                </div>
              </div>
            )}

            {/* Rincian Pembayaran */}
            <div className="border-2 border-slate-300 bg-white shadow-lg">
              <div className="bg-gradient-to-b from-slate-100 to-slate-50 px-6 py-3 border-b-2 border-slate-300">
                <div className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-slate-600" />
                  <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Rincian Transaksi
                  </Text>
                </div>
              </div>
              <div className="p-6">
                {pembayaran.rincian_pembayaran && pembayaran.rincian_pembayaran.length > 0 ? (
                  <div className="space-y-4">
                    {pembayaran.rincian_pembayaran.map((rincian, index) => (
                      <div key={rincian.id} className="border border-slate-200 bg-slate-50">
                        <div className="bg-gradient-to-r from-slate-100 to-white px-4 py-2 border-b border-slate-200 flex items-center justify-between">
                          <Text size="2" weight="bold" className="text-slate-700">
                            Transaksi #{index + 1} - Cicilan ke-{rincian.cicilan_ke}
                          </Text>
                          <Badge color={rincian.status === 'verified' ? 'green' : rincian.status === 'rejected' ? 'red' : 'gray'}>
                            {rincian.status === 'verified' ? 'Terverifikasi' : rincian.status === 'rejected' ? 'Ditolak' : 'Pending'}
                          </Badge>
                        </div>
                        <div className="p-4 grid grid-cols-3 gap-4">
                          <div>
                            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">Nomor Transaksi</Text>
                            <Text size="2" className="text-slate-900 font-mono">{rincian.nomor_transaksi}</Text>
                          </div>
                          <div>
                            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">Jumlah Dibayar</Text>
                            <Text size="2" weight="bold" className="text-green-600 font-mono">{formatCurrency(rincian.jumlah_dibayar)}</Text>
                          </div>
                          <div>
                            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">Tanggal Bayar</Text>
                            <Text size="2" className="text-slate-700">{formatDateTime(rincian.tanggal_bayar)}</Text>
                          </div>
                          <div>
                            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">Metode</Text>
                            <Text size="2" className="text-slate-700 capitalize">{rincian.metode_pembayaran}</Text>
                          </div>
                          {rincian.referensi_pembayaran && (
                            <div>
                              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">Referensi</Text>
                              <Text size="2" className="text-slate-700 font-mono">{rincian.referensi_pembayaran}</Text>
                            </div>
                          )}
                          {rincian.catatan && (
                            <div className="col-span-3">
                              <Text size="1" className="text-slate-500 uppercase tracking-wider mb-1 block">Catatan</Text>
                              <Text size="2" className="text-slate-700">{rincian.catatan}</Text>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <Text size="2" className="text-slate-500 text-center py-8">Tidak ada rincian transaksi</Text>
                )}
              </div>
            </div>

            {/* Summary */}
            <div className="border-2 border-slate-300 bg-gradient-to-b from-slate-50 to-white shadow-lg p-6">
              <div className="grid grid-cols-3 gap-6">
                <div>
                  <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Total Pembayaran</Text>
                  <Text size="4" weight="bold" className="text-slate-900 font-mono">{formatCurrency(totalPembayaran)}</Text>
                </div>
                <div>
                  <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Terverifikasi</Text>
                  <Text size="4" weight="bold" className="text-green-600 font-mono">{formatCurrency(totalVerified)}</Text>
                </div>
                <div>
                  <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">Pending</Text>
                  <Text size="4" weight="bold" className="text-amber-600 font-mono">{formatCurrency(totalPembayaran - totalVerified)}</Text>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export function DetailPembayaran() {
  return <DetailPembayaranContent />
}
