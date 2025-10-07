import { Text } from '@radix-ui/themes'
import { Wallet, ChevronRight } from 'lucide-react'
import { getSchoolIdentityForEnv } from '../../../../config/appInfo'

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
    <div className="relative flex h-full flex-col border border-slate-300 bg-white shadow-lg">
      <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Pembayaran
          </Text>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4">
        <div className="space-y-4 animate-pulse">
          <div className="bg-slate-50 border border-slate-200 p-3">
            <div className="h-3 w-20 bg-slate-200 mb-2" />
            <div className="h-5 w-full bg-slate-200" />
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border-b border-slate-200 pb-3">
              <div className="h-3 w-24 bg-slate-200 mb-2" />
              <div className="ml-5">
                <div className="h-4 w-full bg-slate-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Empty Component
function PembayaranDetailEmpty() {
  return (
    <div className="relative flex h-full flex-col border border-slate-300 bg-white shadow-lg">
      <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-slate-600" />
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
    </div>
  )
}

// Info Component
function PembayaranDetailInfo({ pembayaran }) {
  const schoolIdentity = getSchoolIdentityForEnv()
  const sekolahName = schoolIdentity.profile.name
  const sekolahAddress = [
    schoolIdentity.profile.address.street,
    schoolIdentity.profile.address.village,
    schoolIdentity.profile.address.district,
    schoolIdentity.profile.address.city,
    schoolIdentity.profile.address.province,
    schoolIdentity.profile.address.postalCode,
  ].filter(Boolean).join(', ')
  const sekolahContactParts = [
    schoolIdentity.profile.phone,
    schoolIdentity.profile.email,
    schoolIdentity.profile.website,
  ].filter(Boolean)

  const siswa = pembayaran.tagihan?.riwayat_kelas_siswa?.siswa
  const rincian = [...(pembayaran.rincian_pembayaran || [])]
    .sort((a, b) => new Date(a.tanggal_bayar || 0) - new Date(b.tanggal_bayar || 0))
  const totalDibayar = typeof pembayaran.total_dibayar === 'number'
    ? pembayaran.total_dibayar
    : rincian.reduce((sum, item) => sum + Number(item.jumlah_dibayar || 0), 0)

  const tanggalPembayaran = pembayaran.tanggal_dibuat || pembayaran.dibuat_pada || pembayaran.diperbarui_pada

  return (
    <div className="w-full font-mono text-[0.85rem] leading-tight tracking-tight text-slate-800">
      {/* Header Sekolah */}
      <div className="mb-2 flex items-center gap-3">
        <div className="flex-shrink-0">
          <img
            src="/logo.svg"
            alt={`Logo ${sekolahName}`}
            className="h-12 w-12 object-contain"
            loading="lazy"
          />
        </div>
        <div className="flex-1 text-left">
          <Text size="2" weight="bold" className="text-slate-900 block uppercase tracking-wider leading-tight">
            {sekolahName}
          </Text>
          <div className="space-y-0">
            {sekolahAddress && (
              <Text size="1" className="text-slate-600 block leading-tight">
                {sekolahAddress}
              </Text>
            )}
            {sekolahContactParts.map((info, idx) => (
              <Text key={`${info}-${idx}`} size="1" className="text-slate-500 block leading-tight">
                {info}
              </Text>
            ))}
          </div>
        </div>
      </div>

      <div className="text-[0.7rem] text-slate-400 text-center mb-3">
        {'='.repeat(32)}
      </div>

      {/* Informasi Pembayaran */}
      <div className="mb-3 space-y-1 px-2">
        <div className="flex justify-between text-[0.85rem]">
          <span className="text-slate-500">No. Pembayaran</span>
          <span className="font-bold text-slate-900">{pembayaran.nomor_pembayaran}</span>
        </div>
        <div className="flex justify-between text-[0.8rem]">
          <span className="text-slate-500">Tanggal</span>
          <span className="text-slate-800 font-medium">{formatDateTime(tanggalPembayaran)}</span>
        </div>
        <div className="flex justify-between text-[0.8rem]">
          <span className="text-slate-500">Nomor Tagihan</span>
          <span className="text-slate-800 font-medium">{pembayaran.tagihan?.nomor_tagihan || '—'}</span>
        </div>
        <div className="flex justify-between text-[0.8rem]">
          <span className="text-slate-500">Siswa</span>
          <span className="text-slate-900 max-w-[55%] text-right font-semibold">{siswa?.nama_lengkap || '—'}</span>
        </div>
      </div>

      <div className="text-[0.7rem] text-slate-400 text-center mb-3">
        {'-'.repeat(32)}
      </div>

      {/* Detail Tagihan */}
      <div className="px-2 space-y-2 text-[0.8rem] mb-3">
        <div>
          <span className="uppercase text-[0.7rem] text-slate-400 block mb-0.5">Judul Tagihan</span>
          <div className="text-[0.85rem] text-slate-900 font-bold">{pembayaran.tagihan?.judul || '—'}</div>
        </div>
        <div>
          <span className="uppercase text-[0.7rem] text-slate-400 block mb-0.5">Informasi Akademik</span>
          <div className="text-[0.8rem] text-slate-700 font-medium">
            {pembayaran.kelas_tagihan
              ? `Kelas ${pembayaran.kelas_tagihan.tingkat} ${pembayaran.kelas_tagihan.nama_sub_kelas}`
              : 'Kelas belum tersedia'}
          </div>
          <div className="text-[0.8rem] text-slate-700 font-medium">
            {pembayaran.tahun_ajaran_tagihan?.nama || 'Tahun ajaran belum tersedia'}
          </div>
        </div>
      </div>

      <div className="text-[0.7rem] text-slate-400 text-center mb-3">
        {'='.repeat(32)}
      </div>

      {/* Rincian Pembayaran */}
      <div className="px-2 space-y-2 mb-3">
        {rincian.length > 0 ? (
          rincian.map((item, index) => (
            <div key={item.id} className="border-b border-dashed border-slate-300 pb-1.5 last:border-b-0">
              <div className="flex justify-between">
                <span className="text-slate-700 font-medium">{String(index + 1).padStart(2, '0')}. {item.metode_pembayaran || 'Pembayaran'}</span>
                <span className="font-bold text-slate-900">{formatCurrency(item.jumlah_dibayar)}</span>
              </div>
              <div className="flex justify-between text-[0.7rem] text-slate-500">
                <span>{item.nomor_transaksi || '—'}</span>
                <span>{formatDateTime(item.tanggal_bayar)}</span>
              </div>
              <div className="flex justify-between text-[0.7rem] text-slate-500">
                <span>Cicilan</span>
                <span>{item.cicilan_ke ? `Ke-${item.cicilan_ke}` : '—'}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-[0.7rem] text-slate-500 py-3">
            Belum ada rincian pembayaran yang tercatat.
          </div>
        )}
      </div>

      <div className="text-[0.7rem] text-slate-400 text-center mb-2">
        {'='.repeat(32)}
      </div>

      {/* Total Pembayaran */}
      <div className="px-2 text-[0.9rem] mb-3 bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-300 p-2">
        <div className="flex justify-between items-center">
          <span className="uppercase text-[0.75rem] tracking-[0.2em] text-slate-600 font-bold">Total</span>
          <span className="text-lg font-black text-slate-900">{formatCurrency(totalDibayar)}</span>
        </div>
      </div>

      {/* Catatan (jika ada) */}
      {pembayaran.catatan && (
        <>
          <div className="text-[0.7rem] text-slate-400 text-center mb-2">
            {'-'.repeat(32)}
          </div>
          <div className="px-2 mb-3">
            <div className="uppercase text-[0.65rem] text-slate-400 mb-0.5">Catatan</div>
            <div className="text-[0.8rem] text-slate-700 font-medium">{pembayaran.catatan}</div>
          </div>
        </>
      )}

      <div className="text-[0.7rem] text-slate-400 text-center mb-2">
        {'-'.repeat(32)}
      </div>

      {/* Footer Info */}
      <div className="px-2 text-[0.65rem] text-slate-500 space-y-0.5 mb-3">
        <div className="flex justify-between">
          <span>REF</span>
          <span className="font-mono">{pembayaran.id}</span>
        </div>
        <div className="flex justify-between">
          <span>Diperbarui</span>
          <span>{formatDateTime(pembayaran.diperbarui_pada)}</span>
        </div>
      </div>

      <div className="text-center text-[0.7rem] text-slate-600 font-medium">
        *** Terima kasih atas pembayaran Anda ***
      </div>
    </div>
  )
}

// Main Panel Component
export function DetailPanel({ selectedItem, isLoading = false, isRefreshing = false }) {
  if (isLoading) {
    return <PembayaranDetailSkeleton />
  }

  if (!selectedItem) {
    return <PembayaranDetailEmpty />
  }

  return (
    <div className="relative flex h-full flex-col border border-slate-300 bg-white shadow-lg">
      {/* Header - Excel style */}
      <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <Wallet className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Pembayaran
          </Text>
        </div>
      </div>

      {/* Refresh indicator */}
      {isRefreshing && (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent animate-pulse z-10" />
      )}

      {/* Content */}
      <div className="flex-1 overflow-auto p-4 excel-scrollbar">
        <PembayaranDetailInfo pembayaran={selectedItem} />
      </div>

      {/* Excel-style scrollbar - Consistent with project */}
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
