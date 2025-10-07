import { useState } from 'react'
import { Text, Button } from '@radix-ui/themes'
import { Plus } from 'lucide-react'
import { RincianTransaksiTable } from '../table/RincianTransaksiTable'
import { RincianTransaksiModal } from '../modals/RincianTransaksiModal'
import { formatCurrency } from '../../utils/currencyHelpers'

export function RincianPembayaranFormSection({
  rincianItems,
  totalPembayaran,
  onAdd,
  onChange,
  onRemove,
  summary,
  errors = {},
  disableAdd = false,
  getNextCicilanKe,
}) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editIndex, setEditIndex] = useState(null)
  const [editData, setEditData] = useState(null)

  const remainingRaw = summary ? summary.remainingRaw : null
  const sisaTagihan = summary ? summary.sisaTagihan : null
  const totalTagihan = summary ? summary.totalTagihan : null
  const totalDibayar = summary ? summary.totalDibayar : null

  const handleAddClick = () => {
    setEditIndex(null)
    setEditData(null)
    setModalOpen(true)
  }

  const handleEditClick = (index) => {
    setEditIndex(index)
    setEditData(rincianItems[index])
    setModalOpen(true)
  }

  const handleModalSubmit = (formData) => {
    if (editIndex !== null) {
      // Edit existing item
      Object.keys(formData).forEach(field => {
        onChange(editIndex, field, formData[field])
      })
    } else {
      // Add new item
      onAdd(formData)
    }
  }

  return (
    <>
      <div className="border-2 border-slate-300 bg-white shadow-lg flex-1 flex flex-col overflow-hidden">
        <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
          <div className="flex items-center justify-between gap-3">
            <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
              Rincian Transaksi Pembayaran
            </Text>
            <Button
              onClick={handleAddClick}
              size="2"
              style={{ borderRadius: 0 }}
              className="cursor-pointer"
              disabled={disableAdd}
            >
              <Plus className="h-4 w-4" />
              Tambah Transaksi
            </Button>
          </div>
        </div>
        <div className="p-4 space-y-4 flex-1 overflow-auto">
          <RincianTransaksiTable
            items={rincianItems}
            onEdit={handleEditClick}
            onDelete={onRemove}
          />

          {rincianItems.length > 0 && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <Text size="2" weight="bold" className="text-emerald-900">Total Pembayaran (halaman ini)</Text>
                <Text size="5" weight="bold" className="text-emerald-700">
                  {formatCurrency(totalPembayaran)}
                </Text>
              </div>

              {summary && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-emerald-200">
                  <div>
                    <Text size="1" className="text-slate-600">Total Tagihan</Text>
                    <Text size="2" weight="medium" className="text-slate-900">
                      {formatCurrency(totalTagihan)}
                    </Text>
                  </div>
                  <div>
                    <Text size="1" className="text-slate-600">Sudah Dibayar (setelah edit)</Text>
                    <Text size="2" weight="medium" className="text-emerald-800">
                      {formatCurrency(totalDibayar)}
                    </Text>
                  </div>
                  <div>
                    <Text size="1" className="text-slate-600">Sisa Tagihan</Text>
                    <Text size="2" weight="medium" className={remainingRaw < 0 ? 'text-orange-700' : 'text-slate-900'}>
                      {formatCurrency(sisaTagihan)}
                    </Text>
                  </div>
                </div>
              )}

              {summary && remainingRaw < 0 && (
                <Text size="1" className="text-orange-700">
                  Total pembayaran melebihi nilai tagihan sebesar {formatCurrency(Math.abs(remainingRaw))}. Pastikan nominal sudah benar.
                </Text>
              )}

              {summary && remainingRaw > 0 && (
                <Text size="1" className="text-blue-700">
                  Sisa tagihan setelah perubahan ini: {formatCurrency(remainingRaw)}
                </Text>
              )}
            </div>
          )}

          {errors.rincian && (
            <Text size="1" color="red" mt="2">
              {errors.rincian}
            </Text>
          )}
        </div>
      </div>

      <RincianTransaksiModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleModalSubmit}
        initialData={editData}
        isEdit={editIndex !== null}
        nextCicilanKe={getNextCicilanKe ? getNextCicilanKe() : 1}
      />
    </>
  )
}
