import { Text } from '@radix-ui/themes'
import { Receipt, User, School, Calendar, DollarSign, Clock, FileText, List } from 'lucide-react'
import { format, formatDistanceToNow } from 'date-fns'
import { id } from 'date-fns/locale'

const FieldItem = ({ label, icon: Icon, children, className = '' }) => (
  <div className={`border-b border-slate-200 pb-3 ${className}`}>
    <div className="flex items-center gap-2 mb-1.5">
      {Icon && <Icon className="h-3.5 w-3.5 text-slate-500" />}
      <Text size="1" className="text-slate-600 font-medium uppercase tracking-wide">
        {label}
      </Text>
    </div>
    <div className="pl-5">{children}</div>
  </div>
)

export function TagihanDetailInfo({ tagihan }) {
  if (!tagihan) return null

  const formatDate = (dateString) => {
    if (!dateString) return '—'
    try {
      return format(new Date(dateString), 'dd MMMM yyyy', { locale: id })
    } catch {
      return '—'
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return '—'
    try {
      return format(new Date(dateString), 'dd MMM yyyy, HH:mm', { locale: id })
    } catch {
      return '—'
    }
  }

  const getRelativeTime = (dateString) => {
    if (!dateString) return ''
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: id })
    } catch {
      return ''
    }
  }

  const formatCurrency = (value) => {
    if (!value) return '—'
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="space-y-4">
      {/* Nomor Tagihan */}
      <FieldItem label="Nomor Tagihan" icon={Receipt}>
        <Text size="3" weight="bold" className="text-slate-900 font-mono leading-tight">
          {tagihan.nomor_tagihan || '—'}
        </Text>
      </FieldItem>

      {/* Judul */}
      <FieldItem label="Judul" icon={FileText}>
        <Text size="2" weight="medium" className="text-slate-800">
          {tagihan.judul || '—'}
        </Text>
      </FieldItem>

      {/* Deskripsi */}
      {tagihan.deskripsi && (
        <FieldItem label="Deskripsi" icon={FileText}>
          <Text size="2" className="text-slate-700 leading-relaxed">
            {tagihan.deskripsi}
          </Text>
        </FieldItem>
      )}

      {/* Siswa */}
      <FieldItem label="Siswa" icon={User}>
        <Text size="2" weight="medium" className="text-slate-800">
          {tagihan.riwayat_kelas_siswa?.siswa?.nama_lengkap || '—'}
        </Text>
        {tagihan.riwayat_kelas_siswa?.siswa?.nisn && (
          <Text size="1" className="text-slate-500 mt-1 font-mono">
            NISN: {tagihan.riwayat_kelas_siswa.siswa.nisn}
          </Text>
        )}
      </FieldItem>

      {/* Kelas */}
      <FieldItem label="Kelas" icon={School}>
        <Text size="2" weight="medium" className="text-slate-800">
          {tagihan.riwayat_kelas_siswa?.kelas
            ? `${tagihan.riwayat_kelas_siswa.kelas.tingkat} ${tagihan.riwayat_kelas_siswa.kelas.nama_sub_kelas}`
            : '—'}
        </Text>
      </FieldItem>

      {/* Total Tagihan */}
      <FieldItem label="Total Tagihan" icon={DollarSign}>
        <Text size="4" weight="bold" className="text-emerald-700">
          {formatCurrency(tagihan.total_tagihan)}
        </Text>
      </FieldItem>

      {/* Rincian Tagihan */}
      {tagihan.rincian_tagihan && tagihan.rincian_tagihan.length > 0 && (
        <FieldItem label="Rincian Pembayaran" icon={List}>
          <div className="space-y-2">
            {tagihan.rincian_tagihan.map((rincian, index) => (
              <div key={index} className="flex items-center justify-between py-2 px-3 bg-slate-50 border border-slate-200">
                <div>
                  <Text size="2" weight="medium" className="text-slate-800">
                    {rincian.jenis_pembayaran?.nama || '—'}
                  </Text>
                  {rincian.keterangan && (
                    <Text size="1" className="text-slate-500 mt-0.5">
                      {rincian.keterangan}
                    </Text>
                  )}
                </div>
                <Text size="2" weight="bold" className="text-emerald-700">
                  {formatCurrency(rincian.jumlah)}
                </Text>
              </div>
            ))}
          </div>
        </FieldItem>
      )}

      {/* Tanggal Tagihan */}
      <FieldItem label="Tanggal Tagihan" icon={Calendar}>
        <Text size="2" className="text-slate-800">
          {formatDate(tagihan.tanggal_tagihan)}
        </Text>
        {tagihan.tanggal_tagihan && (
          <Text size="1" className="text-slate-500 block mt-1">
            {getRelativeTime(tagihan.tanggal_tagihan)}
          </Text>
        )}
      </FieldItem>

      {/* Tanggal Jatuh Tempo */}
      <FieldItem label="Tanggal Jatuh Tempo" icon={Calendar}>
        <Text size="2" className="text-slate-800">
          {formatDate(tagihan.tanggal_jatuh_tempo)}
        </Text>
        {tagihan.tanggal_jatuh_tempo && (
          <Text size="1" className="text-slate-500 block mt-1">
            {getRelativeTime(tagihan.tanggal_jatuh_tempo)}
          </Text>
        )}
      </FieldItem>

      {/* Metadata */}
      <div className="pt-4 mt-4 border-t-2 border-slate-200 space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="h-3 w-3 text-slate-400" />
          <Text size="1" className="text-slate-500">
            Dibuat: {formatDateTime(tagihan.created_at)}
          </Text>
        </div>
        {tagihan.updated_at && tagihan.updated_at !== tagihan.created_at && (
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3 text-slate-400" />
            <Text size="1" className="text-slate-500">
              Diperbarui: {formatDateTime(tagihan.updated_at)}
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}
