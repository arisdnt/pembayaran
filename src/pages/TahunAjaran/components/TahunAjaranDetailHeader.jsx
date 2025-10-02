import { Text, Badge } from '@radix-ui/themes'
import { CheckCircle, XCircle } from 'lucide-react'

export function TahunAjaranDetailHeader({ tahunAjaran }) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })

  const StatusIcon = tahunAjaran.status_aktif ? CheckCircle : XCircle
  const statusVariant = tahunAjaran.status_aktif ? 'green' : 'red'
  const statusLabel = tahunAjaran.status_aktif ? 'Aktif' : 'Nonaktif'

  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
      <div className="space-y-3">
        <Text size="1" className="font-semibold uppercase tracking-[0.25em] text-slate-500">
          Sekolah Digital · Laporan Akademik
        </Text>
        <div className="space-y-1">
          <Text size="5" weight="bold" className="text-slate-900 leading-tight">
            Detail Periode Akademik
          </Text>
          <Text size="2" className="text-slate-600">
            Periode {tahunAjaran.nama}
          </Text>
        </div>
        <div className="grid gap-y-1 text-sm text-slate-700 sm:grid-cols-2 sm:gap-x-10">
          <div className="space-y-1">
            <Text size="1" className="uppercase tracking-wider text-slate-500">
              Nomor Dokumen
            </Text>
            <Text size="2" className="font-mono text-slate-800">
              TA-{tahunAjaran.id}
            </Text>
          </div>
          <div className="space-y-1">
            <Text size="1" className="uppercase tracking-wider text-slate-500">
              Tanggal Cetak
            </Text>
            <Text size="2" className="text-slate-800">
              {currentDate}
            </Text>
          </div>
        </div>
      </div>
      <Badge
        color={statusVariant}
        radius="none"
        size="3"
        className="flex w-max items-center gap-2 px-5 py-2 text-xs font-semibold uppercase tracking-[0.25em]"
      >
        <StatusIcon className="h-4 w-4" />
        {statusLabel}
      </Badge>
    </div>
  )
}
