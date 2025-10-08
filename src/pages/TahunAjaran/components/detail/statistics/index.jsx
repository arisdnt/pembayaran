import { Text } from '@radix-ui/themes'
import { Users, Building2, UserCircle2, BookOpen } from 'lucide-react'
import { useTahunAjaranStats } from '../../../hooks/useTahunAjaranStats'
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
    <div className="space-y-3">
      {/* Summary Cards */}
      <div className="p-3 bg-white border border-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-emerald-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Ringkasan
          </Text>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <StatCard label="Total Siswa" value={stats.totalSiswa} color="blue" />
          <StatCard label="Total Kelas" value={stats.totalKelas} color="green" />
        </div>
      </div>

      {/* Distribusi Gender */}
      <div className="p-3 bg-white border border-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <UserCircle2 className="h-4 w-4 text-purple-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Distribusi Jenis Kelamin
          </Text>
        </div>
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
      </div>

      {/* Distribusi Kelas */}
      <div className="p-3 bg-white border border-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <Building2 className="h-4 w-4 text-indigo-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Distribusi Per Kelas
          </Text>
        </div>
        {stats.distribusiKelas.length > 0 ? (
          <div className="space-y-1.5 max-h-[300px] overflow-auto excel-scrollbar">
            {stats.distribusiKelas.map((tingkatGroup) => (
              <TingkatGroup key={tingkatGroup.tingkat} tingkatGroup={tingkatGroup} />
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Text size="2" className="text-slate-400">
              Belum ada kelas dengan siswa aktif
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}
