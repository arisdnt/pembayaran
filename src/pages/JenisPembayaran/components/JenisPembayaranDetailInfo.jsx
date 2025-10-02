import { Text, Badge } from '@radix-ui/themes'
import { Clock, DollarSign, FileText, Hash, Tag, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
import { formatCurrency } from '../utils/currencyFormatter'
import { getTipeBadgeColor } from '../utils/badgeHelper'

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

export function JenisPembayaranDetailInfo({ jenisPembayaran }) {
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
              Nama Jenis Pembayaran
            </Text>
            <Text size="3" weight="bold" className="text-slate-900 leading-tight">
              {jenisPembayaran.nama}
            </Text>
          </div>
          <Badge
            variant="solid"
            color={jenisPembayaran.status_aktif ? 'green' : 'gray'}
            size="1"
            style={{ borderRadius: 0 }}
            className="text-[0.65rem] font-semibold px-2 py-0.5 shrink-0"
          >
            {jenisPembayaran.status_aktif ? '✓ Aktif' : '○ Nonaktif'}
          </Badge>
        </div>
      </div>

      {/* ID */}
      <FieldItem label="ID Jenis Pembayaran" icon={Hash}>
        <Text size="1" className="text-slate-700 font-mono bg-slate-50 px-2 py-1 border border-slate-200 block text-[0.7rem]">
          {jenisPembayaran.id}
        </Text>
      </FieldItem>

      {/* Kode */}
      <FieldItem label="Kode" icon={Hash}>
        <Text size="2" weight="medium" className="text-slate-900 font-mono uppercase">
          {jenisPembayaran.kode}
        </Text>
      </FieldItem>

      {/* Deskripsi */}
      {jenisPembayaran.deskripsi && (
        <FieldItem label="Deskripsi" icon={FileText}>
          <Text size="2" className="text-slate-700 leading-snug">
            {jenisPembayaran.deskripsi}
          </Text>
        </FieldItem>
      )}

      {/* Jumlah Default */}
      <FieldItem label="Jumlah Default" icon={DollarSign}>
        <div className="space-y-0.5">
          <Text size="2" weight="medium" className="text-slate-900 font-mono">
            {formatCurrency(jenisPembayaran.jumlah_default)}
          </Text>
          <Text size="1" className="text-slate-500 block">
            Nominal pembayaran default
          </Text>
        </div>
      </FieldItem>

      {/* Tipe Pembayaran */}
      {jenisPembayaran.tipe_pembayaran && (
        <FieldItem label="Tipe Pembayaran" icon={Calendar}>
          <Badge 
            variant="soft" 
            color={getTipeBadgeColor(jenisPembayaran.tipe_pembayaran)}
            size="1" 
            style={{ borderRadius: 0 }}
            className="text-[0.7rem] capitalize"
          >
            {jenisPembayaran.tipe_pembayaran}
          </Badge>
        </FieldItem>
      )}

      {/* Tahun Ajaran */}
      {jenisPembayaran.tahun_ajaran && (
        <FieldItem label="Tahun Ajaran" icon={Calendar}>
          <Text size="2" weight="medium" className="text-slate-900">
            {jenisPembayaran.tahun_ajaran.nama}
          </Text>
        </FieldItem>
      )}

      {/* Kelas */}
      {jenisPembayaran.kelas && (
        <FieldItem label="Kelas" icon={Tag}>
          <Text size="2" weight="medium" className="text-slate-900">
            Kelas {jenisPembayaran.kelas.tingkat} {jenisPembayaran.kelas.nama_sub_kelas}
          </Text>
        </FieldItem>
      )}

      {/* Status Wajib */}
      <FieldItem label="Status Pembayaran" icon={jenisPembayaran.wajib ? CheckCircle : AlertCircle}>
        <div className="flex items-center gap-2">
          <Badge 
            variant="soft" 
            color={jenisPembayaran.wajib ? 'red' : 'gray'}
            size="1" 
            style={{ borderRadius: 0 }}
            className="text-[0.7rem]"
          >
            {jenisPembayaran.wajib ? 'Wajib' : 'Opsional'}
          </Badge>
          <Text size="1" className={jenisPembayaran.wajib ? 'text-red-600' : 'text-slate-500'}>
            {jenisPembayaran.wajib ? 'Harus dibayar' : 'Tidak wajib'}
          </Text>
        </div>
      </FieldItem>

      {/* Metadata Section */}
      <div className="pt-3 mt-3 border-t-2 border-slate-300 space-y-3">
        <FieldItem label="Dibuat Pada" icon={Clock} className="border-b-0 pb-2">
          <Text size="1" className="text-slate-600 font-sans">
            {formatDateTime(jenisPembayaran.dibuat_pada)}
          </Text>
        </FieldItem>

        {jenisPembayaran.diperbarui_pada && (
          <FieldItem label="Diperbarui" icon={Clock} className="border-b-0 pb-0">
            <Text size="1" className="text-slate-600 font-sans">
              {formatDateTime(jenisPembayaran.diperbarui_pada)}
            </Text>
          </FieldItem>
        )}
      </div>
    </div>
  )
}
