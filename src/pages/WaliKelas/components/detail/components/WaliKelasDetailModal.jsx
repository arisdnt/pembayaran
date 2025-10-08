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
          maxWidth: '600px',
          width: '95vw',
          maxHeight: '85vh',
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
        <div className="overflow-auto bg-white p-6" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          {/* Nama Lengkap & Status */}
          <div className="bg-slate-50 border-2 border-slate-300 p-4 mb-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-1.5 block font-medium">
                  Nama Lengkap
                </Text>
                <Text size="6" weight="bold" className="text-slate-900 leading-tight">
                  {waliKelas.nama_lengkap}
                </Text>
              </div>
              <Badge
                variant="solid"
                color={waliKelas.status_aktif ? 'green' : 'gray'}
                size="3"
                style={{ borderRadius: 0 }}
                className="font-semibold"
              >
                {waliKelas.status_aktif ? '✓ Aktif' : '○ Nonaktif'}
              </Badge>
            </div>
          </div>

          {/* Detail Information - 2 columns */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* NIP */}
            <FieldItem label="NIP" icon={Key}>
              <Text size="3" weight="bold" className="text-slate-900">
                {waliKelas.nip || '—'}
              </Text>
            </FieldItem>

            {/* Nomor Telepon */}
            <FieldItem label="Nomor Telepon" icon={Phone}>
              <Text size="3" weight="bold" className="text-slate-900">
                {waliKelas.nomor_telepon || '—'}
              </Text>
            </FieldItem>

            {/* Email */}
            <FieldItem label="Email" icon={Mail} fullWidth>
              <Text size="3" weight="bold" className="text-slate-900">
                {waliKelas.email || '—'}
              </Text>
            </FieldItem>

            {/* ID */}
            <FieldItem label="ID Wali Kelas" icon={Hash} fullWidth>
              <Text size="2" className="font-mono text-slate-700">
                {waliKelas.id?.slice(0, 16) || '—'}
              </Text>
            </FieldItem>
          </div>

          {/* Metadata - 2 columns */}
          <div className="grid grid-cols-2 gap-6">
            {/* Dibuat Pada */}
            <FieldItem label="Dibuat Pada" icon={Clock}>
              <Text size="2" className="text-slate-900">
                {formatDateTime(waliKelas.dibuat_pada)}
              </Text>
            </FieldItem>

            {/* Diperbarui Pada */}
            {waliKelas.diperbarui_pada && (
              <FieldItem label="Diperbarui Pada" icon={Clock}>
                <Text size="2" className="text-slate-900">
                  {formatDateTime(waliKelas.diperbarui_pada)}
                </Text>
              </FieldItem>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold transition-colors shadow-sm hover:shadow border border-slate-400"
            style={{ borderRadius: 0 }}
          >
            <span className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Tutup
            </span>
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
