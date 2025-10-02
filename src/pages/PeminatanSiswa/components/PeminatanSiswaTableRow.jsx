import { Edit2, Trash2, Calendar } from 'lucide-react'
import { Badge } from '@radix-ui/themes'

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
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(item)
            }}
            className="p-1.5 hover:bg-amber-100 text-amber-600 transition-colors border border-amber-300"
            style={{ borderRadius: 0 }}
            title="Edit"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(item)
            }}
            className="p-1.5 hover:bg-red-100 text-red-600 transition-colors border border-red-300"
            style={{ borderRadius: 0 }}
            title="Hapus"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  )
}
