import { Text } from '@radix-ui/themes'
import { School } from 'lucide-react'

export function DetailPanelHeader({ selectedItem }) {
  return (
    <div className="shrink-0 border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
      <div className="flex items-center gap-2">
        <School className="h-5 w-5 text-indigo-600" />
        <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
          Detail Kelas
        </Text>
      </div>
    </div>
  )
}
