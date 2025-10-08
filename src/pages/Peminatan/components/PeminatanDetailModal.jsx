import { Dialog, Text, Badge } from '@radix-ui/themes'
import { BookOpen, X, Hash, TrendingDown, TrendingUp, FileText, Power, Users } from 'lucide-react'

export function PeminatanDetailModal({ open, onOpenChange, peminatan, selectedYearLabel = 'Semua Tahun Ajaran' }) {
  if (!peminatan) return null

  const Section = ({ title, icon: Icon, children, className = '' }) => (
    <div className={`border-b border-slate-200 pb-4 mb-4 ${className}`}>
      <div className="flex items-center gap-1.5 mb-3">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-500" />}
        <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider text-[0.65rem]">
          {title}
        </Text>
      </div>
      <div className="ml-5 space-y-2">
        {children}
      </div>
    </div>
  )

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{
          maxWidth: '600px',
          width: '95vw',
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
            <div className="flex h-10 w-10 items-center justify-center border border-indigo-700 bg-indigo-600 shadow-sm">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                Detail Peminatan
              </Text>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
            aria-label="Close"
            type="button"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-auto bg-white p-6" style={{ maxHeight: 'calc(85vh - 140px)' }}>
          <div className="space-y-1">
            {/* Nama Peminatan & Status */}
            <div className="bg-gradient-to-b from-slate-50 to-white border border-slate-200 p-3 mb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-1 block">
                    Nama Peminatan
                  </Text>
                  <Text size="6" weight="bold" className="text-slate-900 leading-tight">
                    {peminatan.nama}
                  </Text>
                  <Text size="2" className="text-slate-600 block mt-1">
                    Kode (Auto-Generated): <span className="font-semibold">{peminatan.kode}</span>
                  </Text>
                </div>
                <Badge
                  variant="solid"
                  color={peminatan.aktif ? 'green' : 'gray'}
                  size="3"
                  style={{ borderRadius: 0 }}
                  className="font-semibold"
                >
                  {peminatan.aktif ? '✓ Aktif' : '○ Non-Aktif'}
                </Badge>
              </div>
            </div>

            {/* Rentang Tingkat */}
            <Section title="Rentang Tingkat" icon={TrendingUp}>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Text size="1" className="text-slate-500 uppercase text-[0.65rem] mb-1 block">
                    Tingkat Minimum
                  </Text>
                  {peminatan.tingkat_min ? (
                    <Badge color="blue" variant="soft" size="2" style={{ borderRadius: 0 }}>
                      Tingkat {peminatan.tingkat_min}
                    </Badge>
                  ) : (
                    <Text size="2" className="text-slate-400">
                      Tidak ada batasan
                    </Text>
                  )}
                </div>
                <div>
                  <Text size="1" className="text-slate-500 uppercase text-[0.65rem] mb-1 block">
                    Tingkat Maximum
                  </Text>
                  {peminatan.tingkat_max ? (
                    <Badge color="purple" variant="soft" size="2" style={{ borderRadius: 0 }}>
                      Tingkat {peminatan.tingkat_max}
                    </Badge>
                  ) : (
                    <Text size="2" className="text-slate-400">
                      Tidak ada batasan
                    </Text>
                  )}
                </div>
              </div>
            </Section>

            <Section title="Total Siswa" icon={Users}>
              <div>
                <Text size="1" className="text-slate-500 uppercase text-[0.65rem] mb-1 block">
                  {selectedYearLabel}
                </Text>
                <Text size="4" weight="bold" className="text-slate-900">
                  {peminatan.total_siswa || 0} siswa
                </Text>
              </div>
            </Section>

            {/* Keterangan */}
            {peminatan.keterangan && (
              <Section title="Keterangan" icon={FileText} className="border-b-0 pb-0 mb-0">
                <Text size="2" className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {peminatan.keterangan}
                </Text>
              </Section>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold transition-colors shadow-sm hover:shadow border border-slate-400"
            style={{ borderRadius: 0 }}
          >
            <span className="flex items-center gap-2">
              <X className="h-4 w-4" />
              Tutup
            </span>
          </button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
