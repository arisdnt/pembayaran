import { Text, Badge } from '@radix-ui/themes'
import { Clock, Calendar, Hash, BookOpen, User, School } from 'lucide-react'

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

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

function getStatusBadgeColor(status) {
  switch (status) {
    case 'aktif': return 'green'
    case 'pindah_kelas': return 'blue'
    case 'lulus': return 'purple'
    case 'keluar': return 'gray'
    default: return 'gray'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'aktif': return '✓ Aktif'
    case 'pindah_kelas': return '🔄 Pindah Kelas'
    case 'lulus': return '🎓 Lulus'
    case 'keluar': return '○ Keluar'
    default: return status
  }
}

export function RiwayatDetailInfo({ riwayat }) {
  // Field item component
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
      {/* Nama Siswa & Status */}
      <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 p-3 mb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-1 block">
              Nama Siswa
            </Text>
            <Text size="3" weight="bold" className="text-slate-900 leading-tight">
              {riwayat.siswa?.nama_lengkap || '—'}
            </Text>
            {riwayat.siswa?.nisn && (
              <Text size="1" className="text-slate-500 font-mono mt-1 block">
                NISN: {riwayat.siswa.nisn}
              </Text>
            )}
          </div>
          <Badge
            variant="solid"
            color={getStatusBadgeColor(riwayat.status)}
            size="1"
            style={{ borderRadius: 0 }}
            className="text-[0.65rem] font-semibold px-2 py-0.5 shrink-0"
          >
            {getStatusLabel(riwayat.status)}
          </Badge>
        </div>
      </div>

      {/* Kelas */}
      <FieldItem label="Kelas" icon={School}>
        <Text size="2" weight="medium" className="text-slate-900">
          {riwayat.kelas ? `${riwayat.kelas.tingkat} ${riwayat.kelas.nama_sub_kelas}` : '—'}
        </Text>
      </FieldItem>

      {/* Tahun Ajaran */}
      <FieldItem label="Tahun Ajaran" icon={Calendar}>
        <Text size="2" weight="medium" className="text-slate-900">
          {riwayat.tahun_ajaran?.nama || '—'}
        </Text>
      </FieldItem>

      {/* Tanggal Masuk */}
      {riwayat.tanggal_masuk && (
        <FieldItem label="Tanggal Masuk" icon={Calendar}>
          <Text size="2" weight="medium" className="text-slate-900">
            {formatDate(riwayat.tanggal_masuk)}
          </Text>
        </FieldItem>
      )}

      {/* Tanggal Keluar */}
      {riwayat.tanggal_keluar && (
        <FieldItem label="Tanggal Keluar" icon={Calendar}>
          <Text size="2" weight="medium" className="text-slate-900">
            {formatDate(riwayat.tanggal_keluar)}
          </Text>
        </FieldItem>
      )}

      {/* Catatan */}
      {riwayat.catatan && (
        <FieldItem label="Catatan" icon={BookOpen}>
          <Text size="2" className="text-slate-700 leading-relaxed">
            {riwayat.catatan}
          </Text>
        </FieldItem>
      )}

      {/* ID */}
      <FieldItem label="ID Riwayat" icon={Hash}>
        <Text size="1" className="text-slate-700 font-mono bg-slate-50 px-2 py-1 border border-slate-200 block text-[0.7rem]">
          {riwayat.id}
        </Text>
      </FieldItem>

      {/* Metadata Section */}
      <div className="pt-3 mt-3 border-t-2 border-slate-300 space-y-3">
        <FieldItem label="Dibuat Pada" icon={Clock} className="border-b-0 pb-2">
          <Text size="1" className="text-slate-600 font-sans">
            {formatDateTime(riwayat.dibuat_pada)}
          </Text>
        </FieldItem>

        {riwayat.diperbarui_pada && (
          <FieldItem label="Diperbarui" icon={Clock} className="border-b-0 pb-0">
            <Text size="1" className="text-slate-600 font-sans">
              {formatDateTime(riwayat.diperbarui_pada)}
            </Text>
          </FieldItem>
        )}
      </div>
    </div>
  )
}
