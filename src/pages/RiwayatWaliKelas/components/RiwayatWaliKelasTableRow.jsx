import { Badge, IconButton, Text } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { formatDate, getStatusBadgeColor, getStatusLabel } from '../utils/helpers'

export function RiwayatWaliKelasTableRow({ item, isSelected, onSelect, onEdit, onDelete }) {
  return (
    <tr
      onClick={() => onSelect(item)}
      className={`group transition-colors cursor-pointer ${
        isSelected ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-indigo-50/40'
      }`}
    >
      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col gap-1">
          <Text size="3" weight="medium" className="text-slate-900">
            {item.wali_kelas?.nama_lengkap || '—'}
          </Text>
          {item.wali_kelas?.nip && (
            <Text size="1" className="text-slate-500 uppercase tracking-wider font-mono">
              NIP: {item.wali_kelas.nip}
            </Text>
          )}
        </div>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" className="text-slate-700">
          {item.kelas ? `${item.kelas.tingkat} ${item.kelas.nama_sub_kelas}` : '—'}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" className="text-slate-700">
          {item.tahun_ajaran?.nama || '—'}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" className="text-slate-700">
          {formatDate(item.tanggal_mulai)}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" className="text-slate-700">
          {formatDate(item.tanggal_selesai)}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <Badge
          variant="soft"
          color={getStatusBadgeColor(item.status)}
          className="text-xs"
        >
          {getStatusLabel(item.status)}
        </Badge>
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
