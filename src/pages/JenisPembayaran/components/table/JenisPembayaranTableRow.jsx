import { Badge, Text, Switch } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Eye } from 'lucide-react'
import { formatCurrency } from '../../utils/currencyFormatter'

export function JenisPembayaranTableRow({ item, index, onEdit, onDelete, onViewDetail, onToggleStatus, selectedItem, onSelectItem }) {
  const isSelected = selectedItem?.id === item.id
  const isEven = index % 2 === 0

  return (
    <tr
      onClick={() => onSelectItem(item)}
      className={`border-b border-slate-200 cursor-pointer ${
        isSelected
          ? 'bg-blue-100 border-l-4 border-l-blue-600'
          : isEven
          ? 'bg-white hover:bg-blue-50'
          : 'bg-slate-50 hover:bg-blue-50'
      }`}
    >
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" weight="medium" className="text-slate-900 font-mono uppercase">
          {item.kode}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" weight="medium" className="text-slate-900">
          {item.nama}
        </Text>
        {item.deskripsi && (
          <Text size="1" className="text-slate-500 line-clamp-1 mt-0.5">
            {item.deskripsi}
          </Text>
        )}
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" weight="medium" className="text-slate-700">
          {formatCurrency(item.jumlah_default)}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">{item.tahun_ajaran?.nama || '—'}</Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {item.tingkat ? `Kelas ${item.tingkat}` : 'Semua Tingkat'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {item.kelas ? `Kelas ${item.kelas.tingkat} ${item.kelas.nama_sub_kelas}` : 'Semua Kelas'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {item.peminatan ? `${item.peminatan.kode} - ${item.peminatan.nama}` : 'Semua Peminatan'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Badge
          variant="soft"
          color={item.wajib ? 'red' : 'gray'}
          style={{ borderRadius: 0 }}
          className="text-xs"
        >
          {item.wajib ? 'Wajib' : 'Opsional'}
        </Badge>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div 
          className="flex items-center gap-2.5"
          onClick={(e) => e.stopPropagation()}
        >
          <Switch
            checked={item.status_aktif}
            onCheckedChange={() => onToggleStatus(item.id, item.status_aktif)}
            size="2"
            className="cursor-pointer focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{ outline: 'none', boxShadow: 'none' }}
          />
          <Badge
            variant="solid"
            color={item.status_aktif ? 'green' : 'gray'}
            className="text-[0.7rem] font-semibold px-2"
            style={{ borderRadius: 0 }}
          >
            {item.status_aktif ? '✓ Aktif' : '○ Nonaktif'}
          </Badge>
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation()
              onViewDetail(item)
            }}
            className="h-7 w-7 flex items-center justify-center border border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-400 transition-colors"
            title="Lihat Detail"
            type="button"
          >
            <Eye className="h-3.5 w-3.5 text-slate-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onEdit(item)
            }}
            className="h-7 w-7 flex items-center justify-center border border-slate-300 bg-white hover:bg-amber-50 hover:border-amber-400 transition-colors"
            title="Edit"
            type="button"
          >
            <Pencil1Icon className="h-3.5 w-3.5 text-slate-600" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete(item)
            }}
            className="h-7 w-7 flex items-center justify-center border border-slate-300 bg-white hover:bg-red-50 hover:border-red-400 transition-colors"
            title="Hapus"
            type="button"
          >
            <TrashIcon className="h-3.5 w-3.5 text-slate-600" />
          </button>
        </div>
      </td>
    </tr>
  )
}
