import { Dialog, Text, Button, Badge } from '@radix-ui/themes'
import { CheckCircle2, X, AlertCircle, DollarSign } from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

function getMetodeLabel(metode) {
  const labels = {
    tunai: 'Tunai',
    non_tunai: 'Non Tunai',
  }
  return labels[metode] || metode
}

export function PaymentConfirmationModal({
  open,
  onOpenChange,
  onConfirm,
  payments,
  totalAmount,
  siswaInfo,
  submitting
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{ maxWidth: '1200px', width: '90vw', padding: 0, borderRadius: 0 }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-amber-600 to-amber-700 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-white border border-amber-800 shadow">
              <AlertCircle className="h-5 w-5 text-amber-700" />
            </div>
            <div className="leading-none">
              <Dialog.Title asChild>
                <Text size="3" weight="bold" className="text-white uppercase tracking-wider block leading-none mb-0">
                  Konfirmasi Pembayaran
                </Text>
              </Dialog.Title>
              <Dialog.Description asChild>
                <Text size="1" className="text-amber-100 block leading-none mt-0">
                  Periksa kembali detail pembayaran sebelum menyimpan
                </Text>
              </Dialog.Description>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-600 transition-colors border border-white"
            type="button"
            disabled={submitting}
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Content - 2 Kolom */}
        <div className="bg-white grid grid-cols-3 gap-0">
          {/* KOLOM KIRI (2/3) - Detail Pembayaran */}
          <div className="col-span-2 border-r-2 border-slate-300 p-5 max-h-[70vh] overflow-auto">
            <div className="flex items-center gap-2 mb-4 pb-3 border-b-2 border-slate-300">
              <DollarSign className="h-5 w-5 text-blue-600" />
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                Detail Pembayaran
              </Text>
              <Badge color="blue" size="2" style={{ borderRadius: 0, marginLeft: 'auto' }}>
                {payments.length} Tagihan
              </Badge>
            </div>

            <div className="space-y-3">
              {payments.map((item, index) => (
                <div
                  key={index}
                  className="border-2 border-slate-300 bg-white"
                >
                  {/* Header Item */}
                  <div className="bg-gradient-to-b from-slate-100 to-slate-50 px-3 py-2 border-b-2 border-slate-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge color="blue" variant="soft" size="1" style={{ borderRadius: 0 }}>
                        #{index + 1}
                      </Badge>
                      <Text size="2" weight="bold" className="text-slate-800">
                        {item.tagihan.judul}
                      </Text>
                    </div>
                    <Text size="2" weight="bold" className="font-mono text-green-700 text-right">
                      {formatCurrency(item.payment.jumlah_dibayar)}
                    </Text>
                  </div>

                  {/* Detail Item */}
                  <div className="p-3 space-y-2 text-sm">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      <div className="flex justify-between">
                        <Text size="1" className="text-slate-500">Nomor Tagihan:</Text>
                        <Text size="1" className="font-mono text-slate-700">
                          {item.tagihan.nomor_tagihan}
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text size="1" className="text-slate-500">Tahun Ajaran:</Text>
                        <Text size="1" className="text-slate-700">
                          {item.tagihan.tahun_ajaran || '-'}
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text size="1" className="text-slate-500">Total Tagihan:</Text>
                        <Text size="1" className="font-mono text-slate-700 text-right">
                          {formatCurrency(item.summary.total)}
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text size="1" className="text-slate-500">Kelas:</Text>
                        <Text size="1" className="text-slate-700">
                          {item.tagihan.kelas || '-'}
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text size="1" className="text-slate-500">Sudah Dibayar:</Text>
                        <Text size="1" className="font-mono text-green-700 text-right">
                          {formatCurrency(item.summary.dibayar)}
                        </Text>
                      </div>
                      <div className="flex justify-between">
                        <Text size="1" className="text-slate-500">Metode:</Text>
                        <Badge color="indigo" variant="soft" size="1" style={{ borderRadius: 0 }}>
                          {getMetodeLabel(item.payment.metode_pembayaran)}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <Text size="1" className="text-slate-500">Sisa Tagihan:</Text>
                        <Text size="1" className="font-mono font-bold text-red-700 text-right">
                          {formatCurrency(item.summary.sisa)}
                        </Text>
                      </div>
                      {item.payment.referensi_pembayaran && (
                        <div className="flex justify-between">
                          <Text size="1" className="text-slate-500">Referensi:</Text>
                          <Text size="1" className="font-mono text-slate-700">
                            {item.payment.referensi_pembayaran}
                          </Text>
                        </div>
                      )}
                    </div>

                    {item.payment.catatan && (
                      <div className="pt-2 border-t border-slate-200">
                        <Text size="1" className="text-slate-500">Catatan:</Text>
                        <Text size="1" className="text-slate-700 italic">
                          "{item.payment.catatan}"
                        </Text>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* KOLOM KANAN (1/3) - Info Siswa & Total */}
          <div className="col-span-1 bg-slate-50 p-5 max-h-[70vh] overflow-auto">
            <div className="space-y-4">
              {/* Info Siswa */}
              {siswaInfo && (
                <div>
                  <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-slate-300">
                    <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                      Informasi Siswa
                    </Text>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <Text size="1" className="text-slate-500 mb-1 block">Nama Siswa</Text>
                      <Text size="2" weight="bold" className="text-slate-800 block">
                        {siswaInfo.nama_lengkap}
                      </Text>
                    </div>
                    <div>
                      <Text size="1" className="text-slate-500 mb-1 block">NISN</Text>
                      <Text size="2" className="font-mono text-slate-700 block">
                        {siswaInfo.nisn || '-'}
                      </Text>
                    </div>
                    <div>
                      <Text size="1" className="text-slate-500 mb-1 block">Tahun Ajaran</Text>
                      <Text size="2" className="text-slate-700 block">
                        {siswaInfo.tahun_ajaran || '-'}
                      </Text>
                    </div>
                    <div>
                      <Text size="1" className="text-slate-500 mb-1 block">Kelas</Text>
                      <Text size="2" className="text-slate-700 block">
                        {siswaInfo.kelas || '-'}
                      </Text>
                    </div>
                  </div>
                </div>
              )}

              {/* Ringkasan Total */}
              <div className="border-t-2 border-slate-300 pt-4">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b-2 border-slate-300">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Ringkasan
                  </Text>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <Text size="2" className="text-slate-600">Jumlah Tagihan:</Text>
                    <Badge color="blue" size="2" style={{ borderRadius: 0 }}>
                      {payments.length}
                    </Badge>
                  </div>
                  <div className="pt-3 border-t-2 border-slate-300">
                    <Text size="2" className="text-slate-600 mb-2 block">Total Pembayaran:</Text>
                    <div className="text-3xl font-bold font-mono text-green-700 text-right leading-tight">
                      {formatCurrency(totalAmount)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Peringatan */}
              <div className="border-t-2 border-slate-300 pt-4">
                <div className="bg-amber-50 border-2 border-amber-300 p-3">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                    <div>
                      <Text size="1" weight="medium" className="text-amber-900 block mb-1">Perhatian</Text>
                      <Text size="1" className="text-amber-700 leading-tight">
                        Pastikan semua informasi sudah benar. Setelah disimpan, data tidak dapat diubah.
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <Button
            type="button"
            variant="soft"
            color="gray"
            onClick={() => onOpenChange(false)}
            style={{ borderRadius: 0 }}
            className="cursor-pointer"
            disabled={submitting}
          >
            <X className="h-3.5 w-3.5" />
            Batal
          </Button>
          <Button
            onClick={onConfirm}
            disabled={submitting}
            style={{
              borderRadius: 0,
              backgroundColor: '#16a34a',
              border: '1px solid #15803d'
            }}
            className="cursor-pointer text-white"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            {submitting ? 'Menyimpan...' : 'Ya, Simpan Pembayaran'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
