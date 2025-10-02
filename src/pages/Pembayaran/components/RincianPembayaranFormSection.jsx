import { useState } from 'react'
import { Text, Button } from '@radix-ui/themes'
import { DollarSign, Plus } from 'lucide-react'
import { TransaksiPembayaranModal } from './TransaksiPembayaranModal'
import { RincianPembayaranTable } from './RincianPembayaranTable'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

export function RincianPembayaranFormSection({
  rincianItems,
  onAdd,
  onRemove,
  onChange,
  totalPembayaran,
  nextCicilanKe,
  tagihanSummary
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [modalInitialData, setModalInitialData] = useState(null)

  const handleAddClick = () => {
    setEditIndex(null)
    setModalInitialData(null)
    setModalOpen(true)
  }

  const handleEditClick = (index) => {
    setEditIndex(index)
    setModalInitialData(rincianItems[index])
    setModalOpen(true)
  }

  const handleModalSubmit = (formData) => {
    if (editIndex !== null) {
      // Edit existing
      Object.keys(formData).forEach(key => {
        onChange(editIndex, key, formData[key])
      })
    } else {
      // Add new
      onAdd(formData)
    }
  }

  return (
    <>
      <div className="border-2 border-slate-300 bg-white shadow-lg flex-1 overflow-hidden flex flex-col">
        <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-slate-600" />
              <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Rincian Transaksi Pembayaran
              </Text>
            </div>
            <Button
              onClick={handleAddClick}
              size="1"
              style={{ borderRadius: 0 }}
              className="cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambah Transaksi
            </Button>
          </div>
        </div>

        {tagihanSummary && (
          <div className="shrink-0 px-4 py-3 bg-blue-50 border-b-2 border-blue-200">
            <div className="flex items-center justify-between">
              <Text size="2" className="text-blue-700">
                <strong>Info:</strong> Cicilan berikutnya ke-{nextCicilanKe}
              </Text>
              <Text size="2" className="text-blue-700">
                Sisa tagihan: <strong>{formatCurrency(tagihanSummary.sisa)}</strong>
              </Text>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-auto p-4">
          {rincianItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <DollarSign className="h-16 w-16 text-slate-300 mb-4" />
              <Text size="3" className="text-slate-500 mb-2">
                Belum ada transaksi pembayaran
              </Text>
              <Text size="2" className="text-slate-400 mb-4">
                Klik tombol "Tambah Transaksi" untuk menambahkan transaksi pembayaran
              </Text>
              <Button
                onClick={handleAddClick}
                size="2"
                style={{ borderRadius: 0 }}
                className="cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                Tambah Transaksi Pertama
              </Button>
            </div>
          ) : (
            <RincianPembayaranTable
              rincianItems={rincianItems}
              onEdit={handleEditClick}
              onRemove={onRemove}
              nextCicilanKe={nextCicilanKe}
            />
          )}
        </div>

        {/* Footer Total */}
        {rincianItems.length > 0 && (
          <div className="shrink-0 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-white px-4 py-3">
            <div className="flex items-center justify-between">
              <Text size="3" weight="bold" className="text-slate-700">
                Total Pembayaran:
              </Text>
              <Text size="5" weight="bold" className="text-green-600 font-mono">
                {formatCurrency(totalPembayaran)}
              </Text>
            </div>
            {tagihanSummary && totalPembayaran > tagihanSummary.sisa && (
              <div className="mt-2 px-3 py-2 bg-amber-50 border-2 border-amber-200">
                <Text size="1" className="text-amber-700">
                  ⚠️ Peringatan: Total pembayaran melebihi sisa tagihan ({formatCurrency(tagihanSummary.sisa)})
                </Text>
              </div>
            )}
          </div>
        )}
      </div>

      <TransaksiPembayaranModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleModalSubmit}
        initialData={modalInitialData}
        isEdit={editIndex !== null}
        cicilanKe={editIndex !== null ? nextCicilanKe + editIndex : nextCicilanKe}
      />
    </>
  )
}
