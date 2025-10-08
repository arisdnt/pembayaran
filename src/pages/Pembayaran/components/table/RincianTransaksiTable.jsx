import { useState } from 'react'
import { Text, IconButton } from '@radix-ui/themes'
import { Edit2, Trash2, FileText, Image as ImageIcon } from 'lucide-react'
import { formatCurrency } from '../../utils/currencyHelpers'
import { BuktiPembayaranModal } from '../modals/BuktiPembayaranModal'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function getMetodePembayaranLabel(metode) {
  const labels = {
    transfer: 'Transfer Bank',
    tunai: 'Tunai',
    qris: 'QRIS',
    virtual_account: 'Virtual Account',
    kartu_kredit: 'Kartu Kredit',
    debit: 'Kartu Debit',
  }
  return labels[metode] || metode || '-'
}

function getFileNameFromUrl(url) {
  if (!url) return ''
  try {
    const urlObj = new URL(url)
    const pathParts = urlObj.pathname.split('/')
    const fileName = pathParts[pathParts.length - 1]
    // Remove timestamp prefix (format: {timestamp}_{filename})
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

export function RincianTransaksiTable({ items, onEdit, onDelete }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedBukti, setSelectedBukti] = useState(null)
  const [selectedNomor, setSelectedNomor] = useState(null)

  const handleViewBukti = (buktiUrl, nomorTransaksi) => {
    setSelectedBukti(buktiUrl)
    setSelectedNomor(nomorTransaksi)
    setModalOpen(true)
  }
  if (items.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <Text size="2">Belum ada rincian transaksi. Klik "Tambah Transaksi" untuk menambahkan.</Text>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-slate-100 border-b-2 border-slate-300">
            <th className="px-3 py-2 text-left">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                #
              </Text>
            </th>
            <th className="px-3 py-2 text-left">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Nomor Transaksi
              </Text>
            </th>
            <th className="px-3 py-2 text-right">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Jumlah
              </Text>
            </th>
            <th className="px-3 py-2 text-left">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Tanggal
              </Text>
            </th>
            <th className="px-3 py-2 text-left">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Metode
              </Text>
            </th>
            <th className="px-3 py-2 text-left">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Referensi
              </Text>
            </th>
            <th className="px-3 py-2 text-center">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Bukti
              </Text>
            </th>
            <th className="px-3 py-2 text-center">
              <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Aksi
              </Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <tr
              key={index}
              className="border-b border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <td className="px-3 py-3">
                <Text size="2" className="text-slate-600">
                  {index + 1}
                </Text>
              </td>
              <td className="px-3 py-3">
                <Text size="2" weight="medium" className="text-slate-900">
                  {item.nomor_transaksi || '-'}
                </Text>
                {item.cicilan_ke && (
                  <Text size="1" className="text-slate-500 block mt-0.5">
                    Cicilan ke-{item.cicilan_ke}
                  </Text>
                )}
              </td>
              <td className="px-3 py-3 text-right">
                <Text size="2" weight="bold" className="text-emerald-700">
                  {formatCurrency(parseFloat(item.jumlah_dibayar || 0))}
                </Text>
              </td>
              <td className="px-3 py-3">
                <Text size="2" className="text-slate-700">
                  {formatDate(item.tanggal_bayar)}
                </Text>
              </td>
              <td className="px-3 py-3">
                <Text size="2" className="text-slate-700">
                  {getMetodePembayaranLabel(item.metode_pembayaran)}
                </Text>
              </td>
              <td className="px-3 py-3">
                <Text size="2" className="text-slate-600 font-mono text-xs">
                  {item.referensi_pembayaran || '-'}
                </Text>
              </td>
              <td className="px-3 py-3">
                {item.bukti_pembayaran_url ? (
                  <button
                    onClick={() => handleViewBukti(item.bukti_pembayaran_url, item.nomor_transaksi)}
                    className="flex items-center gap-2 w-full text-left hover:bg-blue-50 transition-colors px-2 py-1 rounded group"
                  >
                    {getFileTypeFromUrl(item.bukti_pembayaran_url) === 'image' ? (
                      <ImageIcon className="h-4 w-4 text-blue-600 shrink-0" />
                    ) : (
                      <FileText className="h-4 w-4 text-blue-600 shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <Text size="1" className="text-blue-700 group-hover:text-blue-800 font-medium block truncate">
                        {getFileNameFromUrl(item.bukti_pembayaran_url)}
                      </Text>
                      <Text size="1" className="text-slate-500 block">
                        Klik untuk preview
                      </Text>
                    </div>
                  </button>
                ) : (
                  <Text size="1" className="text-slate-400 text-center block">
                    -
                  </Text>
                )}
              </td>
              <td className="px-3 py-3">
                <div className="flex items-center justify-center gap-1">
                  <IconButton
                    size="1"
                    variant="ghost"
                    color="blue"
                    onClick={() => onEdit(index)}
                    className="cursor-pointer"
                    aria-label="Edit transaksi"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </IconButton>
                  <IconButton
                    size="1"
                    variant="ghost"
                    color="red"
                    onClick={() => onDelete(index)}
                    className="cursor-pointer"
                    aria-label="Hapus transaksi"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </IconButton>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal Preview Bukti Pembayaran */}
      <BuktiPembayaranModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        buktiUrl={selectedBukti}
        nomorTransaksi={selectedNomor}
      />
    </div>
  )
}
