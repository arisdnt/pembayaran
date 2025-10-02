import { Dialog } from '@radix-ui/themes'
import { Text, Badge } from '@radix-ui/themes'
import { X, DollarSign, Clock, FileText, Hash, Tag, Calendar, CheckCircle, AlertCircle } from 'lucide-react'
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

export function JenisPembayaranDetailModal({ open, onOpenChange, jenisPembayaran }) {
  if (!jenisPembayaran) return null

  // Icon color mapping
  const iconColors = {
    Hash: 'text-blue-500',
    Tag: 'text-indigo-500',
    FileText: 'text-slate-500',
    DollarSign: 'text-green-500',
    Calendar: 'text-purple-500',
    CheckCircle: 'text-red-500',
    AlertCircle: 'text-amber-500',
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
            <div className="flex h-10 w-10 items-center justify-center bg-green-600 border border-green-700 shadow-sm">
              <DollarSign className="h-5 w-5 text-white" />
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                Detail Jenis Pembayaran
              </Text>
              <Text size="1" className="text-slate-600">
                Informasi lengkap jenis pembayaran
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
            {/* Nama - Full Width Header */}
            <div className="bg-slate-50 border-2 border-slate-300 p-4 shadow-sm">
              <Text size="1" className="text-slate-500 uppercase tracking-wider font-medium mb-1 block">
                Nama Jenis Pembayaran
              </Text>
              <Text size="6" weight="bold" className="text-slate-900">
                {jenisPembayaran.nama}
              </Text>
            </div>

            {/* Detail Information - 2 Column Grid */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <FieldItem label="ID Jenis Pembayaran" icon={Hash}>
                <Text size="2" className="font-mono text-slate-700 font-medium">
                  {jenisPembayaran.id}
                </Text>
              </FieldItem>

              <FieldItem label="Kode" icon={Hash}>
                <Text size="2" className="font-mono text-slate-700 font-medium uppercase">
                  {jenisPembayaran.kode}
                </Text>
              </FieldItem>

              <FieldItem label="Jumlah Default" icon={DollarSign}>
                <Text size="2" className="text-slate-700 font-mono font-medium">
                  {formatCurrency(jenisPembayaran.jumlah_default)}
                </Text>
              </FieldItem>

              {jenisPembayaran.tipe_pembayaran && (
                <FieldItem label="Tipe Pembayaran" icon={Calendar}>
                  <Badge 
                    variant="soft" 
                    color={getTipeBadgeColor(jenisPembayaran.tipe_pembayaran)}
                    className="text-xs capitalize px-3 py-1"
                  >
                    {jenisPembayaran.tipe_pembayaran}
                  </Badge>
                </FieldItem>
              )}

              {jenisPembayaran.tahun_ajaran && (
                <FieldItem label="Tahun Ajaran" icon={Calendar}>
                  <Text size="2" className="text-slate-700">
                    {jenisPembayaran.tahun_ajaran.nama}
                  </Text>
                </FieldItem>
              )}

              {jenisPembayaran.kelas && (
                <FieldItem label="Kelas" icon={Tag}>
                  <Text size="2" className="text-slate-700">
                    Kelas {jenisPembayaran.kelas.tingkat} {jenisPembayaran.kelas.nama_sub_kelas}
                  </Text>
                </FieldItem>
              )}

              <FieldItem label="Status Wajib" icon={jenisPembayaran.wajib ? CheckCircle : AlertCircle}>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="soft"
                    color={jenisPembayaran.wajib ? 'red' : 'gray'}
                    className="text-xs px-3 py-1"
                  >
                    {jenisPembayaran.wajib ? 'Wajib' : 'Opsional'}
                  </Badge>
                  <Text size="1" className={jenisPembayaran.wajib ? 'text-red-600' : 'text-slate-500'}>
                    {jenisPembayaran.wajib ? 'Harus dibayar' : 'Tidak wajib'}
                  </Text>
                </div>
              </FieldItem>

              <FieldItem label="Status Aktif" icon={Tag}>
                <Badge
                  variant="soft"
                  color={jenisPembayaran.status_aktif ? 'green' : 'gray'}
                  className="text-xs px-3 py-1"
                >
                  {jenisPembayaran.status_aktif ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </FieldItem>
            </div>

            {/* Deskripsi - Full Width */}
            {jenisPembayaran.deskripsi && (
              <div className="border-t-2 border-slate-200 pt-4">
                <FieldItem label="Deskripsi" icon={FileText} fullWidth>
                  <Text size="2" className="text-slate-700 leading-relaxed">
                    {jenisPembayaran.deskripsi}
                  </Text>
                </FieldItem>
              </div>
            )}

            {/* Metadata Section - 2 Column Grid */}
            <div className="border-t-2 border-slate-200 pt-5 mt-5">
              <div className="grid grid-cols-2 gap-x-6 gap-y-4">
                <FieldItem label="Dibuat Pada" icon={Clock}>
                  <div className="flex items-center gap-2">
                    <Clock className="h-3.5 w-3.5 text-slate-400" />
                    <Text size="1" className="text-slate-600 font-mono">
                      {formatDateTime(jenisPembayaran.dibuat_pada)}
                    </Text>
                  </div>
                </FieldItem>

                {jenisPembayaran.diperbarui_pada && (
                  <FieldItem label="Diperbarui Pada" icon={Clock}>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-slate-400" />
                      <Text size="1" className="text-slate-600 font-mono">
                        {formatDateTime(jenisPembayaran.diperbarui_pada)}
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
            Data jenis pembayaran • Sistem Kas Sekolah
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
