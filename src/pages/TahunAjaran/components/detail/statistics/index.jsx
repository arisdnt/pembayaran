import { Text } from '@radix-ui/themes'
import { Users, Building2, UserCircle2, BookOpen } from 'lucide-react'
import { useTahunAjaranStats } from '../../../hooks/useTahunAjaranStats'
import { StatSection } from './StatSection'
import { StatCard } from './StatCard'
import { ProgressBar } from './ProgressBar'
import { TingkatGroup } from './TingkatGroup'
import { LoadingSkeleton } from './LoadingSkeleton'

export function TahunAjaranStatistics({ tahunAjaranId }) {
  const stats = useTahunAjaranStats(tahunAjaranId)

  if (stats.loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-1">
      {/* Summary Cards */}
      <StatSection title="Ringkasan" icon={BookOpen}>
        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Total Siswa" value={stats.totalSiswa} color="blue" />
          <StatCard label="Total Kelas" value={stats.totalKelas} color="green" />
        </div>
      </StatSection>

      {/* Distribusi Gender */}
      <StatSection title="Distribusi Jenis Kelamin" icon={UserCircle2}>
        <div className="space-y-2.5">
          <ProgressBar 
            label="Laki-laki" 
            value={stats.distribusiGender.lakiLaki} 
            total={stats.totalSiswa}
            color="blue"
          />
          <ProgressBar 
            label="Perempuan" 
            value={stats.distribusiGender.perempuan} 
            total={stats.totalSiswa}
            color="pink"
          />
          {stats.distribusiGender.tidakDiketahui > 0 && (
            <ProgressBar 
              label="Tidak Diketahui" 
              value={stats.distribusiGender.tidakDiketahui} 
              total={stats.totalSiswa}
              color="gray"
            />
          )}
        </div>
      </StatSection>

      {/* Distribusi Kelas */}
      <StatSection 
        title="Distribusi Per Kelas" 
        icon={Building2} 
        className="border-b-0 pb-0 mb-0"
      >
        {stats.distribusiKelas.length > 0 ? (
          <div className="space-y-1.5">
            {stats.distribusiKelas.map((tingkatGroup) => (
              <TingkatGroup key={tingkatGroup.tingkat} tingkatGroup={tingkatGroup} />
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center">
            <Building2 className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <Text size="1" className="text-slate-500">
              Belum ada kelas dengan siswa aktif
            </Text>
          </div>
        )}
      </StatSection>
    </div>
  )
}
