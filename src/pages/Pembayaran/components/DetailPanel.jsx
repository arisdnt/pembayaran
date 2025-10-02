import { Text } from '@radix-ui/themes'
import { Wallet, Clock, Hash, Receipt, FileText, User, ChevronRight } from 'lucide-react'

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
  const FieldItem = ({ label, icon: Icon, children, className = '' }) => (
    <div className={`border-b border-slate-200 pb-3 ${className}`}>
      <div className="flex items-center gap-1.5 mb-1.5">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
        <Text size="1" weight="medium" className="text-slate-500 uppercase tracking-wider text-[0.65rem]">
          {label}
        </Text>
      </div>
      <div className="ml-5">
        {children}
      </div>
    </div>
  )

  return (
    <div className="space-y-0">
      {/* Nomor Pembayaran & Header */}
      <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 p-3 mb-3">
        <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-1 block">
          Nomor Pembayaran
        </Text>
        <Text size="3" weight="bold" className="text-slate-900 font-mono leading-tight">
          {pembayaran.nomor_pembayaran}
        </Text>
      </div>

      {/* ID */}
      <FieldItem label="ID Pembayaran" icon={Hash}>
        <Text size="1" className="text-slate-700 font-mono bg-slate-50 px-2 py-1 border border-slate-200 block text-[0.7rem]">
          {pembayaran.id}
        </Text>
      </FieldItem>

      {/* Tagihan */}
      {pembayaran.tagihan && (
        <>
          <FieldItem label="Nomor Tagihan" icon={Receipt}>
            <Text size="2" weight="medium" className="text-slate-900 font-mono">
              {pembayaran.tagihan.nomor_tagihan}
            </Text>
          </FieldItem>

          {pembayaran.tagihan.judul && (
            <FieldItem label="Judul Tagihan" icon={Receipt}>
              <Text size="2" className="text-slate-700 leading-snug">
                {pembayaran.tagihan.judul}
              </Text>
            </FieldItem>
          )}
        </>
      )}

      {/* Siswa */}
      {pembayaran.tagihan?.riwayat_kelas_siswa?.siswa && (
        <>
          <FieldItem label="Nama Siswa" icon={User}>
            <Text size="2" weight="medium" className="text-slate-900">
              {pembayaran.tagihan.riwayat_kelas_siswa.siswa.nama_lengkap}
            </Text>
          </FieldItem>

          {pembayaran.tagihan.riwayat_kelas_siswa.siswa.nisn && (
            <FieldItem label="NISN" icon={Hash}>
              <Text size="2" className="text-slate-700 font-mono">
                {pembayaran.tagihan.riwayat_kelas_siswa.siswa.nisn}
              </Text>
            </FieldItem>
          )}
        </>
      )}

      {/* Catatan */}
      {pembayaran.catatan && (
        <FieldItem label="Catatan" icon={FileText}>
          <Text size="2" className="text-slate-700 leading-snug">
            {pembayaran.catatan}
          </Text>
        </FieldItem>
      )}

      {/* Metadata Section */}
      <div className="pt-3 mt-3 border-t-2 border-slate-300 space-y-3">
        <FieldItem label="Dibuat Pada" icon={Clock} className="border-b-0 pb-2">
          <Text size="1" className="text-slate-600 font-sans">
            {formatDateTime(pembayaran.tanggal_dibuat)}
          </Text>
        </FieldItem>

        {pembayaran.diperbarui_pada && (
          <FieldItem label="Diperbarui" icon={Clock} className="border-b-0 pb-0">
            <Text size="1" className="text-slate-600 font-sans">
              {formatDateTime(pembayaran.diperbarui_pada)}
            </Text>
          </FieldItem>
        )}
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
      <div className="flex-1 overflow-auto p-4">
        <PembayaranDetailInfo pembayaran={selectedItem} />
      </div>
    </div>
  )
}
