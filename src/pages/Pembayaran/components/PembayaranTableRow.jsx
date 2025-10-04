import { Text } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Eye } from 'lucide-react'
import { formatDateTime } from '../utils/dateHelpers'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

export function PembayaranTableRow({ item, index, isSelected, onSelect, onEdit, onDelete, onViewDetail }) {
  const isEven = index % 2 === 0

  return (
    <tr
      onClick={() => onSelect(item)}
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
          {item.nomor_pembayaran || '—'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" weight="medium" className="text-slate-900">
          {item.tagihan?.judul || '—'}
        </Text>
        {item.tagihan?.nomor_tagihan && (
          <Text size="1" className="text-slate-500 line-clamp-1 mt-0.5">
            {item.tagihan.nomor_tagihan}
          </Text>
        )}
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div>
          <Text size="2" weight="medium" className="text-slate-900 block">
            {item.tagihan?.riwayat_kelas_siswa?.siswa?.nama_lengkap || '—'}
          </Text>
          {item.tagihan?.riwayat_kelas_siswa?.siswa?.nisn && (
            <Text size="1" className="text-red-600 font-mono block mt-0.5">
              NISN: {item.tagihan.riwayat_kelas_siswa.siswa.nisn}
            </Text>
          )}
        </div>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {item.catatan || '—'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {formatDateTime(item.tanggal_dibuat)}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" weight="bold" className="text-green-700">
          {formatCurrency(item.total_dibayar)}
        </Text>
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
