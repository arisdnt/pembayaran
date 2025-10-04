import { Text } from '@radix-ui/themes'
import { School, Users, BookOpen, User as UserIcon } from 'lucide-react'
import { useWaliKelasAmpu } from '../../../hooks/useWaliKelasAmpu'

export function WaliKelasAmpuSection({ waliKelasId }) {
  const { kelasList, siswaList, summary, loading } = useWaliKelasAmpu(waliKelasId)

  // Section component
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

  // Stat card component
  const StatCard = ({ label, value, icon: Icon, color = 'blue' }) => {
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      purple: 'bg-purple-50 border-purple-200 text-purple-900',
    }

    return (
      <div className={`border-2 ${colorClasses[color]} px-3 py-2`}>
        <div className="flex items-center gap-1 mb-1">
          {Icon && <Icon className="h-3 w-3" />}
          <Text size="1" className="uppercase tracking-wide text-[0.65rem]">
            {label}
          </Text>
        </div>
        <Text size="3" weight="bold" className="leading-none font-mono">
          {value}
        </Text>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-20 bg-slate-200" />
        <div className="h-32 bg-slate-200" />
        <div className="h-48 bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {/* Ringkasan */}
      <Section title="Ringkasan Kelas Diampu" icon={BookOpen}>
        <div className="grid grid-cols-2 gap-2">
          <StatCard 
            label="Total Kelas" 
            value={summary.totalKelas} 
            color="blue"
            icon={School}
          />
          <StatCard 
            label="Total Siswa" 
            value={summary.totalSiswa} 
            color="green"
            icon={Users}
          />
        </div>
      </Section>

      {/* Daftar Kelas */}
      <Section title="Daftar Kelas" icon={School}>
        {kelasList.length > 0 ? (
          <div className="space-y-2">
            {kelasList.map((kelas) => (
              <div
                key={kelas.id}
                className="border-2 border-indigo-200 bg-indigo-50 hover:bg-indigo-100 transition-colors"
              >
                <div className="px-3 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center w-8 h-8 bg-indigo-600 border border-indigo-700">
                      <Text size="1" weight="bold" className="text-white font-mono">
                        {kelas.tingkat}
                      </Text>
                    </div>
                    <div>
                      <Text size="2" weight="bold" className="text-indigo-900">
                        Kelas {kelas.tingkat} {kelas.namaSubKelas}
                      </Text>
                      {kelas.kapasitasMaksimal && (
                        <Text size="1" className="text-indigo-600 block mt-0.5">
                          Kapasitas {kelas.jumlahSiswa}/{kelas.kapasitasMaksimal}
                        </Text>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5 text-indigo-600" />
                    <Text size="2" weight="bold" className="text-indigo-900 font-mono">
                      {kelas.jumlahSiswa}
                    </Text>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center">
            <School className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <Text size="1" className="text-slate-500">
              Tidak ada kelas yang diampu di tahun ajaran aktif
            </Text>
          </div>
        )}
      </Section>

      {/* Daftar Siswa */}
      <Section title="Daftar Siswa" icon={Users} className="border-b-0 pb-0 mb-0">
        {siswaList.length > 0 ? (
          <div className="max-h-80 overflow-y-auto">
            {siswaList.map((siswa, index) => (
              <div
                key={siswa.id}
                className={`flex items-center gap-2 px-2 py-1 ${
                  index % 2 === 0 ? 'bg-slate-50' : 'bg-white'
                }`}
              >
                <Text size="1" className="text-slate-500 font-mono w-6 shrink-0">
                  {index + 1}.
                </Text>
                <Text size="2" weight="medium" className="text-slate-900 truncate">
                  {siswa.namaLengkap}
                </Text>
                {siswa.nisn && (
                  <>
                    <span className="text-slate-400">•</span>
                    <Text size="1" className="text-red-600 font-mono">
                      {siswa.nisn}
                    </Text>
                  </>
                )}
                <span className="text-slate-400">•</span>
                <Text size="1" className="text-slate-600">
                  {siswa.kelasLabel}
                </Text>
                {siswa.jenisKelamin && (
                  <>
                    <span className="text-slate-400">•</span>
                    <Text size="1" className="text-slate-600">
                      {siswa.jenisKelamin === 'Laki-laki' ? 'L' : siswa.jenisKelamin === 'Perempuan' ? 'P' : '?'}
                    </Text>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : (
          <Text size="1" className="text-slate-500">
            Tidak ada siswa yang diampu di tahun ajaran aktif
          </Text>
        )}
      </Section>
    </div>
  )
}
