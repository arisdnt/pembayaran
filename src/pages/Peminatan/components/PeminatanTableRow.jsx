import { Eye } from 'lucide-react'
import { Badge, IconButton, Switch } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'

export function PeminatanTableRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleAktif,
  onViewDetail,
  isEven,
}) {
  const rowBgClass = isSelected
    ? 'bg-blue-100 hover:bg-blue-100'
    : isEven
      ? 'bg-white hover:bg-slate-50'
      : 'bg-slate-50/50 hover:bg-slate-100'

  return (
    <tr
      onClick={() => onSelect(item)}
      className={`${rowBgClass} border-b border-slate-200 transition-colors cursor-pointer`}
    >
      <td className="px-4 py-3 text-slate-700 font-medium border-r border-slate-200 min-w-0 whitespace-normal break-words">
        {item.kode}
      </td>
      <td className="px-4 py-3 text-slate-900 font-semibold border-r border-slate-200 min-w-0 whitespace-normal break-words">
        {item.nama}
      </td>
      <td className="px-4 py-3 text-slate-600 border-r border-slate-200 min-w-0">
        <span className="block truncate" title={item.keterangan || '-'}>
          {item.keterangan || '-'}
        </span>
      </td>
      <td className="px-4 py-3 text-center text-slate-700 border-r border-slate-200 min-w-0">
        {item.tingkat_min ? (
          <Badge color="blue" variant="soft" style={{ borderRadius: 0 }}>
            Tingkat {item.tingkat_min}
          </Badge>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>
      <td className="px-4 py-3 text-center text-slate-700 border-r border-slate-200 min-w-0">
        {item.tingkat_max ? (
          <Badge color="purple" variant="soft" style={{ borderRadius: 0 }}>
            Tingkat {item.tingkat_max}
          </Badge>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>
      <td className="px-4 py-3 text-center text-slate-700 border-r border-slate-200 min-w-0">
        {item.total_siswa > 0 ? (
          <Badge
            color="green"
            variant="soft"
            style={{ borderRadius: 0 }}
          >
            {item.total_siswa} siswa
          </Badge>
        ) : (
          <span className="text-slate-400">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-center border-r border-slate-200 min-w-0">
        <div className="flex justify-center items-center gap-2">
          <Switch
            checked={item.aktif}
            onCheckedChange={(checked) => {
              onToggleAktif(item)
            }}
            onClick={(e) => e.stopPropagation()}
            size="2"
            className="cursor-pointer"
          />
          <Badge 
            color={item.aktif ? 'green' : 'red'} 
            variant="solid" 
            style={{ borderRadius: 0 }}
            className="text-xs"
          >
            {item.aktif ? 'Aktif' : 'Non-Aktif'}
          </Badge>
        </div>
      </td>
      <td className="px-4 py-3 text-center min-w-0">
        <div className="flex justify-center gap-1 flex-wrap">
          <IconButton
            size="1"
            variant="soft"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetail(item)
            }}
            className="cursor-pointer hover:bg-slate-100 text-slate-700 border border-slate-200"
            style={{ borderRadius: 0 }}
            aria-label={`Detail ${item.nama}`}
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
            aria-label={`Edit ${item.nama}`}
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
            aria-label={`Hapus ${item.nama}`}
          >
            <TrashIcon />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}
