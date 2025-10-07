import { Badge, IconButton, Text, Switch } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Eye } from 'lucide-react'
import { formatDate } from '../utils/formatters'

export function TableRow({ 
  item, 
  index, 
  selectedItem, 
  onSelectItem, 
  onViewDetail, 
  onEdit, 
  onDelete,
  onToggleStatus 
}) {
  return (
    <tr
      onClick={() => onSelectItem(item)}
      className={`group cursor-pointer border-b border-slate-200 ${
        selectedItem?.id === item.id
          ? 'bg-blue-100 border-l-4 border-l-blue-600'
          : index % 2 === 0
            ? 'bg-white hover:bg-blue-50'
            : 'bg-slate-50 hover:bg-blue-50'
      }`}
    >
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="flex flex-col gap-0.5">
          <Text size="2" weight="medium" className="text-slate-900 font-sans">
            {item.wali_kelas?.nama_lengkap || '—'}
          </Text>
          {item.wali_kelas?.nip ? (
            <Text size="1" className="text-red-600 uppercase tracking-wide font-mono text-[0.65rem] font-semibold">
              NIP: {item.wali_kelas.nip}
            </Text>
          ) : (
            <Text size="1" className="text-slate-500 uppercase tracking-wide font-mono text-[0.65rem]">
              ID: {item.id?.slice(0, 8) ?? '—'}
            </Text>
          )}
        </div>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700 font-sans">
          {item.kelas ? `${item.kelas.tingkat} ${item.kelas.nama_sub_kelas}` : '—'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700 font-sans">
          {item.tahun_ajaran?.nama || '—'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700 font-sans">
          {formatDate(item.tanggal_mulai)}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700 font-sans">
          {formatDate(item.tanggal_selesai)}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div 
          className="flex items-center gap-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Switch
            checked={item.status === 'aktif'}
            onCheckedChange={() => onToggleStatus(item)}
            size="2"
            className="cursor-pointer focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
          <Badge
            variant="solid"
            color={item.status === 'aktif' ? 'green' : item.status === 'selesai' ? 'gray' : 'orange'}
            className="text-[0.7rem] font-semibold px-2"
            style={{ borderRadius: 0 }}
          >
            {item.status === 'aktif' ? '✓ Aktif' : item.status === 'selesai' ? '○ Selesai' : '🔄 Diganti'}
          </Badge>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <div className="flex justify-center gap-1">
          <IconButton
            size="1"
            variant="soft"
            onClick={(e) => {
              e.stopPropagation()
              onViewDetail && onViewDetail(item)
            }}
            className="cursor-pointer hover:bg-slate-100 text-slate-700 border border-slate-200"
            style={{ borderRadius: 0 }}
            aria-label={`Detail ${item.wali_kelas?.nama_lengkap}`}
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
            aria-label={`Edit ${item.wali_kelas?.nama_lengkap}`}
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
            aria-label={`Hapus ${item.wali_kelas?.nama_lengkap}`}
          >
            <TrashIcon />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}
