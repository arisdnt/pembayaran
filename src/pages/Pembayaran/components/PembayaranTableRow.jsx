import { Text } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Clock, Eye, DollarSign } from 'lucide-react'
import { formatDateTime } from '../utils/dateHelpers'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

export function PembayaranTableRow({ item, isSelected, onSelect, onEdit, onDelete, onViewDetail }) {
  return (
    <tr
      onClick={() => onSelect(item)}
      className={`group cursor-pointer border-b border-slate-200 ${
        isSelected
          ? 'bg-blue-100 border-l-4 border-l-blue-600'
          : 'bg-white hover:bg-blue-50'
      }`}
    >
      <td className="px-6 py-4 align-middle">
        <Text size="2" weight="bold" className="text-slate-900 font-mono">
          {item.nomor_pembayaran || '—'}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col gap-0.5">
          <Text size="2" weight="medium" className="text-slate-900 line-clamp-1">
            {item.tagihan?.judul || '—'}
          </Text>
          {item.tagihan?.nomor_tagihan && (
            <Text size="1" className="text-slate-500 font-mono">
              {item.tagihan.nomor_tagihan}
            </Text>
          )}
        </div>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex flex-col gap-0.5">
          <Text size="2" className="text-slate-700">
            {item.tagihan?.riwayat_kelas_siswa?.siswa?.nama_lengkap || '—'}
          </Text>
          {item.tagihan?.riwayat_kelas_siswa?.siswa?.nisn && (
            <Text size="1" className="text-slate-500 font-mono">
              {item.tagihan.riwayat_kelas_siswa.siswa.nisn}
            </Text>
          )}
        </div>
      </td>
      <td className="px-6 py-4 align-middle">
        <Text size="2" className="text-slate-700 line-clamp-2">
          {item.catatan || '—'}
        </Text>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex items-center gap-2 text-slate-600">
          <Clock className="h-4 w-4 text-slate-400" />
          <Text size="1">
            {formatDateTime(item.tanggal_dibuat)}
          </Text>
        </div>
      </td>
      <td className="px-6 py-4 align-middle">
        <div className="flex items-center gap-2">
          <DollarSign className="h-4 w-4 text-green-600" />
          <Text size="2" weight="bold" className="text-green-700 font-mono">
            {formatCurrency(item.total_dibayar)}
          </Text>
        </div>
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
