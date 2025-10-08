import { Text, Badge } from '@radix-ui/themes'
import { Clock, Calendar, Hash, BookOpen, Power, PowerOff } from 'lucide-react'

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
    month: 'long',
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
  return (
    <div className="space-y-3">
      {/* Nama & Status */}
      <div className="p-3 bg-slate-50 border border-slate-300">
        <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider mb-2 block">
          Informasi Utama
        </Text>
        <Text size="3" weight="bold" className="text-slate-900 mb-2 block">
          {tahunAjaran.nama}
        </Text>
        <div className="flex items-center gap-2">
          {tahunAjaran.status_aktif ? (
            <Badge color="green" variant="solid" style={{ borderRadius: 0 }}>
              <Power className="h-3 w-3 mr-1" />
              Aktif
            </Badge>
          ) : (
            <Badge color="red" variant="solid" style={{ borderRadius: 0 }}>
              <PowerOff className="h-3 w-3 mr-1" />
              Non-Aktif
            </Badge>
          )}
        </div>
      </div>

      {/* Tanggal Mulai */}
      {tahunAjaran.tanggal_mulai && (
        <div className="p-3 bg-white border border-slate-300">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-green-500" />
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
              Tanggal Mulai
            </Text>
          </div>
          <Text size="2" className="text-slate-900 font-semibold">
            {formatDate(tahunAjaran.tanggal_mulai)}
          </Text>
        </div>
      )}

      {/* Tanggal Selesai */}
      {tahunAjaran.tanggal_selesai && (
        <div className="p-3 bg-white border border-slate-300">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-red-500" />
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
              Tanggal Selesai
            </Text>
          </div>
          <Text size="2" className="text-slate-900 font-semibold">
            {formatDate(tahunAjaran.tanggal_selesai)}
          </Text>
        </div>
      )}

      {/* Durasi */}
      {tahunAjaran.tanggal_mulai && tahunAjaran.tanggal_selesai && (
        <div className="p-3 bg-white border border-slate-300">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-blue-500" />
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
              Durasi Periode
            </Text>
          </div>
          <Text size="2" weight="bold" className="text-slate-900">
            {calculateDuration(tahunAjaran.tanggal_mulai, tahunAjaran.tanggal_selesai)}
          </Text>
          <Text size="1" className="text-slate-500 block mt-1">
            Dari mulai hingga selesai
          </Text>
        </div>
      )}

      {/* ID */}
      <div className="p-3 bg-slate-50 border border-slate-300">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            ID
          </Text>
        </div>
        <Text size="1" className="text-slate-500 font-mono break-all">
          {tahunAjaran.id}
        </Text>
      </div>
    </div>
  )
}
