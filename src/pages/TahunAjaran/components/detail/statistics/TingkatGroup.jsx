import { Text } from '@radix-ui/themes'
import { Users } from 'lucide-react'
import { KelasItem } from './KelasItem'

export function TingkatGroup({ tingkatGroup }) {
  return (
    <div className="border border-slate-300 bg-white">
      {/* Tingkat Header */}
      <div className="flex items-center justify-between px-2.5 py-1.5 bg-gradient-to-b from-slate-100 to-slate-50 border-b border-slate-300">
        <div className="flex items-center gap-1.5">
          <div className="flex items-center justify-center w-6 h-6 bg-indigo-600 border border-indigo-700">
            <Text size="1" weight="bold" className="text-white font-mono text-[0.7rem]">
              {tingkatGroup.tingkat}
            </Text>
          </div>
          <Text size="1" weight="bold" className="text-slate-900 text-[0.7rem]">
            Tingkat {tingkatGroup.tingkat}
          </Text>
          <Text size="1" className="text-slate-500 text-[0.65rem]">
            ({tingkatGroup.kelasList.length} kelas)
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[0.65rem]">
            <div className="w-1.5 h-1.5 bg-blue-600" />
            <Text size="1" weight="bold" className="text-slate-700 font-mono">
              {tingkatGroup.lakiLaki}
            </Text>
          </div>
          <div className="flex items-center gap-1.5 text-[0.65rem]">
            <div className="w-1.5 h-1.5 bg-pink-600" />
            <Text size="1" weight="bold" className="text-slate-700 font-mono">
              {tingkatGroup.perempuan}
            </Text>
          </div>
          <div className="flex items-center gap-0.5 ml-1">
            <Users className="h-3 w-3 text-slate-600" />
            <Text size="1" weight="bold" className="text-slate-900 font-mono">
              {tingkatGroup.totalSiswa}
            </Text>
          </div>
        </div>
      </div>

      {/* Kelas List */}
      <div className="divide-y divide-slate-200">
        {tingkatGroup.kelasList.map((kelas) => (
          <KelasItem key={kelas.id} kelas={kelas} />
        ))}
      </div>
    </div>
  )
}
