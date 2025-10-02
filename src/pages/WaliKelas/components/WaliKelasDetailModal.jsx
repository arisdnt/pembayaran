import { Dialog } from '@radix-ui/themes'
import { Text, Badge } from '@radix-ui/themes'
import { X, UserCheck, Clock, Phone, Mail, Hash, Key } from 'lucide-react'

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

export function WaliKelasDetailModal({ open, onOpenChange, waliKelas }) {
  if (!waliKelas) return null

  // Icon color mapping
  const iconColors = {
    Hash: 'text-blue-500',
    UserCheck: 'text-indigo-500',
    Key: 'text-purple-500',
    Phone: 'text-green-500',
    Mail: 'text-amber-500',
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
            <div className="flex h-10 w-10 items-center justify-center bg-indigo-600 border border-indigo-700 shadow-sm">
              <UserCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                Detail Wali Kelas
              </Text>
              <Text size="1" className="text-slate-600">
                Informasi lengkap data wali kelas
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
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 160px)' }}>
          <div className="p-6 space-y-5">
            {/* Nama Lengkap - Full Width Header */}
            <div className="bg-slate-50 border-2 border-slate-300 p-4 shadow-sm">
              <Text size="1" className="text-slate-500 uppercase tracking-wider font-medium mb-1 block">
                Nama Lengkap
              </Text>
              <Text size="6" weight="bold" className="text-slate-900">
                {waliKelas.nama_lengkap}
              </Text>
            </div>

            {/* Detail Information - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <FieldItem label="ID Wali Kelas" icon={Hash}>
                <Text size="2" className="font-mono text-slate-700 font-medium">
                  {waliKelas.id}
                </Text>
              </FieldItem>

              <FieldItem label="NIP" icon={Key}>
                <Text size="2" className="font-mono text-slate-700 font-medium">
                  {waliKelas.nip || '—'}
                </Text>
              </FieldItem>

              <FieldItem label="Nomor Telepon" icon={Phone}>
                <Text size="2" className="text-slate-700">
                  {waliKelas.nomor_telepon || '—'}
                </Text>
              </FieldItem>

              <FieldItem label="Email" icon={Mail}>
                <Text size="2" className="text-slate-700">
                  {waliKelas.email || '—'}
                </Text>
              </FieldItem>

              <FieldItem label="Status" icon={UserCheck}>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="soft"
                    color={waliKelas.status_aktif ? 'green' : 'gray'}
                    className="text-xs px-3 py-1"
                  >
                    {waliKelas.status_aktif ? 'Aktif' : 'Nonaktif'}
                  </Badge>
                  {waliKelas.status_aktif && (
                    <Text size="1" className="text-green-600">
                      Sedang aktif mengajar
                    </Text>
                  )}
                </div>
              </FieldItem>
            </div>

            {/* Metadata Section - 2 Column Grid */}
            <div className="border-t-2 border-slate-200 pt-5 mt-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <FieldItem label="Dibuat Pada" icon={Clock}>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <Text size="1" className="text-slate-600 font-mono">
                      {formatDateTime(waliKelas.dibuat_pada)}
                    </Text>
                  </div>
                </FieldItem>

                {waliKelas.diperbarui_pada && (
                  <FieldItem label="Diperbarui Pada" icon={Clock}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <Text size="1" className="text-slate-600 font-mono">
                        {formatDateTime(waliKelas.diperbarui_pada)}
                      </Text>
                    </div>
                  </FieldItem>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer - Excel style */}
        <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4 flex items-center justify-between">
          <Text size="1" className="text-slate-500">
            Data wali kelas • Sistem Kas Sekolah
          </Text>
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors shadow-sm border border-blue-700 flex items-center gap-2"
          >
            <X className="h-3.5 w-3.5" />
            Tutup
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
