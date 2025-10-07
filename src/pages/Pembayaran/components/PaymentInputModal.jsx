import { useState, useEffect } from 'react'
import { Dialog, TextField, Text, Button, Select, TextArea } from '@radix-ui/themes'
import { DollarSign, X, Plus, Calendar, CreditCard, Hash, FileText, AlertCircle } from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

function formatNumber(num) {
  if (!num) return ''
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
}

function parseFormattedNumber(str) {
  if (!str) return ''
  return str.replace(/\./g, '')
}

export function PaymentInputModal({ open, onOpenChange, onSubmit, tagihan, summary }) {
  const [formData, setFormData] = useState({
    jumlah_dibayar: '',
    metode_pembayaran: 'tunai',
    referensi_pembayaran: '',
    catatan: '',
  })
  const [displayAmount, setDisplayAmount] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      const sisaAmount = summary?.sisa || ''
      setFormData({
        jumlah_dibayar: sisaAmount,
        metode_pembayaran: 'tunai',
        referensi_pembayaran: '',
        catatan: '',
      })
      setDisplayAmount(sisaAmount ? formatNumber(sisaAmount) : '')
      setError('')
    }
  }, [open, summary])

  const handleAmountChange = (e) => {
    const value = e.target.value
    const numericValue = parseFormattedNumber(value)

    if (numericValue === '' || /^\d+$/.test(numericValue)) {
      const parsedValue = parseFloat(numericValue)

      // Jika melebihi sisa tagihan, set ke maksimal sisa tagihan
      if (parsedValue > summary.sisa) {
        setDisplayAmount(formatNumber(summary.sisa))
        setFormData({ ...formData, jumlah_dibayar: summary.sisa.toString() })
        setError(`Maksimal pembayaran: ${formatCurrency(summary.sisa)}`)
      } else {
        setDisplayAmount(numericValue ? formatNumber(numericValue) : '')
        setFormData({ ...formData, jumlah_dibayar: numericValue })
        setError('')
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const jumlah = parseFloat(formData.jumlah_dibayar)

    if (!formData.jumlah_dibayar || jumlah <= 0) {
      setError('Jumlah pembayaran harus lebih dari 0')
      return
    }

    if (jumlah > summary.sisa) {
      setError(`Jumlah pembayaran (${formatCurrency(jumlah)}) melebihi sisa tagihan (${formatCurrency(summary.sisa)})`)
      return
    }

    onSubmit({
      tagihan,
      summary,
      payment: {
        ...formData,
        jumlah_dibayar: jumlah,
      }
    })

    onOpenChange(false)
  }

  const handleSetFullPayment = () => {
    const sisaAmount = summary.sisa
    setFormData({ ...formData, jumlah_dibayar: sisaAmount })
    setDisplayAmount(formatNumber(sisaAmount))
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{ maxWidth: '1000px', width: '90vw', padding: 0, borderRadius: 0 }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-green-600 to-green-700 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-white border border-green-800 shadow">
              <DollarSign className="h-5 w-5 text-green-700" />
            </div>
            <div className="leading-none">
              <Dialog.Title asChild>
                <Text size="3" weight="bold" className="text-white uppercase tracking-wider block leading-none mb-0">
                  Input Pembayaran
                </Text>
              </Dialog.Title>
              <Dialog.Description asChild>
                <Text size="1" className="text-green-100 block leading-none mt-0">
                  Masukkan nominal yang akan dibayarkan
                </Text>
              </Dialog.Description>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-600 transition-colors border border-white"
            type="button"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Content - 2 Kolom Layout */}
        <form onSubmit={handleSubmit} className="bg-white">
          <div className="grid grid-cols-2 gap-0">
            {/* KOLOM KIRI - Info Tagihan */}
            <div className="bg-slate-50 border-r-2 border-slate-300 p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-slate-300">
                <DollarSign className="h-5 w-5 text-blue-600" />
                <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                  Informasi Tagihan
                </Text>
              </div>

              <div className="space-y-4">
                <div>
                  <Text size="1" className="text-slate-500 mb-1 block">Judul Tagihan</Text>
                  <Text size="3" weight="bold" className="text-slate-800 block">
                    {tagihan?.judul}
                  </Text>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Text size="1" className="text-slate-500 mb-1 block">Nomor Tagihan</Text>
                    <Text size="2" className="font-mono text-slate-700 block">
                      {tagihan?.nomor_tagihan}
                    </Text>
                  </div>
                  <div>
                    <Text size="1" className="text-slate-500 mb-1 block">Jatuh Tempo</Text>
                    <Text size="2" className="text-slate-700 block">
                      {tagihan?.tanggal_jatuh_tempo || '-'}
                    </Text>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-300">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <Text size="2" className="text-slate-600">Total Tagihan:</Text>
                      <Text size="3" className="font-mono font-bold text-slate-900">
                        {formatCurrency(summary?.total)}
                      </Text>
                    </div>
                    <div className="flex justify-between items-center">
                      <Text size="2" className="text-slate-600">Sudah Dibayar:</Text>
                      <Text size="3" className="font-mono font-bold text-green-700">
                        {formatCurrency(summary?.dibayar)}
                      </Text>
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t-2 border-slate-300">
                      <Text size="3" weight="bold" className="text-slate-700">Sisa Tagihan:</Text>
                      <Text size="4" className="font-mono font-bold text-red-700">
                        {formatCurrency(summary?.sisa)}
                      </Text>
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-blue-50 border-2 border-blue-200">
                  <Text size="1" className="text-blue-700">
                    💡 Anda dapat melakukan pembayaran cicilan/sebagian dari sisa tagihan
                  </Text>
                </div>
              </div>
            </div>

            {/* KOLOM KANAN - Form Pembayaran */}
            <div className="p-5">
              <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-slate-300">
                <CreditCard className="h-5 w-5 text-green-600" />
                <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                  Form Pembayaran
                </Text>
              </div>

              <div className="space-y-4">
                {/* Input Jumlah - FULL WIDTH BESAR */}
                <div>
                  <label>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <Text size="3" weight="bold">
                          Jumlah Dibayar <span className="text-red-600">*</span>
                        </Text>
                      </div>
                      <div className="flex items-center gap-2">
                        {formData.jumlah_dibayar && parseFloat(formData.jumlah_dibayar) > 0 && (
                          <span className={`px-2 py-1 text-xs font-medium ${
                            parseFloat(formData.jumlah_dibayar) >= summary.sisa
                              ? 'bg-green-100 text-green-800 border border-green-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}>
                            {parseFloat(formData.jumlah_dibayar) >= summary.sisa ? 'Bayar Penuh' : 'Bayar Sebagian'}
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={handleSetFullPayment}
                          className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white font-medium"
                        >
                          Set Penuh
                        </button>
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder="0"
                      value={displayAmount}
                      onChange={handleAmountChange}
                      className="w-full px-4 py-3 text-2xl font-mono font-bold text-right border-2 border-slate-300 focus:border-green-600 focus:outline-none bg-green-50"
                      required
                    />
                    {/* Fixed height container untuk error message */}
                    <div className="mt-1 h-5">
                      {error ? (
                        <div className="flex items-center gap-1.5 text-red-600">
                          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                          <Text size="1" className="text-red-600">{error}</Text>
                        </div>
                      ) : (
                        <Text size="1" className="text-slate-500 text-right block">
                          Masukkan nominal dalam Rupiah
                        </Text>
                      )}
                    </div>
                  </label>
                </div>

                {/* Layout 2 Kolom untuk Field Lainnya */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Metode Pembayaran */}
                  <div>
                    <label>
                      <div className="flex items-center gap-1.5 mb-2">
                        <CreditCard className="h-3.5 w-3.5 text-indigo-600" />
                        <Text size="2" weight="medium">
                          Metode <span className="text-red-600">*</span>
                        </Text>
                      </div>
                      <Select.Root
                        value={formData.metode_pembayaran}
                        onValueChange={(value) => setFormData({ ...formData, metode_pembayaran: value })}
                        required
                      >
                        <Select.Trigger style={{ borderRadius: 0, width: '100%' }} />
                        <Select.Content style={{ borderRadius: 0 }}>
                          <Select.Item value="tunai">Tunai</Select.Item>
                          <Select.Item value="non_tunai">Non Tunai</Select.Item>
                        </Select.Content>
                      </Select.Root>
                    </label>
                  </div>

                  {/* Referensi */}
                  <div>
                    <label>
                      <div className="flex items-center gap-1.5 mb-2">
                        <Hash className="h-3.5 w-3.5 text-slate-500" />
                        <Text size="2" weight="medium">Referensi</Text>
                      </div>
                      <TextField.Root
                        placeholder="No. referensi"
                        value={formData.referensi_pembayaran}
                        onChange={(e) => setFormData({ ...formData, referensi_pembayaran: e.target.value })}
                        style={{ borderRadius: 0 }}
                      />
                    </label>
                  </div>
                </div>

                {/* Catatan - Full Width */}
                <div>
                  <label>
                    <div className="flex items-center gap-1.5 mb-2">
                      <FileText className="h-3.5 w-3.5 text-slate-500" />
                      <Text size="2" weight="medium">Catatan</Text>
                    </div>
                    <TextArea
                      placeholder="Catatan tambahan (opsional)"
                      value={formData.catatan}
                      onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                      style={{ borderRadius: 0, minHeight: '80px' }}
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
            <Button
              type="button"
              variant="soft"
              color="gray"
              onClick={() => onOpenChange(false)}
              style={{ borderRadius: 0 }}
              className="cursor-pointer"
            >
              <X className="h-3.5 w-3.5" />
              Batal
            </Button>
            <Button
              type="submit"
              style={{ borderRadius: 0, backgroundColor: '#16a34a', border: '1px solid #15803d' }}
              className="cursor-pointer text-white"
            >
              <Plus className="h-3.5 w-3.5" />
              Tambahkan
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}


