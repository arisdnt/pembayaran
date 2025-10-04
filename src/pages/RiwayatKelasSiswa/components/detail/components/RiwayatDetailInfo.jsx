import { Text, Badge } from '@radix-ui/themes'
import { Calendar, BookOpen, School } from 'lucide-react'

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
  const FieldItem = ({ label, icon: Icon, children, fullWidth = false }) => (
    <div className={`${fullWidth ? 'col-span-2' : ''}`}>
      <div className="border-b border-slate-200 pb-3">
        <div className="flex items-center gap-1.5 mb-2">
          {Icon && <Icon className="h-3.5 w-3.5 text-slate-400" />}
          <Text size="1" weight="medium" className="text-slate-500 uppercase tracking-wider text-[0.65rem]">
            {label}
          </Text>
        </div>
        <div className="ml-5">
          {children}
        </div>
      </div>
    </div>
  )

  return (
    <div>
      {/* Nama Siswa & Status */}
      <div className="bg-slate-50 border-2 border-slate-300 p-4 mb-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-1.5 block font-medium">
              Nama Siswa
            </Text>
            <Text size="6" weight="bold" className="text-slate-900 leading-tight">
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
            size="3"
            style={{ borderRadius: 0 }}
            className="font-semibold"
          >
            {getStatusLabel(riwayat.status)}
          </Badge>
        </div>
      </div>

      {/* Detail Information - 2 columns */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Kelas */}
        <FieldItem label="Kelas" icon={School}>
          <Text size="3" weight="bold" className="text-slate-900">
            {riwayat.kelas ? `${riwayat.kelas.tingkat} ${riwayat.kelas.nama_sub_kelas}` : '—'}
          </Text>
        </FieldItem>

        {/* Tahun Ajaran */}
        <FieldItem label="Tahun Ajaran" icon={Calendar}>
          <Text size="3" weight="bold" className="text-slate-900">
            {riwayat.tahun_ajaran?.nama || '—'}
          </Text>
        </FieldItem>

        {/* Catatan */}
        {riwayat.catatan && (
          <FieldItem label="Catatan" icon={BookOpen} fullWidth>
            <Text size="2" className="text-slate-700 leading-relaxed">
              {riwayat.catatan}
            </Text>
          </FieldItem>
        )}
      </div>
    </div>
  )
}
