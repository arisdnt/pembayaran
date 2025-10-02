import { Text, Badge } from '@radix-ui/themes'
import { Clock, Phone, Mail, User, Key, Hash, UserCheck } from 'lucide-react'

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

export function WaliKelasDetailInfo({ waliKelas }) {
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
      {/* Nama & Status */}
      <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 p-3 mb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-1 block">
              Nama Lengkap
            </Text>
            <Text size="3" weight="bold" className="text-slate-900 leading-tight">
              {waliKelas.nama_lengkap}
            </Text>
          </div>
          <Badge
            variant="solid"
            color={waliKelas.status_aktif ? 'green' : 'gray'}
            size="1"
            style={{ borderRadius: 0 }}
            className="text-[0.65rem] font-semibold px-2 py-0.5 shrink-0"
          >
            {waliKelas.status_aktif ? '✓ Aktif' : '○ Nonaktif'}
          </Badge>
        </div>
      </div>

      {/* ID */}
      <FieldItem label="ID Wali Kelas" icon={Hash}>
        <Text size="1" className="text-slate-700 font-mono bg-slate-50 px-2 py-1 border border-slate-200 block text-[0.7rem]">
          {waliKelas.id}
        </Text>
      </FieldItem>

      {/* NIP */}
      {waliKelas.nip && (
        <FieldItem label="NIP" icon={Key}>
          <Text size="2" weight="medium" className="text-slate-900 font-mono">
            {waliKelas.nip}
          </Text>
        </FieldItem>
      )}

      {/* Nomor Telepon */}
      {waliKelas.nomor_telepon && (
        <FieldItem label="Nomor Telepon" icon={Phone}>
          <div className="space-y-0.5">
            <Text size="2" weight="medium" className="text-slate-900 font-mono">
              {waliKelas.nomor_telepon}
            </Text>
            <Text size="1" className="text-slate-500 block">
              Nomor kontak utama
            </Text>
          </div>
        </FieldItem>
      )}

      {/* Email */}
      {waliKelas.email && (
        <FieldItem label="Email" icon={Mail}>
          <div className="space-y-0.5">
            <Text size="2" weight="medium" className="text-slate-900">
              {waliKelas.email}
            </Text>
            <Text size="1" className="text-slate-500 block">
              Email untuk komunikasi resmi
            </Text>
          </div>
        </FieldItem>
      )}

      {/* Status Kepegawaian */}
      <FieldItem label="Status Kepegawaian" icon={UserCheck}>
        <Badge 
          variant="soft" 
          color={waliKelas.status_aktif ? 'green' : 'gray'}
          size="1" 
          style={{ borderRadius: 0 }}
          className="text-[0.7rem]"
        >
          {waliKelas.status_aktif ? 'Aktif Mengajar' : 'Tidak Aktif'}
        </Badge>
      </FieldItem>

      {/* Metadata Section */}
      <div className="pt-3 mt-3 border-t-2 border-slate-300 space-y-3">
        <FieldItem label="Dibuat Pada" icon={Clock} className="border-b-0 pb-2">
          <Text size="1" className="text-slate-600 font-sans">
            {formatDateTime(waliKelas.dibuat_pada)}
          </Text>
        </FieldItem>

        {waliKelas.diperbarui_pada && (
          <FieldItem label="Diperbarui" icon={Clock} className="border-b-0 pb-0">
            <Text size="1" className="text-slate-600 font-sans">
              {formatDateTime(waliKelas.diperbarui_pada)}
            </Text>
          </FieldItem>
        )}
      </div>
    </div>
  )
}
