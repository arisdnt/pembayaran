import { useState, useEffect } from 'react'
import { Dialog, Text, TextField, TextArea, Select, Button } from '@radix-ui/themes'
import { X } from 'lucide-react'

export function RincianTransaksiModal({
  open,
  onOpenChange,
  onSubmit,
  initialData = null,
  isEdit = false,
  nextCicilanKe = 1
}) {
  const [formData, setFormData] = useState({
    nomor_transaksi: '',
    jumlah_dibayar: '',
    tanggal_bayar: new Date().toISOString().split('T')[0],
    metode_pembayaran: 'transfer',
    referensi_pembayaran: '',
    catatan: '',
    cicilan_ke: nextCicilanKe,
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({
          nomor_transaksi: initialData.nomor_transaksi || '',
          jumlah_dibayar: initialData.jumlah_dibayar !== null && initialData.jumlah_dibayar !== undefined
            ? String(initialData.jumlah_dibayar)
            : '',
          tanggal_bayar: initialData.tanggal_bayar ? initialData.tanggal_bayar.split('T')[0] : new Date().toISOString().split('T')[0],
          metode_pembayaran: initialData.metode_pembayaran || 'transfer',
          referensi_pembayaran: initialData.referensi_pembayaran || '',
          catatan: initialData.catatan || '',
          cicilan_ke: initialData.cicilan_ke || nextCicilanKe,
        })
      } else {
        setFormData({
          nomor_transaksi: '',
          jumlah_dibayar: '',
          tanggal_bayar: new Date().toISOString().split('T')[0],
          metode_pembayaran: 'transfer',
          referensi_pembayaran: '',
          catatan: '',
          cicilan_ke: nextCicilanKe,
        })
      }
      setErrors({})
    }
  }, [open, initialData, nextCicilanKe])

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.nomor_transaksi?.trim()) {
      newErrors.nomor_transaksi = 'Nomor transaksi wajib diisi'
    }

    if (!formData.jumlah_dibayar || Number(formData.jumlah_dibayar) <= 0) {
      newErrors.jumlah_dibayar = 'Jumlah dibayar harus lebih dari 0'
    }

    if (!formData.tanggal_bayar) {
      newErrors.tanggal_bayar = 'Tanggal bayar wajib dipilih'
    }

    if (!formData.metode_pembayaran) {
      newErrors.metode_pembayaran = 'Metode pembayaran wajib dipilih'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData)
      onOpenChange(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content 
        style={{ maxWidth: 600, borderRadius: 0 }}
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex items-center justify-between mb-4">
          <Dialog.Title>
            <Text size="4" weight="bold">
              {isEdit ? 'Edit Transaksi' : 'Tambah Transaksi'}
            </Text>
          </Dialog.Title>
          <Dialog.Close>
            <button
              className="text-slate-400 hover:text-slate-600 transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </Dialog.Close>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Text size="2" mb="1" weight="medium">Nomor Transaksi *</Text>
              <TextField.Root
                value={formData.nomor_transaksi}
                onChange={(e) => handleChange('nomor_transaksi', e.target.value)}
                placeholder="TRX-001"
                style={{ borderRadius: 0 }}
              />
              {errors.nomor_transaksi && (
                <Text size="1" color="red" mt="1">
                  {errors.nomor_transaksi}
                </Text>
              )}
            </div>

            <div>
              <Text size="2" mb="1" weight="medium">Jumlah Dibayar (Rp) *</Text>
              <TextField.Root
                type="number"
                value={formData.jumlah_dibayar}
                onChange={(e) => handleChange('jumlah_dibayar', e.target.value)}
                placeholder="500000"
                style={{ borderRadius: 0 }}
                min="0"
                step="1000"
              />
              {errors.jumlah_dibayar && (
                <Text size="1" color="red" mt="1">
                  {errors.jumlah_dibayar}
                </Text>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <Text size="2" mb="1" weight="medium">Tanggal Bayar *</Text>
              <input
                type="date"
                value={formData.tanggal_bayar}
                onChange={(e) => handleChange('tanggal_bayar', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{ borderRadius: 0 }}
              />
              {errors.tanggal_bayar && (
                <Text size="1" color="red" mt="1">
                  {errors.tanggal_bayar}
                </Text>
              )}
            </div>

            <div>
              <Text size="2" mb="1" weight="medium">Metode Pembayaran *</Text>
              <Select.Root
                value={formData.metode_pembayaran}
                onValueChange={(value) => handleChange('metode_pembayaran', value)}
              >
                <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih metode" />
                <Select.Content style={{ borderRadius: 0 }}>
                  <Select.Item value="transfer">Transfer Bank</Select.Item>
                  <Select.Item value="tunai">Tunai</Select.Item>
                  <Select.Item value="qris">QRIS</Select.Item>
                  <Select.Item value="virtual_account">Virtual Account</Select.Item>
                  <Select.Item value="kartu_kredit">Kartu Kredit</Select.Item>
                  <Select.Item value="debit">Kartu Debit</Select.Item>
                </Select.Content>
              </Select.Root>
              {errors.metode_pembayaran && (
                <Text size="1" color="red" mt="1">
                  {errors.metode_pembayaran}
                </Text>
              )}
            </div>
          </div>

          <div>
            <Text size="2" mb="1" weight="medium">Referensi Pembayaran</Text>
            <TextField.Root
              value={formData.referensi_pembayaran}
              onChange={(e) => handleChange('referensi_pembayaran', e.target.value)}
              placeholder="No. Rekening / ID Transaksi"
              style={{ borderRadius: 0 }}
            />
          </div>

          <div>
            <Text size="2" mb="1" weight="medium">Catatan Transaksi</Text>
            <TextArea
              value={formData.catatan}
              onChange={(e) => handleChange('catatan', e.target.value)}
              placeholder="Catatan untuk transaksi ini (opsional)"
              style={{ borderRadius: 0 }}
              rows={3}
            />
          </div>

          <div className="bg-slate-50 p-3 border border-slate-200">
            <Text size="1" className="text-slate-600">
              Cicilan ke-{formData.cicilan_ke}
            </Text>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            variant="soft"
            color="gray"
            onClick={() => onOpenChange(false)}
            style={{ borderRadius: 0 }}
            className="cursor-pointer"
          >
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            style={{ borderRadius: 0 }}
            className="cursor-pointer bg-blue-600 hover:bg-blue-700"
          >
            {isEdit ? 'Simpan Perubahan' : 'Tambah Transaksi'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
