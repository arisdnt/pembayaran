import { Text, Badge } from '@radix-ui/themes'
import { Hash, School } from 'lucide-react'

export function DetailPanelInfoSection({ selectedItem }) {
  return (
    <>
      {/* Nama Kelas */}
      <div className="p-3 bg-slate-50 border border-slate-300 mx-4">
        <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider mb-2 block">
          Informasi Utama
        </Text>
        <Text size="4" weight="bold" className="text-slate-900 block">
          Kelas {selectedItem.tingkat} {selectedItem.nama_sub_kelas}
        </Text>
      </div>

      {/* Tingkat */}
      <div className="p-3 bg-white border border-slate-300 mx-4">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Tingkat
          </Text>
        </div>
        <Badge variant="soft" color="blue" size="2" style={{ borderRadius: 0 }}>
          Tingkat {selectedItem.tingkat}
        </Badge>
      </div>

      {/* Nama Sub Kelas */}
      <div className="p-3 bg-white border border-slate-300 mx-4">
        <div className="flex items-center gap-2 mb-1">
          <School className="h-4 w-4 text-indigo-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Nama Sub Kelas
          </Text>
        </div>
        <Text size="2" weight="bold" className="text-slate-900">
          {selectedItem.nama_sub_kelas}
        </Text>
      </div>
    </>
  )
}
