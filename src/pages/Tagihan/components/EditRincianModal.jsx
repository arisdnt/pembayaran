import { useState, useEffect } from 'react'
import { Text, TextField, Badge } from '@radix-ui/themes'
import { Edit, Save, X } from 'lucide-react'

function formatCurrency(value) {
  if (!value) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

export function EditRincianModal({
  open,
  onOpenChange,
  item,
  jenisPembayaranList,
  onUpdateItem
}) {
  const [deskripsi, setDeskripsi] = useState('')
  const [jumlah, setJumlah] = useState('')

  const jenis = jenisPembayaranList?.find(j => j.id === item?.id_jenis_pembayaran)

  const handleSave = () => {
    if (!jumlah) return

    const updatedItem = {
      ...item,
      deskripsi: deskripsi,
      jumlah: jumlah,
    }

    onUpdateItem(updatedItem)
    onOpenChange(false)
  }

  const handleCancel = () => {
    // Reset form to original values
    if (item) {
      setDeskripsi(item.deskripsi || '')
      setJumlah(item.jumlah?.toString() || '')
    }
    onOpenChange(false)
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  // Initialize form when modal opens with item
  useEffect(() => {
    if (open && item) {
      setDeskripsi(item.deskripsi || '')
      setJumlah(item.jumlah?.toString() || '')
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, item])

  if (!open || !item) return null

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        {/* Modal Content - Consistent with system design */}
        <div className="bg-white border-2 border-slate-300 shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header - Consistent with system design */}
          <div className="bg-gradient-to-b from-slate-100 to-slate-50 border-b-2 border-slate-300 px-6 py-4 shrink-0">
            <div className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-amber-600" />
              <Text size="4" weight="bold" className="text-slate-900">
                Edit Item Tagihan
              </Text>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {/* Item Info - Consistent with system design */}
            <div className="border-2 border-slate-300 bg-white shadow-sm">
              <div className="bg-gradient-to-b from-amber-100 to-amber-50 border-b-2 border-amber-300 px-4 py-3">
                <div className="flex items-center gap-2 mb-2">
                  <Badge color="blue">{jenis?.kode || '-'}</Badge>
                  <Text size="2" weight="bold" className="text-slate-900">{jenis?.nama || 'Jenis Pembayaran'}</Text>
                </div>
                <Text size="1" className="text-amber-700">
                  Default: {formatCurrency(jenis?.jumlah_default)}
                </Text>
              </div>

              {/* Edit Form */}
              <div className="p-4 space-y-4">
                <div>
                  <Text size="2" weight="medium" className="mb-2 block text-slate-700">Deskripsi Item</Text>
                  <TextField.Root
                    value={deskripsi}
                    onChange={(e) => setDeskripsi(e.target.value)}
                    placeholder="Deskripsi item tagihan"
                    className="w-full"
                  />
                </div>

                <div>
                  <Text size="2" weight="medium" className="mb-2 block text-slate-700">Jumlah Tagihan</Text>
                  <TextField.Root
                    type="number"
                    value={jumlah}
                    onChange={(e) => setJumlah(e.target.value)}
                    placeholder="0"
                    min="0"
                    step="1000"
                    className="w-full"
                  />
                  {jumlah && (
                    <Text size="2" weight="medium" className="text-emerald-700 font-mono mt-2 block">
                      {formatCurrency(parseFloat(jumlah) || 0)}
                    </Text>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer - Consistent with system design */}
          <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-4 shrink-0">
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                type="button"
              >
                <X className="h-4 w-4 text-slate-600" />
                <Text size="2" weight="medium" className="text-slate-700">
                  Batal
                </Text>
              </button>
              <button
                onClick={handleSave}
                disabled={!jumlah}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                type="button"
              >
                <Save className="h-4 w-4" />
                <Text size="2" weight="medium" className="text-white">
                  Simpan Perubahan
                </Text>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}