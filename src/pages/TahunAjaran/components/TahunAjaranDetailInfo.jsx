import { Text, Badge } from '@radix-ui/themes'
import { Clock, Calendar, Hash } from 'lucide-react'

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

function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate) return '—'
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const months = Math.floor(diffDays / 30)
  const days = diffDays % 30

  if (months > 0) {
    return `${months} bulan ${days} hari`
  }
  return `${days} hari`
}

export function TahunAjaranDetailInfo({ tahunAjaran }) {
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
              Nama Periode
            </Text>
            <Text size="3" weight="bold" className="text-slate-900 leading-tight">
              {tahunAjaran.nama}
            </Text>
          </div>
          <Badge
            variant="solid"
            color={tahunAjaran.status_aktif ? 'green' : 'gray'}
            size="1"
            style={{ borderRadius: 0 }}
            className="text-[0.65rem] font-semibold px-2 py-0.5 shrink-0"
          >
            {tahunAjaran.status_aktif ? '✓ Aktif' : '○ Nonaktif'}
          </Badge>
        </div>
      </div>

      {/* ID */}
      <FieldItem label="ID Periode" icon={Hash}>
        <Text size="1" className="text-slate-700 font-mono bg-slate-50 px-2 py-1 border border-slate-200 block text-[0.7rem]">
          {tahunAjaran.id}
        </Text>
      </FieldItem>

      {/* Tanggal Mulai */}
      {tahunAjaran.tanggal_mulai && (
        <FieldItem label="Tanggal Mulai" icon={Calendar}>
          <Text size="2" weight="medium" className="text-slate-900">
            {formatDate(tahunAjaran.tanggal_mulai)}
          </Text>
        </FieldItem>
      )}

      {/* Tanggal Selesai */}
      {tahunAjaran.tanggal_selesai && (
        <FieldItem label="Tanggal Selesai" icon={Calendar}>
          <Text size="2" weight="medium" className="text-slate-900">
            {formatDate(tahunAjaran.tanggal_selesai)}
          </Text>
        </FieldItem>
      )}

      {/* Durasi */}
      {tahunAjaran.tanggal_mulai && tahunAjaran.tanggal_selesai && (
        <FieldItem label="Durasi Periode" icon={Calendar}>
          <div className="space-y-0.5">
            <Text size="2" weight="medium" className="text-slate-900">
              {calculateDuration(tahunAjaran.tanggal_mulai, tahunAjaran.tanggal_selesai)}
            </Text>
            <Text size="1" className="text-slate-500 block">
              Dari mulai hingga selesai
            </Text>
          </div>
        </FieldItem>
      )}

      {/* Metadata Section */}
      <div className="pt-3 mt-3 border-t-2 border-slate-300 space-y-3">
        <FieldItem label="Dibuat Pada" icon={Clock} className="border-b-0 pb-2">
          <Text size="1" className="text-slate-600 font-sans">
            {formatDateTime(tahunAjaran.dibuat_pada)}
          </Text>
        </FieldItem>

        {tahunAjaran.diperbarui_pada && (
          <FieldItem label="Diperbarui" icon={Clock} className="border-b-0 pb-0">
            <Text size="1" className="text-slate-600 font-sans">
              {formatDateTime(tahunAjaran.diperbarui_pada)}
            </Text>
          </FieldItem>
        )}
      </div>
    </div>
  )
}
