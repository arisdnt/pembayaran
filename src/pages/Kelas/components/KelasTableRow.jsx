import { Badge, IconButton, Text } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Clock, Eye } from 'lucide-react'
import { formatDateTime } from '../utils/dateHelpers'

export function KelasTableRow({ item, isSelected, onSelect, onEdit, onDelete, onViewDetail, isEven }) {
  return (
    <tr
      key={item.id}
      onClick={() => onSelect(item)}
      className={`group transition-colors cursor-pointer border-b border-slate-200 ${
        isSelected
          ? 'bg-blue-50 hover:bg-blue-100'
          : isEven 
            ? 'bg-white hover:bg-slate-50' 
            : 'bg-slate-50/50 hover:bg-slate-100/50'
      }`}
    >
      <td className="px-4 py-3 border-r border-slate-200">
        <Badge variant="soft" color="blue" size="2" style={{ borderRadius: 0 }}>
          Tingkat {item.tingkat}
        </Badge>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" weight="bold" className="text-slate-900">
          {item.nama_sub_kelas}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {item.kapasitas_maksimal ? `${item.kapasitas_maksimal} siswa` : '—'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="1" className="text-slate-500 uppercase tracking-wider font-mono">
          {item.id?.slice(0, 8) ?? '—'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs">{formatDateTime(item.diperbarui_pada || item.dibuat_pada)}</span>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewDetail(item)
            }}
            className="p-1.5 hover:bg-blue-100 text-blue-600 transition-colors border border-transparent hover:border-blue-300"
            aria-label={`Lihat ${item.nama_sub_kelas}`}
            title="Lihat Detail"
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(item)
            }}
            className="p-1.5 hover:bg-amber-100 text-amber-600 transition-colors border border-transparent hover:border-amber-300"
            aria-label={`Edit ${item.nama_sub_kelas}`}
            title="Edit"
          >
            <Pencil1Icon className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(item)
            }}
            className="p-1.5 hover:bg-red-100 text-red-600 transition-colors border border-transparent hover:border-red-300"
            aria-label={`Hapus ${item.nama_sub_kelas}`}
            title="Hapus"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}
