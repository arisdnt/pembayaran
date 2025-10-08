import { Text, IconButton } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Eye, FileText, Image as ImageIcon, Copy } from 'lucide-react'
import { formatDateTime } from '../../utils/dateHelpers'
import { useState } from 'react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

function getFileNameFromUrl(url) {
  if (!url) return ''
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]
    const parts = fileName.split('_')
    if (parts.length > 1 && /^\d+$/.test(parts[0])) {
      return decodeURIComponent(parts.slice(1).join('_'))
    }
    return decodeURIComponent(fileName)
  } catch {
    return 'bukti_pembayaran'
  }
}

function getFileTypeFromUrl(url) {
  if (!url) return null
  const extension = url.split('.').pop()?.toLowerCase()
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) {
    return 'image'
  } else if (extension === 'pdf') {
    return 'pdf'
  }
  return 'file'
}

export function PembayaranTableRow({ item, index, onEdit, onDelete, onViewDetail, onViewBukti }) {
  const isEven = index % 2 === 0
  const [copiedBukti, setCopiedBukti] = useState(false)

  const handleCopyBukti = async (buktiUrl) => {
    try {
      await navigator.clipboard.writeText(buktiUrl)
      setCopiedBukti(true)
      setTimeout(() => setCopiedBukti(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <tr
      className={`border-b border-slate-200 ${
        isEven
          ? 'bg-white hover:bg-slate-50'
          : 'bg-slate-50 hover:bg-slate-100'
      }`}
    >
      <td className="px-4 py-3 border-r border-slate-200 w-28">
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
      <td className="px-4 py-3 border-r border-slate-200 w-32">
        <Text size="2" className="text-slate-700">
          {item.tahun_ajaran_tagihan?.nama || '—'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200 w-32">
        <Text size="2" className="text-slate-700">
          {item.kelas_tagihan ? `${item.kelas_tagihan.tingkat} ${item.kelas_tagihan.nama_sub_kelas}` : '—'}
        </Text>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {item.catatan || '—'}
        </Text>
      </td>
      {/* Total Tagihan */}
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" weight="medium" className="text-slate-800">
          {formatCurrency(item.total_tagihan || 0)}
        </Text>
      </td>

      {/* Sudah Dibayar (Historis) */}

      <td className="px-4 py-3 border-r border-slate-200 w-56">
        <div className="space-y-1">
          <Text size="2" weight="bold" className="text-blue-700 block">
            {formatCurrency(item.total_dibayar || 0)}
          </Text>
          {item.total_dibayar_sebelumnya > 0 && (
            <Text size="1" className="text-red-600 block">
              Sebelumnya: {formatCurrency(item.total_dibayar_sebelumnya)}
            </Text>
          )}
        </div>
      </td>

      {/* Sisa Tagihan */}
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="space-y-1">
          <Text 
            size="2" 
            weight="bold" 
            className={
              item.sisa_tagihan <= 0 
                ? "text-green-700" 
                : item.sisa_tagihan < (item.total_tagihan || 0) / 2 
                  ? "text-orange-600" 
                  : "text-red-600"
            }
          >
            {formatCurrency(item.sisa_tagihan || 0)}
          </Text>
          {item.sisa_tagihan <= 0 && (
            <Text size="1" className="text-green-600 block font-medium">
              ✓ LUNAS
            </Text>
          )}
        </div>
      </td>

      {/* Bukti Pembayaran */}
      <td className="px-4 py-3 border-r border-slate-200 w-32">
        {(() => {
          // Get first rincian with bukti_pembayaran_url
          const rincianWithBukti = item.rincian_pembayaran?.find(r => r.bukti_pembayaran_url)
          
          if (!rincianWithBukti?.bukti_pembayaran_url) {
            return (
              <Text size="1" className="text-slate-400">
                -
              </Text>
            )
          }

          const buktiUrl = rincianWithBukti.bukti_pembayaran_url
          const nomorTransaksi = rincianWithBukti.nomor_transaksi
          const fileType = getFileTypeFromUrl(buktiUrl)
          const fileName = getFileNameFromUrl(buktiUrl)

          return (
            <div className="flex items-center gap-1">
              <button
                onClick={() => onViewBukti(buktiUrl, nomorTransaksi)}
                className="flex items-center gap-2 hover:bg-blue-50 transition-colors px-2 py-1 rounded group flex-1 min-w-0"
              >
                {fileType === 'image' ? (
                  <ImageIcon className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                ) : (
                  <FileText className="h-3.5 w-3.5 text-blue-600 shrink-0" />
                )}
                <div className="flex-1 min-w-0 text-left">
                  <Text size="1" className="text-blue-700 group-hover:text-blue-800 font-medium block truncate">
                    {fileName}
                  </Text>
                </div>
              </button>
              <button
                onClick={() => handleCopyBukti(buktiUrl)}
                className="p-1 hover:bg-slate-100 rounded transition-colors"
                title={copiedBukti ? "Tersalin!" : "Salin link"}
              >
                <Copy className={`h-3.5 w-3.5 ${copiedBukti ? 'text-green-600' : 'text-slate-600'}`} />
              </button>
            </div>
          )
        })()}
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <Text size="2" className="text-slate-700">
          {formatDateTime(item.diperbarui_pada)}
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
