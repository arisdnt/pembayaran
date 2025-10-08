import { Text, IconButton } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Eye } from 'lucide-react'
import { formatDateTime } from '../../utils/dateHelpers'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

export function PembayaranTableRow({ item, index, onEdit, onDelete, onViewDetail }) {
  const isEven = index % 2 === 0

  return (
    <tr
      className={`border-b border-slate-200 ${
        isEven
          ? 'bg-white hover:bg-slate-50'
          : 'bg-slate-50 hover:bg-slate-100'
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
          {item.tahun_ajaran_tagihan?.nama || '—'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {item.kelas_tagihan ? `${item.kelas_tagihan.tingkat} ${item.kelas_tagihan.nama_sub_kelas}` : '—'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {item.catatan || '—'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {formatDateTime(item.diperbarui_pada)}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" weight="bold" className="text-green-700">
          {formatCurrency(item.total_dibayar)}
        </Text>
      </td>
      <td className="px-4 py-3">
        <div className="flex justify-center gap-1">
          <IconButton
            size="1"
            variant="soft"
            onClick={() => onViewDetail(item)}
            className="cursor-pointer hover:bg-slate-100 text-slate-700 border border-slate-200"
            style={{ borderRadius: 0 }}
            aria-label={`Detail ${item.nomor_pembayaran}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton
            size="1"
            variant="soft"
            onClick={() => onEdit(item)}
            className="cursor-pointer hover:bg-blue-100 text-blue-700 border border-blue-200"
            style={{ borderRadius: 0 }}
            aria-label={`Edit ${item.nomor_pembayaran}`}
          >
            <Pencil1Icon />
          </IconButton>
          <IconButton
            size="1"
            variant="soft"
            onClick={() => onDelete(item)}
            className="cursor-pointer hover:bg-red-100 text-red-700 border border-red-200"
            style={{ borderRadius: 0 }}
            aria-label={`Hapus ${item.nomor_pembayaran}`}
          >
            <TrashIcon />
          </IconButton>
        </div>
      </td>
    </tr>
  )
}
