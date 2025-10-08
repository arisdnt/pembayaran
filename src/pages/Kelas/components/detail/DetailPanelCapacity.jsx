import { Text } from '@radix-ui/themes'
import { Users } from 'lucide-react'

export function DetailPanelCapacity({ selectedItem, selectedYearLabel = '—' }) {
  const capacityMax = Number(selectedItem.kapasitas_maksimal || 0)
  const occupied = Number(selectedItem.total_siswa || 0)
  const available = Math.max(capacityMax - occupied, 0)
  const occupancyPct = capacityMax > 0 ? Math.round((occupied / capacityMax) * 100) : 0

  return (
    <div className="p-3 bg-white border border-slate-300 mx-4">
      <div className="flex items-center gap-2 mb-2">
        <Users className="h-4 w-4 text-green-500" />
        <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
          Kapasitas
        </Text>
      </div>
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-slate-100 border border-slate-300 p-2">
            <Text size="1" className="text-slate-600 uppercase tracking-wider text-[0.65rem] block">
              Maksimal
            </Text>
            <Text size="5" weight="bold" className="text-slate-900 mt-1 block">
              {capacityMax}
            </Text>
          </div>
          <div className="bg-blue-50 border border-blue-300 p-2">
            <Text size="1" className="text-blue-600 uppercase tracking-wider text-[0.65rem] block">
              Terisi
            </Text>
            <Text size="5" weight="bold" className="text-blue-900 mt-1 block">
              {occupied}
            </Text>
            <Text size="1" className="text-blue-500 uppercase tracking-wider text-[0.6rem]">
              {selectedYearLabel}
            </Text>
          </div>
          <div className="bg-green-50 border border-green-300 p-2">
            <Text size="1" className="text-green-600 uppercase tracking-wider text-[0.65rem] block">
              Tersedia
            </Text>
            <Text size="5" weight="bold" className="text-green-900 mt-1 block">
              {available}
            </Text>
          </div>
        </div>
        
        <div className="bg-white border border-slate-300 p-2">
          <div className="flex justify-between items-center mb-1">
            <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem]">
              Okupansi
            </Text>
            <Text size="1" weight="bold" className="text-slate-700">
              {occupancyPct}%
            </Text>
          </div>
          <div className="h-2 w-full bg-slate-200 border border-slate-300" style={{ borderRadius: 0 }}>
            <div className="h-full bg-green-500" style={{ width: `${occupancyPct}%`, borderRadius: 0 }} />
          </div>
        </div>
      </div>
    </div>
  )
}
