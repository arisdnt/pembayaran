import { Badge, Text } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Eye } from 'lucide-react'
import { formatCurrency } from '../utils/currencyFormatter'
import { getTipeBadgeColor } from '../utils/badgeHelper'

export function JenisPembayaranTableRow({ item, onEdit, onDelete, onViewDetail, selectedItem, onSelectItem }) {
  const isSelected = selectedItem?.id === item.id

  return (
    <tr 
      onClick={() => onSelectItem(item)}
      className={`group cursor-pointer border-b border-slate-200 ${
        isSelected
          ? 'bg-blue-100 border-l-4 border-l-blue-600'
          : 'bg-white hover:bg-blue-50'
      }`}
    >
      <td className="px-6 py-4 align-middle">
        <Text size="2" weight="bold" className="text-slate-900 font-mono uppercase">
          {item.kode}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" weight="medium" className="text-slate-900">
          {item.nama}
        </Text>
        {item.deskripsi && (
          <Text size="1" className="text-slate-500 line-clamp-1 mt-0.5">
            {item.deskripsi}
          </Text>
        )}
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" weight="medium" className="text-slate-700">
          {formatCurrency(item.jumlah_default)}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Badge
          variant="soft"
          color={getTipeBadgeColor(item.tipe_pembayaran)}
          className="text-xs capitalize"
        >
          {item.tipe_pembayaran}
        </Badge>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="text-[13px] text-slate-700">{item.tahun_ajaran?.nama || '—'}</div>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="text-[13px] text-slate-700">
          {item.tingkat ? `Kelas ${item.tingkat}` : '—'}
        </div>
      </td>
      <td className="px-6 py-4 align-middle">
        <Badge
          variant="soft"
          color={item.wajib ? 'red' : 'gray'}
          className="text-xs"
        >
          {item.wajib ? 'Wajib' : 'Opsional'}
        </Badge>
      </td>
      <td className="px-6 py-4 align-middle">
        <Badge
          variant="soft"
          color={item.status_aktif ? 'green' : 'gray'}
          className="text-xs"
        >
          {item.status_aktif ? 'Aktif' : 'Nonaktif'}
        </Badge>
      </td>
      <td className="px-6 py-4 align-middle text-center">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewDetail(item)
            }}
            className="p-1.5 hover:bg-blue-100 text-blue-600 transition-colors border border-transparent hover:border-blue-300"
            aria-label="Lihat Detail"
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
            aria-label="Edit"
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
            aria-label="Hapus"
            title="Hapus"
          >
            <TrashIcon className="h-3.5 w-3.5" />
          </button>
        </div>
      </td>
    </tr>
  )
}
