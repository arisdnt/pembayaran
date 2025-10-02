import { useState, useEffect } from 'react'
import { Dialog, TextField, Text, Button, Select, TextArea, IconButton } from '@radix-ui/themes'
import { AlertCircle, DollarSign, Calendar, CreditCard, Hash, FileText, X, Plus, Edit3, Wand2 } from 'lucide-react'

export function TransaksiPembayaranModal({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit,
  cicilanKe 
}) {
  const [formData, setFormData] = useState(
    initialData || {
      nomor_transaksi: '',
      jumlah_dibayar: '',
      tanggal_bayar: new Date().toISOString().split('T')[0],
      metode_pembayaran: '',
      referensi_pembayaran: '',
      catatan: '',
    }
  )
  const [error, setError] = useState('')

  // Generate nomor transaksi otomatis
  const generateNomorTransaksi = () => {
    const timestamp = Date.now().toString().slice(-6)
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    const nomorTransaksi = `TRX-${timestamp}${random}`
    setFormData({ ...formData, nomor_transaksi: nomorTransaksi })
  }

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
      })
    } else {
      setFormData({
        nomor_transaksi: '',
        jumlah_dibayar: '',
        tanggal_bayar: new Date().toISOString().split('T')[0],
        metode_pembayaran: '',
        referensi_pembayaran: '',
        catatan: '',
      })
    }
  }, [initialData, open])

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    // Validasi
    if (!formData.nomor_transaksi || !formData.jumlah_dibayar || !formData.tanggal_bayar || !formData.metode_pembayaran) {
      setError('Nomor transaksi, jumlah, tanggal, dan metode pembayaran wajib diisi')
      return
    }

    if (parseFloat(formData.jumlah_dibayar) <= 0) {
      setError('Jumlah dibayar harus lebih dari 0')
      return
    }

    onSubmit(formData)
    onOpenChange(false)
    setError('')
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content 
        style={{ 
          maxWidth: '700px',
          width: '90vw',
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-10 w-10 items-center justify-center border shadow-sm ${
              isEdit ? 'bg-amber-600 border-amber-700' : 'bg-green-600 border-green-700'
            }`}>
              {isEdit ? <Edit3 className="h-5 w-5 text-white" /> : <Plus className="h-5 w-5 text-white" />}
            </div>
            <div>
              <Dialog.Title asChild>
                <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                  {isEdit ? 'Edit Transaksi' : `Tambah Transaksi - Cicilan ke-${cicilanKe}`}
                </Text>
              </Dialog.Title>
              <Dialog.Description asChild>
                <Text size="1" className="text-slate-600">
                  {isEdit ? 'Perbarui informasi transaksi pembayaran' : 'Tambahkan transaksi pembayaran baru'}
                </Text>
              </Dialog.Description>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
            type="button"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-red-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-auto bg-white" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6">
            {error && (
              <div className="mb-4 flex items-start gap-3 bg-red-50 border-2 border-red-300 p-4">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <Text size="2" weight="medium" className="text-red-900">Kesalahan</Text>
                  <Text size="2" className="text-red-700">{error}</Text>
                </div>
              </div>
            )}

            {/* Row 1: Nomor Transaksi & Jumlah */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Hash className="h-3.5 w-3.5 text-blue-500" />
                  <Text size="2" weight="medium">Nomor Transaksi <span className="text-red-600">*</span></Text>
                </div>
                <div className="flex items-center gap-2">
                  <TextField.Root
                    placeholder="Contoh: TRX-001"
                    value={formData.nomor_transaksi}
                    onChange={(e) => setFormData({ ...formData, nomor_transaksi: e.target.value })}
                    style={{ borderRadius: 0, flex: 1 }}
                    required
                  />
                  <Button
                    type="button"
                    onClick={generateNomorTransaksi}
                    variant="soft"
                    color="blue"
                    style={{ borderRadius: 0 }}
                    className="cursor-pointer shrink-0"
                    title="Generate nomor transaksi otomatis"
                  >
                    <Wand2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <Text size="1" className="text-slate-500 mt-1">Klik tombol untuk generate otomatis</Text>
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <DollarSign className="h-3.5 w-3.5 text-green-500" />
                  <Text size="2" weight="medium">Jumlah Dibayar <span className="text-red-600">*</span></Text>
                </div>
                <TextField.Root
                  type="number"
                  placeholder="0"
                  value={formData.jumlah_dibayar}
                  onChange={(e) => setFormData({ ...formData, jumlah_dibayar: e.target.value })}
                  style={{ borderRadius: 0 }}
                  required
                />
                <Text size="1" className="text-slate-500 mt-1">Jumlah dalam Rupiah</Text>
              </label>
            </div>

            {/* Row 2: Tanggal & Metode */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-purple-500" />
                  <Text size="2" weight="medium">Tanggal Bayar <span className="text-red-600">*</span></Text>
                </div>
                <TextField.Root
                  type="date"
                  value={formData.tanggal_bayar}
                  onChange={(e) => setFormData({ ...formData, tanggal_bayar: e.target.value })}
                  style={{ borderRadius: 0 }}
                  required
                />
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <CreditCard className="h-3.5 w-3.5 text-indigo-500" />
                  <Text size="2" weight="medium">Metode Pembayaran <span className="text-red-600">*</span></Text>
                </div>
                <Select.Root
                  value={formData.metode_pembayaran}
                  onValueChange={(value) => setFormData({ ...formData, metode_pembayaran: value })}
                  required
                >
                  <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih metode" />
                  <Select.Content style={{ borderRadius: 0 }}>
                    <Select.Item value="cash">Tunai (Cash)</Select.Item>
                    <Select.Item value="transfer">Transfer Bank</Select.Item>
                    <Select.Item value="qris">QRIS</Select.Item>
                    <Select.Item value="e-wallet">E-Wallet (GoPay/OVO/Dana)</Select.Item>
                    <Select.Item value="kartu_debit">Kartu Debit</Select.Item>
                    <Select.Item value="kartu_kredit">Kartu Kredit</Select.Item>
                  </Select.Content>
                </Select.Root>
              </label>
            </div>

            {/* Row 3: Referensi */}
            <div className="mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Hash className="h-3.5 w-3.5 text-slate-500" />
                  <Text size="2" weight="medium">Referensi Pembayaran</Text>
                </div>
                <TextField.Root
                  placeholder="No. referensi bank / kode transaksi (opsional)"
                  value={formData.referensi_pembayaran}
                  onChange={(e) => setFormData({ ...formData, referensi_pembayaran: e.target.value })}
                  style={{ borderRadius: 0 }}
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Contoh: REF123456, no. rekening pengirim, atau kode QRIS
                </Text>
              </label>
            </div>

            {/* Row 4: Catatan */}
            <div className="mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                  <Text size="2" weight="medium">Catatan Transaksi</Text>
                </div>
                <TextArea
                  placeholder="Catatan untuk transaksi ini (opsional)"
                  value={formData.catatan}
                  onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                  style={{ borderRadius: 0, minHeight: '80px' }}
                />
              </label>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <Button
            type="button"
            variant="soft"
            color="gray"
            onClick={() => onOpenChange(false)}
            style={{ borderRadius: 0 }}
            className="cursor-pointer border border-slate-300"
          >
            <X className="h-3.5 w-3.5" />
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            style={{
              borderRadius: 0,
              backgroundColor: isEdit ? '#d97706' : '#16a34a',
              border: isEdit ? '1px solid #b45309' : '1px solid #15803d'
            }}
            className="cursor-pointer text-white"
          >
            {isEdit ? <Edit3 className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {isEdit ? 'Perbarui' : 'Tambah'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
