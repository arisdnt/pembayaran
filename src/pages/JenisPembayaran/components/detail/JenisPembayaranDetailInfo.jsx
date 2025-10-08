import { Text, Badge } from '@radix-ui/themes'
import { Clock, Calendar, DollarSign, FileText, Hash, Tag, CheckCircle, AlertCircle } from 'lucide-react'
import { formatCurrency } from '../../utils/currencyFormatter'

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
  return (
    <>
      {/* Informasi Utama */}
      <div className="p-3 bg-slate-50 border border-slate-300 mx-4">
        <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider mb-2 block">
          Nama Jenis Pembayaran
        </Text>
        <div className="flex items-start justify-between gap-2">
          <Text size="4" weight="bold" className="text-slate-900">
            {jenisPembayaran.nama}
          </Text>
          <Badge
            variant="solid"
            color={jenisPembayaran.status_aktif ? 'green' : 'gray'}
            size="1"
            style={{ borderRadius: 0 }}
            className="shrink-0"
          >
            {jenisPembayaran.status_aktif ? '✓ Aktif' : '○ Nonaktif'}
          </Badge>
        </div>
      </div>

      {/* Kode */}
      <div className="p-3 bg-white border border-slate-300 mx-4">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Kode
          </Text>
        </div>
        <Text size="2" weight="bold" className="text-slate-900 font-mono uppercase">
          {jenisPembayaran.kode}
        </Text>
      </div>

      {/* Deskripsi */}
      {jenisPembayaran.deskripsi && (
        <div className="p-3 bg-white border border-slate-300 mx-4">
          <div className="flex items-center gap-2 mb-1">
            <FileText className="h-4 w-4 text-indigo-500" />
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
              Deskripsi
            </Text>
          </div>
          <Text size="2" className="text-slate-700 leading-snug">
            {jenisPembayaran.deskripsi}
          </Text>
        </div>
      )}

      {/* Jumlah Default */}
      <div className="p-3 bg-green-50 border border-green-300 mx-4">
        <div className="flex items-center gap-2 mb-1">
          <DollarSign className="h-4 w-4 text-green-600" />
          <Text size="1" weight="medium" className="text-green-700 uppercase tracking-wider">
            Jumlah Default
          </Text>
        </div>
        <Text size="4" weight="bold" className="text-green-900 font-mono block">
          {formatCurrency(jenisPembayaran.jumlah_default)}
        </Text>
        <Text size="1" className="text-slate-500 block mt-0.5">
          Nominal standar pembayaran
        </Text>
      </div>

      {/* Tahun Ajaran */}
      {jenisPembayaran.tahun_ajaran && (
        <div className="p-3 bg-white border border-slate-300 mx-4">
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="h-4 w-4 text-purple-500" />
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
              Tahun Ajaran
            </Text>
          </div>
          <Text size="2" weight="bold" className="text-slate-900">
            {jenisPembayaran.tahun_ajaran.nama}
          </Text>
        </div>
      )}

      {/* Tingkat */}
      <div className="p-3 bg-white border border-slate-300 mx-4">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="h-4 w-4 text-orange-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Tingkat Kelas
          </Text>
        </div>
        <Text size="2" weight="bold" className="text-slate-900">
          {jenisPembayaran.tingkat ? `Kelas ${jenisPembayaran.tingkat}` : 'Semua Tingkat'}
        </Text>
      </div>

      {/* Kelas Spesifik */}
      <div className="p-3 bg-white border border-slate-300 mx-4">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="h-4 w-4 text-teal-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Kelas Spesifik
          </Text>
        </div>
        <Text size="2" weight="bold" className="text-slate-900">
          {jenisPembayaran.kelas 
            ? `Kelas ${jenisPembayaran.kelas.tingkat} ${jenisPembayaran.kelas.nama_sub_kelas}` 
            : 'Semua Kelas'}
        </Text>
      </div>

      {/* Peminatan */}
      <div className="p-3 bg-white border border-slate-300 mx-4">
        <div className="flex items-center gap-2 mb-1">
          <Tag className="h-4 w-4 text-pink-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Peminatan
          </Text>
        </div>
        <Text size="2" weight="bold" className="text-slate-900">
          {jenisPembayaran.peminatan 
            ? `${jenisPembayaran.peminatan.kode} - ${jenisPembayaran.peminatan.nama}` 
            : 'Semua Peminatan'}
        </Text>
      </div>

      {/* Status Wajib */}
      <div className="p-3 bg-white border border-slate-300 mx-4">
        <div className="flex items-center gap-2 mb-1">
          {jenisPembayaran.wajib ? (
            <CheckCircle className="h-4 w-4 text-red-500" />
          ) : (
            <AlertCircle className="h-4 w-4 text-slate-400" />
          )}
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Status Pembayaran
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <Badge 
            variant="soft" 
            color={jenisPembayaran.wajib ? 'red' : 'gray'}
            size="2" 
            style={{ borderRadius: 0 }}
          >
            {jenisPembayaran.wajib ? 'Wajib' : 'Opsional'}
          </Badge>
          <Text size="2" className={jenisPembayaran.wajib ? 'text-red-600' : 'text-slate-500'}>
            {jenisPembayaran.wajib ? 'Harus dibayar' : 'Tidak wajib'}
          </Text>
        </div>
      </div>

      {/* Dibuat Pada */}
      <div className="p-3 bg-white border border-slate-300 mx-4">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Dibuat Pada
          </Text>
        </div>
        <Text size="2" className="text-slate-900">
          {formatDateTime(jenisPembayaran.dibuat_pada)}
        </Text>
      </div>

      {/* Diperbarui Pada */}
      {jenisPembayaran.diperbarui_pada && (
        <div className="p-3 bg-white border border-slate-300 mx-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-purple-500" />
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
              Diperbarui Pada
            </Text>
          </div>
          <Text size="2" className="text-slate-900">
            {formatDateTime(jenisPembayaran.diperbarui_pada)}
          </Text>
        </div>
      )}

      {/* ID */}
      <div className="p-3 bg-slate-50 border border-slate-300 mx-4">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            ID
          </Text>
        </div>
        <Text size="1" className="text-slate-500 font-mono break-all">
          {jenisPembayaran.id}
        </Text>
      </div>
    </>
  )
}
