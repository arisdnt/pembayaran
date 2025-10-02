import { Dialog } from '@radix-ui/themes'
import { Text, Badge } from '@radix-ui/themes'
import { X, User, Clock, Calendar, MapPin, Phone, Key, Hash } from 'lucide-react'
import { formatDateTime, formatDate, hitungUsia } from '../utils/dateHelpers'

export function SiswaDetailModal({ open, onOpenChange, siswa }) {
  if (!siswa) return null

  const usia = hitungUsia(siswa.tanggal_lahir)

  // Icon color mapping
  const iconColors = {
    Hash: 'text-blue-500',
    Calendar: 'text-purple-500',
    User: 'text-indigo-500',
    MapPin: 'text-red-500',
    Phone: 'text-green-500',
    Key: 'text-amber-500',
    Clock: 'text-slate-500',
  }

  // Field item component for modal
  const FieldItem = ({ label, icon: Icon, children, fullWidth = false }) => {
    const iconColor = Icon ? iconColors[Icon.name] || 'text-slate-400' : ''
    
    return (
      <div className={`${fullWidth ? 'col-span-2' : ''}`}>
        <div className="border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1.5 mb-2">
            {Icon && <Icon className={`h-3.5 w-3.5 ${iconColor}`} />}
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
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content 
        style={{ 
          maxWidth: '90vw',
          width: '1200px',
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header - Excel style */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center bg-blue-600 border border-blue-700 shadow-sm">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                Detail Siswa
              </Text>
              <Text size="1" className="text-slate-600">
                Informasi lengkap data siswa
              </Text>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-auto p-6 bg-white" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {/* Nama & Status Section */}
          <div className="bg-slate-50 border-2 border-slate-300 p-4 mb-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-1.5 block font-medium">
                  Nama Lengkap
                </Text>
                <Text size="6" weight="bold" className="text-slate-900 leading-tight">
                  {siswa.nama_lengkap}
                </Text>
              </div>
              <Badge
                variant="solid"
                color={siswa.status_aktif ? 'green' : 'gray'}
                size="2"
                className="text-sm font-semibold px-3 py-1.5 shrink-0"
                style={{ borderRadius: 0 }}
              >
                {siswa.status_aktif ? '✓ Aktif' : '○ Nonaktif'}
              </Badge>
            </div>
          </div>

          {/* Grid Layout - 2 columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* ID Siswa */}
            <FieldItem label="ID Siswa" icon={Hash}>
              <Text size="1" className="text-slate-700 font-mono bg-slate-50 px-2 py-1.5 border border-slate-200 block text-[0.7rem]">
                {siswa.id}
              </Text>
            </FieldItem>

            {/* NISN */}
            {siswa.nisn && (
              <FieldItem label="NISN" icon={Hash}>
                <Text size="3" weight="medium" className="text-slate-900 font-mono">
                  {siswa.nisn}
                </Text>
              </FieldItem>
            )}

            {/* Tanggal Lahir */}
            {siswa.tanggal_lahir && (
              <FieldItem label="Tanggal Lahir" icon={Calendar}>
                <div className="space-y-1">
                  <Text size="3" weight="medium" className="text-slate-900">
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
                  size="2" 
                  style={{ borderRadius: 0 }}
                  className="text-sm"
                >
                  {siswa.jenis_kelamin}
                </Badge>
              </FieldItem>
            )}

            {/* Alamat - Full width */}
            {siswa.alamat && (
              <FieldItem label="Alamat" icon={MapPin} fullWidth>
                <Text size="3" className="text-slate-700 leading-relaxed">
                  {siswa.alamat}
                </Text>
              </FieldItem>
            )}

            {/* WhatsApp Wali */}
            {siswa.nomor_whatsapp_wali && (
              <FieldItem label="WhatsApp Wali" icon={Phone}>
                <div className="space-y-1">
                  <Text size="3" weight="medium" className="text-slate-900 font-mono">
                    {siswa.nomor_whatsapp_wali}
                  </Text>
                  <Text size="1" className="text-slate-500 block">
                    Untuk notifikasi tagihan
                  </Text>
                </div>
              </FieldItem>
            )}

            {/* Token Akses - Full width */}
            <FieldItem label="Token Akses Unik" icon={Key} fullWidth>
              <div className="space-y-1">
                <Text size="2" className="text-slate-700 font-mono bg-slate-50 px-2 py-1.5 border border-slate-200 block break-all">
                  {siswa.token_akses_unik}
                </Text>
                <Text size="1" className="text-slate-500 block">
                  Token unik untuk akses data tagihan
                </Text>
              </div>
            </FieldItem>
          </div>

          {/* Metadata Section */}
          <div className="mt-6 pt-6 border-t-2 border-slate-300">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <FieldItem label="Dibuat Pada" icon={Clock}>
                <Text size="2" className="text-slate-600 font-sans">
                  {formatDateTime(siswa.dibuat_pada)}
                </Text>
              </FieldItem>

              {siswa.diperbarui_pada && (
                <FieldItem label="Terakhir Diperbarui" icon={Clock}>
                  <Text size="2" className="text-slate-600 font-sans">
                    {formatDateTime(siswa.diperbarui_pada)}
                  </Text>
                </FieldItem>
              )}
            </div>
          </div>
        </div>

        {/* Footer - Excel style */}
        <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <div className="flex items-center justify-between">
            <Text size="1" className="text-slate-600 font-medium">
              Data siswa • Sistem Kas Sekolah
            </Text>
            <div className="flex gap-2">
              <button
                onClick={() => onOpenChange(false)}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors shadow-sm hover:shadow border border-blue-700"
                style={{ borderRadius: 0 }}
              >
                <span className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Tutup
                </span>
              </button>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
