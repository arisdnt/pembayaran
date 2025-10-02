import { Text, Separator } from '@radix-ui/themes'
import { Calendar, Clock } from 'lucide-react'
import { formatDate, formatDateTime, calculateDuration } from '../utils/dateHelpers'

export function TahunAjaranDetailBody({ tahunAjaran }) {
  return (
    <div className="space-y-6">
      <Separator className="bg-slate-200" size="4" />

      <div className="grid gap-6 md:grid-cols-2 md:gap-x-10">
        <div className="space-y-1">
          <Text size="1" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Nama Periode
          </Text>
          <Text size="4" weight="bold" className="text-slate-900">
            {tahunAjaran.nama}
          </Text>
        </div>
        <div className="space-y-1">
          <Text size="1" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            ID Periode
          </Text>
          <Text size="2" className="font-mono text-slate-800">
            {tahunAjaran.id}
          </Text>
        </div>
        <div className="space-y-1">
          <Text size="1" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            Durasi Periode
          </Text>
          <Text size="2" className="text-slate-800">
            {calculateDuration(tahunAjaran.tanggal_mulai, tahunAjaran.tanggal_selesai)}
          </Text>
        </div>
        <div className="grid gap-4 md:col-span-1">
          <div className="space-y-1">
            <Text size="1" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tanggal Mulai
            </Text>
            <div className="flex items-center gap-2 text-slate-800">
              <Calendar className="h-4 w-4 text-slate-400" />
              <Text size="2">{formatDate(tahunAjaran.tanggal_mulai)}</Text>
            </div>
          </div>
          <div className="space-y-1">
            <Text size="1" className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Tanggal Selesai
            </Text>
            <div className="flex items-center gap-2 text-slate-800">
              <Calendar className="h-4 w-4 text-slate-400" />
              <Text size="2">{formatDate(tahunAjaran.tanggal_selesai)}</Text>
            </div>
          </div>
        </div>
      </div>

      <Separator className="bg-slate-200" size="4" />

      <div className="space-y-4">
        <Text size="1" className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
          Informasi Sistem
        </Text>
        <div className="grid gap-4 text-slate-800 sm:grid-cols-2">
          <div className="flex items-start gap-3">
            <Clock className="mt-1 h-4 w-4 text-slate-400" />
            <div className="space-y-1">
              <Text size="1" className="uppercase tracking-wider text-slate-500">
                Dibuat Pada
              </Text>
              <Text size="2">{formatDateTime(tahunAjaran.dibuat_pada)}</Text>
            </div>
          </div>
          {tahunAjaran.diperbarui_pada && (
            <div className="flex items-start gap-3">
              <Clock className="mt-1 h-4 w-4 text-slate-400" />
              <div className="space-y-1">
                <Text size="1" className="uppercase tracking-wider text-slate-500">
                  Terakhir Diperbarui
                </Text>
                <Text size="2">{formatDateTime(tahunAjaran.diperbarui_pada)}</Text>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
