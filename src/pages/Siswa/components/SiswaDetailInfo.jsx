import { Text, Badge } from '@radix-ui/themes'
import { Clock, Calendar, User, MapPin, Phone, Key, Hash } from 'lucide-react'
import { formatDateTime, formatDate, hitungUsia } from '../utils/dateHelpers'

export function SiswaDetailInfo({ siswa }) {
  const usia = hitungUsia(siswa.tanggal_lahir)

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
              {siswa.nama_lengkap}
            </Text>
          </div>
          <Badge
            variant="solid"
            color={siswa.status_aktif ? 'green' : 'gray'}
            size="1"
            style={{ borderRadius: 0 }}
            className="text-[0.65rem] font-semibold px-2 py-0.5 shrink-0"
          >
            {siswa.status_aktif ? '✓ Aktif' : '○ Nonaktif'}
          </Badge>
        </div>
      </div>

      {/* ID */}
      <FieldItem label="ID Siswa" icon={Hash}>
        <Text size="1" className="text-slate-700 font-mono bg-slate-50 px-2 py-1 border border-slate-200 block text-[0.7rem]">
          {siswa.id}
        </Text>
      </FieldItem>

      {/* NISN */}
      {siswa.nisn && (
        <FieldItem label="NISN" icon={Hash}>
          <Text size="2" weight="medium" className="text-slate-900 font-mono">
            {siswa.nisn}
          </Text>
        </FieldItem>
      )}

      {/* Tanggal Lahir */}
      {siswa.tanggal_lahir && (
        <FieldItem label="Tanggal Lahir" icon={Calendar}>
          <div className="space-y-0.5">
            <Text size="2" weight="medium" className="text-slate-900">
              {formatDate(siswa.tanggal_lahir)}
            </Text>
            {usia !== null && (
              <Text size="1" className="text-slate-500 block">
                ({usia} tahun)
              </Text>
            )}
          </div>
        </FieldItem>
      )}

      {/* Jenis Kelamin */}
      {siswa.jenis_kelamin && (
        <FieldItem label="Jenis Kelamin" icon={User}>
          <Badge 
            variant="soft" 
            color="blue" 
            size="1" 
            style={{ borderRadius: 0 }}
            className="text-[0.7rem]"
          >
            {siswa.jenis_kelamin}
          </Badge>
        </FieldItem>
      )}

      {/* Alamat */}
      {siswa.alamat && (
        <FieldItem label="Alamat" icon={MapPin}>
          <Text size="2" className="text-slate-700 leading-snug">
            {siswa.alamat}
          </Text>
        </FieldItem>
      )}

      {/* WhatsApp Wali */}
      {siswa.nomor_whatsapp_wali && (
        <FieldItem label="WhatsApp Wali" icon={Phone}>
          <div className="space-y-0.5">
            <Text size="2" weight="medium" className="text-slate-900 font-mono">
              {siswa.nomor_whatsapp_wali}
            </Text>
            <Text size="1" className="text-slate-500 block">
              Untuk notifikasi tagihan
            </Text>
          </div>
        </FieldItem>
      )}

      {/* Token Akses */}
      <FieldItem label="Token Akses" icon={Key}>
        <div className="space-y-0.5">
          <Text size="1" className="text-slate-700 font-mono bg-slate-50 px-2 py-1 border border-slate-200 block break-all text-[0.7rem]">
            {siswa.token_akses_unik}
          </Text>
          <Text size="1" className="text-slate-500 block">
            Token unik untuk akses data tagihan
          </Text>
        </div>
      </FieldItem>

      {/* Metadata Section */}
      <div className="pt-3 mt-3 border-t-2 border-slate-300 space-y-3">
        <FieldItem label="Dibuat Pada" icon={Clock} className="border-b-0 pb-2">
          <Text size="1" className="text-slate-600 font-sans">
            {formatDateTime(siswa.dibuat_pada)}
          </Text>
        </FieldItem>

        {siswa.diperbarui_pada && (
          <FieldItem label="Diperbarui" icon={Clock} className="border-b-0 pb-0">
            <Text size="1" className="text-slate-600 font-sans">
              {formatDateTime(siswa.diperbarui_pada)}
            </Text>
          </FieldItem>
        )}
      </div>
    </div>
  )
}
