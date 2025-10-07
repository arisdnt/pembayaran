import { Calendar, Eye } from 'lucide-react'
import { Badge, IconButton } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

export function PeminatanSiswaTableRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onViewDetail,
  groupColors,
}) {
  const rowBgClass = isSelected
    ? groupColors.selected
    : `${groupColors.bg} ${groupColors.hover}`

  return (
    <tr
      onClick={() => onSelect(item)}
      className={`${rowBgClass} border-b border-slate-200 transition-colors cursor-pointer`}
    >
      <td className="px-4 py-3 text-slate-900 font-semibold border-r border-slate-200">
        {item.siswa?.nama_lengkap || '-'}
      </td>
      <td className="px-4 py-3 text-slate-600 border-r border-slate-200 font-mono text-xs">
        {item.siswa?.nisn || '-'}
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="flex flex-col gap-1">
          <span className="text-slate-900 font-medium">{item.peminatan?.nama || '-'}</span>
          <span className="text-slate-500 text-xs">{item.peminatan?.kode || '-'}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-slate-700 border-r border-slate-200">
        {item.tahun_ajaran?.nama || '-'}
      </td>
      <td className="px-4 py-3 text-center border-r border-slate-200">
        {item.tingkat ? (
          <Badge color="indigo" variant="soft" style={{ borderRadius: 0 }}>
            Tingkat {item.tingkat}
          </Badge>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>
      <td className="px-4 py-3 text-center text-slate-700 border-r border-slate-200">
        <div className="flex items-center justify-center gap-1">
          <Calendar className="h-3 w-3 text-green-600" />
          <span className="text-xs">{formatDate(item.tanggal_mulai)}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-center text-slate-700 border-r border-slate-200">
        {item.tanggal_selesai ? (
          <div className="flex items-center justify-center gap-1">
            <Calendar className="h-3 w-3 text-red-600" />
            <span className="text-xs">{formatDate(item.tanggal_selesai)}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs">Berlangsung</span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
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
            aria-label={`Detail ${item.siswa?.nama_lengkap || 'peminatan siswa'}`}
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
            aria-label={`Edit ${item.siswa?.nama_lengkap || 'peminatan siswa'}`}
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
            aria-label={`Hapus ${item.siswa?.nama_lengkap || 'peminatan siswa'}`}
          >
            <TrashIcon />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}
