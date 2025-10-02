import { Dialog } from '@radix-ui/themes'
import { Text, Badge } from '@radix-ui/themes'
import { X, GraduationCap, Clock, Hash, Users } from 'lucide-react'
import { formatDateTime } from '../utils/dateHelpers'

export function KelasDetailModal({ open, onOpenChange, kelas }) {
  if (!kelas) return null

  // Icon color mapping
  const iconColors = {
    Hash: 'text-blue-500',
    GraduationCap: 'text-indigo-500',
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

  const capacityMax = Number(kelas.kapasitas_maksimal || 0)
  const occupied = 0 // TODO: Get actual occupied count
  const available = Math.max(capacityMax - occupied, 0)
  const occupancyPct = capacityMax > 0 ? Math.round((occupied / capacityMax) * 100) : 0

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
            <div className="flex h-10 w-10 items-center justify-center bg-blue-600 border border-blue-700 shadow-sm">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                Detail Kelas
              </Text>
              <Text size="1" className="text-slate-600">
                Informasi lengkap data kelas
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
        <div className="overflow-auto p-6 bg-white" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {/* Nama Kelas Section */}
          <div className="bg-slate-50 border-2 border-slate-300 p-4 mb-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-1.5 block font-medium">
                  Nama Kelas
                </Text>
                <Text size="6" weight="bold" className="text-slate-900 leading-tight">
                  Kelas {kelas.tingkat} {kelas.nama_sub_kelas}
                </Text>
              </div>
            </div>
          </div>

          {/* Detail Information - 2 columns */}
          <div className="grid grid-cols-2 gap-6 mb-6">
            {/* Tingkat */}
            <FieldItem label="Tingkat" icon={Hash}>
              <Badge variant="soft" color="blue" size="2" style={{ borderRadius: 0 }}>
                Tingkat {kelas.tingkat}
              </Badge>
            </FieldItem>

            {/* Nama Sub Kelas */}
            <FieldItem label="Nama Sub Kelas" icon={GraduationCap}>
              <Text size="3" weight="bold" className="text-slate-900">
                {kelas.nama_sub_kelas}
              </Text>
            </FieldItem>

            {/* ID */}
            <FieldItem label="ID Kelas" icon={Hash}>
              <Text size="2" className="font-mono text-slate-700">
                {kelas.id?.slice(0, 16) || '—'}
              </Text>
            </FieldItem>

            {/* Kapasitas Maksimal */}
            <FieldItem label="Kapasitas Maksimal" icon={Users}>
              <Text size="3" weight="bold" className="text-slate-900">
                {capacityMax > 0 ? `${capacityMax} siswa` : 'Tidak ditentukan'}
              </Text>
            </FieldItem>
          </div>

          {/* Kapasitas Section - Full Width */}
          {capacityMax > 0 && (
            <div className="mb-6">
              <div className="border-2 border-slate-300 bg-slate-50 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="h-4 w-4 text-green-500" />
                  <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Kapasitas Kelas
                  </Text>
                </div>
                
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-white border border-slate-300 p-3 text-center">
                    <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] block mb-1">
                      Maksimal
                    </Text>
                    <Text size="6" weight="bold" className="text-slate-900">
                      {capacityMax}
                    </Text>
                  </div>
                  <div className="bg-white border border-slate-300 p-3 text-center">
                    <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] block mb-1">
                      Terisi
                    </Text>
                    <Text size="6" weight="bold" className="text-blue-900">
                      {occupied}
                    </Text>
                  </div>
                  <div className="bg-white border border-slate-300 p-3 text-center">
                    <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] block mb-1">
                      Tersedia
                    </Text>
                    <Text size="6" weight="bold" className="text-green-900">
                      {available}
                    </Text>
                  </div>
                </div>

                <div className="bg-white border border-slate-300 p-3">
                  <div className="flex justify-between items-center mb-2">
                    <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem]">
                      Okupansi
                    </Text>
                    <Text size="2" weight="bold" className="text-slate-700">
                      {occupancyPct}%
                    </Text>
                  </div>
                  <div className="h-3 w-full bg-slate-200 border border-slate-300" style={{ borderRadius: 0 }}>
                    <div 
                      className="h-full bg-green-500" 
                      style={{ width: `${occupancyPct}%`, borderRadius: 0 }} 
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Metadata - 2 columns */}
          <div className="grid grid-cols-2 gap-6">
            {/* Dibuat Pada */}
            <FieldItem label="Dibuat Pada" icon={Clock}>
              <Text size="2" className="text-slate-900">
                {formatDateTime(kelas.dibuat_pada)}
              </Text>
            </FieldItem>

            {/* Diperbarui Pada */}
            {kelas.diperbarui_pada && (
              <FieldItem label="Diperbarui Pada" icon={Clock}>
                <Text size="2" className="text-slate-900">
                  {formatDateTime(kelas.diperbarui_pada)}
                </Text>
              </FieldItem>
            )}
          </div>
        </div>

        {/* Footer - Excel style */}
        <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <div className="flex items-center justify-between">
            <Text size="1" className="text-slate-600 font-medium">
              Data kelas • Sistem Kas Sekolah
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
