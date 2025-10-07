import { Dialog, Text, Badge } from '@radix-ui/themes'
import { X, Calendar, Clock, Users, Hash } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

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

export function TahunAjaranDetailModal({ open, onOpenChange, item }) {
  if (!item) return null

  // Icon color mapping
  const iconColors = {
    Hash: 'text-blue-500',
    Calendar: 'text-indigo-500',
    Users: 'text-green-500',
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
          width: '800px',
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
            <div className="flex h-10 w-10 items-center justify-center bg-blue-600 border border-blue-700 shadow-sm">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                Detail Tahun Ajaran
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
        <div className="overflow-auto p-6 bg-white" style={{ maxHeight: 'calc(85vh - 80px)' }}>
          {/* Nama Tahun Ajaran Section */}
          <div className="bg-slate-50 border-2 border-slate-300 p-4 mb-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-1.5 block font-medium">
                  Periode Akademik
                </Text>
                <Text size="6" weight="bold" className="text-slate-900 leading-tight">
                  {item.nama}
                </Text>
              </div>
              <Badge
                variant="solid"
                color={item.status_aktif ? 'green' : 'gray'}
                size="3"
                style={{ borderRadius: 0 }}
                className="font-semibold"
              >
                {item.status_aktif ? '✓ Aktif' : '○ Nonaktif'}
              </Badge>
            </div>
          </div>

          {/* Detail Information - 2 columns */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Tanggal Mulai */}
            <FieldItem label="Tanggal Mulai" icon={Calendar}>
              <Text size="3" weight="bold" className="text-slate-900">
                {formatDate(item.tanggal_mulai)}
              </Text>
            </FieldItem>

            {/* Tanggal Selesai */}
            <FieldItem label="Tanggal Selesai" icon={Calendar}>
              <Text size="3" weight="bold" className="text-slate-900">
                {formatDate(item.tanggal_selesai)}
              </Text>
            </FieldItem>

            {/* Total Siswa */}
            <FieldItem label="Total Siswa" icon={Users}>
              <Text size="3" weight="bold" className="text-slate-900">
                {item.total_siswa || 0} siswa
              </Text>
            </FieldItem>

            {/* ID */}
            <FieldItem label="ID Tahun Ajaran" icon={Hash}>
              <Text size="2" className="font-mono text-slate-700">
                {item.id?.slice(0, 16) || '—'}
              </Text>
            </FieldItem>
          </div>

          {/* Metadata - 2 columns */}
          <div className="grid grid-cols-2 gap-6">
            {/* Dibuat Pada */}
            <FieldItem label="Dibuat Pada" icon={Clock}>
              <Text size="2" className="text-slate-900">
                {formatDateTime(item.dibuat_pada)}
              </Text>
            </FieldItem>

            {/* Diperbarui Pada */}
            {item.diperbarui_pada && (
              <FieldItem label="Diperbarui Pada" icon={Clock}>
                <Text size="2" className="text-slate-900">
                  {formatDateTime(item.diperbarui_pada)}
                </Text>
              </FieldItem>
            )}
          </div>
        </div>

        {/* Footer - Excel style */}
        <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <div className="flex items-center justify-between">
            <Text size="1" className="text-slate-600 font-medium">
              Data tahun ajaran • Sistem Kas Sekolah
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
