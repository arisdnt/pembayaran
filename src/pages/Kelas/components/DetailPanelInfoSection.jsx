import { Text, Badge } from '@radix-ui/themes'
import { Hash, GraduationCap } from 'lucide-react'

export function DetailPanelInfoSection({ selectedItem }) {
  return (
    <div className="border-2 border-slate-300 bg-slate-50">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-3 py-2">
        <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
          Informasi Kelas
        </Text>
      </div>
      <div className="p-3 space-y-3">
        {/* Tingkat */}
        <div className="flex items-start gap-2">
          <Hash className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-1 block">
              Tingkat
            </Text>
            <Badge variant="soft" color="blue" size="2" style={{ borderRadius: 0 }}>
              Tingkat {selectedItem.tingkat}
            </Badge>
          </div>
        </div>

        {/* Nama Sub Kelas */}
        <div className="flex items-start gap-2">
          <GraduationCap className="h-4 w-4 text-indigo-500 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-1 block">
              Nama Sub Kelas
            </Text>
            <Text size="2" weight="bold" className="text-slate-900">
              {selectedItem.nama_sub_kelas}
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
