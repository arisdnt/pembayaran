import { Text } from '@radix-ui/themes'
import { Wallet, ChevronRight } from 'lucide-react'

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

function formatCurrency(value) {
  const amount = Number(value || 0)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

// Skeleton Component
function PembayaranDetailSkeleton() {
  return (
    <div className="relative h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-indigo-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Pembayaran
          </Text>
        </div>
      </div>
      <div className="flex-1 min-h-0 overflow-auto excel-scrollbar">
        <div className="p-4 space-y-3 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-3 bg-slate-50 border border-slate-300">
              <div className="h-3 w-24 bg-slate-200 mb-2" />
              <div className="h-4 w-full bg-slate-200" />
            </div>
          ))}
        </div>
      </div>
      <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
        <div className="h-3 w-48 bg-slate-200 mx-auto" />
      </div>
    </div>
  )
}

// Empty Component
function PembayaranDetailEmpty() {
  const schoolName = import.meta.env.VITE_SCHOOL_NAME || 'Nama Sekolah'
  
  return (
    <div className="relative h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-indigo-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Pembayaran
          </Text>
        </div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center border-2 border-dashed border-slate-300 bg-slate-50 mb-4">
          <Wallet className="h-8 w-8 text-slate-300" />
        </div>
        <Text size="2" weight="medium" className="text-slate-500 mb-1">
          Tidak ada data dipilih
        </Text>
        <div className="flex items-center gap-1 text-slate-400 text-xs mt-2">
          <ChevronRight className="h-3 w-3" />
          <Text size="1">
            Pilih pembayaran dari tabel untuk melihat detail
          </Text>
        </div>
      </div>
      <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
        <Text size="1" className="text-slate-600 text-center block">
          Data Pembayaran - {schoolName}
        </Text>
      </div>
    </div>
  )
}

// Info Component
function PembayaranDetailInfo({ pembayaran }) {
  const siswa = pembayaran.tagihan?.riwayat_kelas_siswa?.siswa
  const rincian = [...(pembayaran.rincian_pembayaran || [])]
    .sort((a, b) => new Date(a.tanggal_bayar || 0) - new Date(b.tanggal_bayar || 0))
  const totalDibayar = typeof pembayaran.total_dibayar === 'number'
    ? pembayaran.total_dibayar
    : rincian.reduce((sum, item) => sum + Number(item.jumlah_dibayar || 0), 0)

  const tanggalPembayaran = pembayaran.tanggal_dibuat || pembayaran.dibuat_pada || pembayaran.diperbarui_pada

  return (
    <div className="space-y-3">
      {/* Informasi Utama */}
      <div className="p-3 bg-slate-50 border border-slate-300">
        <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider mb-2 block">
          Informasi Pembayaran
        </Text>
        <Text size="4" weight="bold" className="text-slate-900 block mb-1">
          {pembayaran.nomor_pembayaran}
        </Text>
        <Text size="1" className="text-slate-500">
          {formatDateTime(tanggalPembayaran)}
        </Text>
      </div>

      {/* Siswa */}
      <div className="p-3 bg-white border border-slate-300">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Siswa
          </Text>
        </div>
        <Text size="2" weight="bold" className="text-slate-900">
          {siswa?.nama_lengkap || '—'}
        </Text>
      </div>

      {/* Tagihan */}
      <div className="p-3 bg-white border border-slate-300">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="h-4 w-4 text-indigo-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Tagihan
          </Text>
        </div>
        <div className="space-y-1">
          <div>
            <Text size="1" className="text-slate-500 block">Nomor Tagihan</Text>
            <Text size="2" className="text-slate-900">{pembayaran.tagihan?.nomor_tagihan || '—'}</Text>
          </div>
          <div>
            <Text size="1" className="text-slate-500 block">Judul</Text>
            <Text size="2" weight="bold" className="text-slate-900">{pembayaran.tagihan?.judul || '—'}</Text>
          </div>
        </div>
      </div>

      {/* Informasi Akademik */}
      <div className="p-3 bg-white border border-slate-300">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="h-4 w-4 text-green-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Informasi Akademik
          </Text>
        </div>
        <div className="space-y-1">
          <div>
            <Text size="1" className="text-slate-500 block">Kelas</Text>
            <Text size="2" className="text-slate-900">
              {pembayaran.kelas_tagihan
                ? `Kelas ${pembayaran.kelas_tagihan.tingkat} ${pembayaran.kelas_tagihan.nama_sub_kelas}`
                : 'Kelas belum tersedia'}
            </Text>
          </div>
          <div>
            <Text size="1" className="text-slate-500 block">Tahun Ajaran</Text>
            <Text size="2" className="text-slate-900">
              {pembayaran.tahun_ajaran_tagihan?.nama || 'Tahun ajaran belum tersedia'}
            </Text>
          </div>
        </div>
      </div>

      {/* Rincian Pembayaran */}
      <div className="p-3 bg-white border border-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <Wallet className="h-4 w-4 text-purple-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Rincian Pembayaran
          </Text>
        </div>
        <div className="space-y-2 max-h-[300px] overflow-auto">
          {rincian.length > 0 ? (
            rincian.map((item, index) => (
              <div key={item.id} className="p-2 bg-slate-50 border border-slate-200">
                <div className="flex justify-between items-start mb-1">
                  <Text size="2" weight="bold" className="text-slate-900">
                    #{String(index + 1).padStart(2, '0')} {item.metode_pembayaran || 'Pembayaran'}
                  </Text>
                  <Text size="2" weight="bold" className="text-green-600">
                    {formatCurrency(item.jumlah_dibayar)}
                  </Text>
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between">
                    <Text size="1" className="text-slate-500">No. Transaksi</Text>
                    <Text size="1" className="text-slate-700">{item.nomor_transaksi || '—'}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text size="1" className="text-slate-500">Tanggal</Text>
                    <Text size="1" className="text-slate-700">{formatDateTime(item.tanggal_bayar)}</Text>
                  </div>
                  <div className="flex justify-between">
                    <Text size="1" className="text-slate-500">Cicilan</Text>
                    <Text size="1" className="text-slate-700">{item.cicilan_ke ? `Ke-${item.cicilan_ke}` : '—'}</Text>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-slate-500 py-4">
              <Text size="2">Belum ada rincian pembayaran</Text>
            </div>
          )}
        </div>
      </div>

      {/* Total Pembayaran */}
      <div className="p-3 bg-green-50 border border-green-300">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="h-4 w-4 text-green-600" />
          <Text size="1" weight="medium" className="text-green-700 uppercase tracking-wider">
            Total Dibayar
          </Text>
        </div>
        <Text size="5" weight="bold" className="text-green-900">
          {formatCurrency(totalDibayar)}
        </Text>
      </div>

      {/* Catatan */}
      {pembayaran.catatan && (
        <div className="p-3 bg-white border border-slate-300">
          <div className="flex items-center gap-2 mb-1">
            <Wallet className="h-4 w-4 text-amber-500" />
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
              Catatan
            </Text>
          </div>
          <Text size="2" className="text-slate-700">
            {pembayaran.catatan}
          </Text>
        </div>
      )}

      {/* ID */}
      <div className="p-3 bg-slate-50 border border-slate-300">
        <div className="flex items-center gap-2 mb-1">
          <Wallet className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            ID
          </Text>
        </div>
        <Text size="1" className="text-slate-500 font-mono break-all">
          {pembayaran.id}
        </Text>
      </div>
    </div>
  )
}

// Main Panel Component
export function DetailPanel({ selectedItem, isLoading = false, isRefreshing = false }) {
  const schoolName = import.meta.env.VITE_SCHOOL_NAME || 'Nama Sekolah'

  if (isLoading) {
    return <PembayaranDetailSkeleton />
  }

  if (!selectedItem) {
    return <PembayaranDetailEmpty />
  }

  return (
    <div className="relative h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
      {isRefreshing ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent animate-pulse" />
      ) : null}

      {/* Header */}
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-5 w-5 text-indigo-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Pembayaran
          </Text>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto excel-scrollbar">
        <div className="p-4 space-y-3">
          <PembayaranDetailInfo pembayaran={selectedItem} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
        <Text size="1" className="text-slate-600 text-center block">
          Data Pembayaran - {schoolName}
        </Text>
      </div>

      {/* Excel-style scrollbar */}
      <style>{`
        .excel-scrollbar::-webkit-scrollbar {
          width: 12px;
        }

        .excel-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-left: 1px solid #cbd5e1;
        }

        .excel-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border: 2px solid #e2e8f0;
          transition: background 0.2s;
        }

        .excel-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  )
}
