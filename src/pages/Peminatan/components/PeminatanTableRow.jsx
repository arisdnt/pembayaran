import { Edit2, Trash2, Power, PowerOff } from 'lucide-react'
import { Badge } from '@radix-ui/themes'

export function PeminatanTableRow({
  item,
  isSelected,
  onSelect,
  onEdit,
  onDelete,
  onToggleAktif,
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
      <td className="px-4 py-3 text-slate-700 font-medium border-r border-slate-200">
        {item.kode}
      </td>
      <td className="px-4 py-3 text-slate-900 font-semibold border-r border-slate-200">
        {item.nama}
      </td>
      <td className="px-4 py-3 text-slate-600 border-r border-slate-200 truncate" title={item.keterangan || '-'}>
        {item.keterangan || '-'}
      </td>
      <td className="px-4 py-3 text-center text-slate-700 border-r border-slate-200">
        {item.tingkat_min ? (
          <Badge color="blue" variant="soft" style={{ borderRadius: 0 }}>
            Tingkat {item.tingkat_min}
          </Badge>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>
      <td className="px-4 py-3 text-center text-slate-700 border-r border-slate-200">
        {item.tingkat_max ? (
          <Badge color="purple" variant="soft" style={{ borderRadius: 0 }}>
            Tingkat {item.tingkat_max}
          </Badge>
        ) : (
          <span className="text-slate-400">-</span>
        )}
      </td>
      <td className="px-4 py-3 text-center border-r border-slate-200">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onToggleAktif(item)
          }}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold transition-colors hover:opacity-80"
          style={{
            borderRadius: 0,
            backgroundColor: item.aktif ? '#22c55e' : '#ef4444',
            color: 'white',
          }}
        >
          {item.aktif ? (
            <>
              <Power className="h-3 w-3" />
              Aktif
            </>
          ) : (
            <>
              <PowerOff className="h-3 w-3" />
              Non-Aktif
            </>
          )}
        </button>
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
