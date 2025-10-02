import { IconButton, Text } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { formatCurrency, formatDateTime } from '../utils/helpers'

export function RincianTagihanTableRow({ item, isSelected, onSelect, onEdit, onDelete }) {
  return (
    <tr
      onClick={() => onSelect(item)}
      className={`group transition-colors cursor-pointer ${
        isSelected ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-indigo-50/40'
      }`}
    >
      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col gap-0.5">
          <Text size="2" weight="medium" className="text-slate-900 font-mono">
            {item.tagihan?.nomor_tagihan || '—'}
          </Text>
          {item.tagihan?.judul && (
            <Text size="1" className="text-slate-500 line-clamp-1">
              {item.tagihan.judul}
            </Text>
          )}
        </div>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col gap-0.5">
          <Text size="2" weight="medium" className="text-slate-900 uppercase font-mono">
            {item.jenis_pembayaran?.kode || '—'}
          </Text>
          <Text size="1" className="text-slate-500">
            {item.jenis_pembayaran?.nama || '—'}
          </Text>
        </div>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" weight="bold" className="text-emerald-700">
          {formatCurrency(item.jumlah)}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" className="text-slate-700 line-clamp-2">
          {item.deskripsi || '—'}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="1" className="text-slate-600">
          {formatDateTime(item.tanggal_dibuat)}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" className="text-slate-700 font-mono text-center">
          {item.urutan}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex justify-end gap-2">
          <IconButton
            size="1"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(item)
            }}
            className="cursor-pointer hover:bg-blue-50 text-blue-600"
            aria-label="Edit"
          >
            <Pencil1Icon />
          </IconButton>
          <IconButton
            size="1"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation()
              onDelete(item)
            }}
            className="cursor-pointer hover:bg-red-50 text-red-600"
            aria-label="Hapus"
          >
            <TrashIcon />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}
