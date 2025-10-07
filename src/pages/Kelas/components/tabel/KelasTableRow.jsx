import { Badge, IconButton, Text } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Clock, Eye } from 'lucide-react'
import { formatDateTime } from '../../helpers/formatters'

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
        {typeof item.total_siswa === 'number' ? (
          <Badge
            variant="soft"
            color={item.total_siswa > 0 ? 'green' : 'gray'}
            size="2"
            style={{ borderRadius: 0 }}
          >
            {item.total_siswa} siswa
          </Badge>
        ) : null}
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
          <IconButton
            size="1"
            variant="soft"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetail(item)
            }}
            className="cursor-pointer hover:bg-slate-100 text-slate-700 border border-slate-200"
            style={{ borderRadius: 0 }}
            aria-label={`Detail ${item.nama_sub_kelas}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton
            size="1"
            variant="soft"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(item)
            }}
            className="cursor-pointer hover:bg-blue-100 text-blue-700 border border-blue-200"
            style={{ borderRadius: 0 }}
            aria-label={`Edit ${item.nama_sub_kelas}`}
          >
            <Pencil1Icon />
          </IconButton>
          <IconButton
            size="1"
            variant="soft"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(item)
            }}
            className="cursor-pointer hover:bg-red-100 text-red-700 border border-red-200"
            style={{ borderRadius: 0 }}
            aria-label={`Hapus ${item.nama_sub_kelas}`}
          >
            <TrashIcon />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}
