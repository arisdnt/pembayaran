import { Text, Badge, IconButton } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Eye } from 'lucide-react'
import { formatDate, formatCurrency } from '../utils/formatters'

export function TableRow({ item, index, selectedItem, onSelectItem, onViewDetail, onEdit, onDelete }) {
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
        <Text size="2" weight="medium" className="text-slate-900 font-mono">
          {item.nomor_tagihan || '—'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" weight="medium" className="text-slate-900">
          {item.judul || '—'}
        </Text>
        {item.deskripsi && (
          <Text size="1" className="text-slate-500 line-clamp-1 mt-0.5">
            {item.deskripsi}
          </Text>
        )}
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div>
          <Text size="2" weight="medium" className="text-slate-900 block">
            {item.riwayat_kelas_siswa?.siswa?.nama_lengkap || '—'}
          </Text>
          {item.riwayat_kelas_siswa?.siswa?.nisn && (
            <Text size="1" className="text-red-600 font-mono block mt-0.5">
              NISN: {item.riwayat_kelas_siswa.siswa.nisn}
            </Text>
          )}
        </div>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {item.riwayat_kelas_siswa?.kelas
            ? `${item.riwayat_kelas_siswa.kelas.tingkat} ${item.riwayat_kelas_siswa.kelas.nama_sub_kelas}`
            : '—'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div>
          <Text size="2" weight="bold" className="text-slate-900 block">
            {formatCurrency(item.total_tagihan)}
          </Text>
          {item.rincian_tagihan && item.rincian_tagihan.length > 0 && (
            <Text size="1" className="text-red-600 block mt-0.5">
              {item.rincian_tagihan.length} item
            </Text>
          )}
        </div>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" weight="bold" className="text-green-700">
          {formatCurrency(item.total_dibayar || 0)}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" weight="bold" className={item.kekurangan > 0 ? "text-red-600" : "text-green-600"}>
          {formatCurrency(item.kekurangan || 0)}
        </Text>
        {item.kekurangan <= 0 && (
          <Badge color="green" variant="soft" size="1" style={{ borderRadius: 0 }} className="mt-1">
            LUNAS
          </Badge>
        )}
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {formatDate(item.tanggal_tagihan)}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {formatDate(item.tanggal_jatuh_tempo)}
        </Text>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-center gap-1">
          {onViewDetail && (
            <IconButton
              size="1"
              variant="soft"
              onClick={(e) => {
                e.stopPropagation()
                onViewDetail(item)
              }}
              className="cursor-pointer hover:bg-slate-100 text-slate-700 border border-slate-200"
              style={{ borderRadius: 0 }}
            >
              <Eye className="h-3.5 w-3.5" />
            </IconButton>
          )}
          <IconButton
            size="1"
            variant="soft"
            onClick={(e) => {
              e.stopPropagation()
              onEdit(item)
            }}
            className="cursor-pointer hover:bg-blue-100 text-blue-700 border border-blue-200"
            style={{ borderRadius: 0 }}
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
          >
            <TrashIcon />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}
