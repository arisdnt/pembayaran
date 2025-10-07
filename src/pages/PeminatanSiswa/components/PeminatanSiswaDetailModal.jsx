import { Dialog, Text, Badge } from '@radix-ui/themes'
import { X, BookOpen, Users, Calendar, Hash, FileText, GraduationCap } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

export function PeminatanSiswaDetailModal({ open, onOpenChange, item }) {
  if (!item) return null

  const Section = ({ title, icon: Icon, children }) => (
    <div className="border-b border-slate-200 pb-4 mb-4">
      <div className="flex items-center gap-1.5 mb-3">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-500" />}
        <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider text-[0.65rem]">
          {title}
        </Text>
      </div>
      <div className="ml-5">
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
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center border shadow-sm bg-blue-600 border-blue-700">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                Detail Peminatan Siswa
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
        <div className="overflow-auto bg-white p-6" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {/* Siswa Section */}
          <Section title="Data Siswa" icon={Users}>
            <div className="space-y-2">
              <div>
                <Text size="2" weight="bold" className="text-slate-900 block">
                  {item.siswa?.nama_lengkap || '-'}
                </Text>
                {item.siswa?.nisn && (
                  <Text size="1" className="text-red-600 font-mono block mt-0.5">
                    NISN: {item.siswa.nisn}
                  </Text>
                )}
              </div>
            </div>
          </Section>

          {/* Peminatan Section */}
          <Section title="Peminatan" icon={GraduationCap}>
            <div className="space-y-2">
              <div>
                <Text size="2" weight="bold" className="text-slate-900 block">
                  {item.peminatan?.nama || '-'}
                </Text>
                {item.peminatan?.kode && (
                  <Text size="1" className="text-slate-500 block mt-0.5">
                    Kode: {item.peminatan.kode}
                  </Text>
                )}
              </div>
            </div>
          </Section>

          {/* Tahun Ajaran & Tingkat Section */}
          <Section title="Tahun Ajaran & Tingkat" icon={Calendar}>
            <div className="space-y-2">
              <div>
                <Text size="1" className="text-slate-600 block mb-1">
                  Tahun Ajaran
                </Text>
                <Text size="2" className="text-slate-900 block">
                  {item.tahun_ajaran?.nama || '-'}
                </Text>
              </div>
              <div>
                <Text size="1" className="text-slate-600 block mb-1">
                  Tingkat
                </Text>
                {item.tingkat ? (
                  <Badge color="indigo" variant="soft" style={{ borderRadius: 0 }}>
                    Tingkat {item.tingkat}
                  </Badge>
                ) : (
                  <Text size="2" className="text-slate-400">-</Text>
                )}
              </div>
            </div>
          </Section>

          {/* Periode Section */}
          <Section title="Periode" icon={Calendar}>
            <div className="space-y-2">
              <div>
                <Text size="1" className="text-slate-600 block mb-1">
                  Tanggal Mulai
                </Text>
                <Text size="2" className="text-green-700 block">
                  {formatDate(item.tanggal_mulai)}
                </Text>
              </div>
              <div>
                <Text size="1" className="text-slate-600 block mb-1">
                  Tanggal Selesai
                </Text>
                {item.tanggal_selesai ? (
                  <Text size="2" className="text-red-700 block">
                    {formatDate(item.tanggal_selesai)}
                  </Text>
                ) : (
                  <Badge color="green" variant="soft" style={{ borderRadius: 0 }}>
                    Berlangsung
                  </Badge>
                )}
              </div>
            </div>
          </Section>

          {/* Catatan Section */}
          {item.catatan && (
            <Section title="Catatan" icon={FileText}>
              <Text size="2" className="text-slate-700 whitespace-pre-wrap">
                {item.catatan}
              </Text>
            </Section>
          )}
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
