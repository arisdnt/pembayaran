import { Text } from '@radix-ui/themes'
import { Calendar } from 'lucide-react'

export function DetailPanelEmpty() {
  return (
    <div className="flex h-full flex-col items-center justify-center bg-white/80 backdrop-blur p-6 shadow-sm">
      <div className="text-center text-slate-400">
        <Calendar className="h-16 w-16 mx-auto mb-4 text-slate-300" />
        <Text size="3" className="text-slate-500 mb-2">
          Tidak ada data dipilih
        </Text>
        <Text size="2" className="text-slate-400">
          Pilih baris pada tabel untuk melihat detail
        </Text>
      </div>
    </div>
  )
}
