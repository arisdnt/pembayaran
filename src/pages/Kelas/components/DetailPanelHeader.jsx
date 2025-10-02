import { Text } from '@radix-ui/themes'
import { GraduationCap } from 'lucide-react'

export function DetailPanelHeader({ selectedItem, schoolName, schoolAddress }) {
  return (
    <div className="shrink-0 border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
      <div className="flex items-center gap-2.5 mb-3">
        <div className="flex h-8 w-8 items-center justify-center bg-blue-600 border border-blue-700">
          <GraduationCap className="h-5 w-5 text-white" />
        </div>
        <div>
          <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider block">
            Detail Kelas
          </Text>
          <Text size="1" className="text-slate-600">
            {schoolName}
          </Text>
        </div>
      </div>
      
      <div className="bg-white border-2 border-slate-300 p-3">
        <Text size="7" weight="bold" className="text-slate-900 leading-tight block">
          Kelas {selectedItem.tingkat} {selectedItem.nama_sub_kelas}
        </Text>
        <Text size="1" className="text-slate-500 font-mono mt-1 block">
          ID: {selectedItem.id?.slice(0, 8) || '—'}
        </Text>
      </div>
    </div>
  )
}
