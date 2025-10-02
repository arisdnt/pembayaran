import { Text } from '@radix-ui/themes'
import { FileText, Clock } from 'lucide-react'

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

function formatCurrency(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export function DetailPanel({ selectedItem }) {
  if (!selectedItem) {
    return (
      <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur items-center justify-center p-6">
        <div className="text-center text-slate-400">
          <FileText className="h-16 w-16 mx-auto mb-4 text-slate-300" />
          <Text size="3" className="text-slate-500 mb-2">
            Tidak ada data dipilih
          </Text>
          <Text size="2" className="text-slate-400">
            Pilih baris pada tabel untuk melihat detail
          </Text>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur">
      <div className="flex-1 overflow-auto p-6">
        <div className="space-y-6">
          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Tagihan
            </Text>
            <div className="flex flex-col gap-1">
              <Text size="3" weight="bold" className="text-slate-900 font-mono">
                {selectedItem.tagihan?.nomor_tagihan || '—'}
              </Text>
              <Text size="2" className="text-slate-600">
                {selectedItem.tagihan?.judul || '—'}
              </Text>
            </div>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Jenis Pembayaran
            </Text>
            <div className="flex flex-col gap-1">
              <Text size="3" weight="bold" className="text-slate-900 font-mono uppercase">
                {selectedItem.jenis_pembayaran?.kode || '—'}
              </Text>
              <Text size="2" className="text-slate-600">
                {selectedItem.jenis_pembayaran?.nama || '—'}
              </Text>
            </div>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Deskripsi
            </Text>
            <Text size="2" className="text-slate-700 leading-relaxed">
              {selectedItem.deskripsi}
            </Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Jumlah
            </Text>
            <Text size="5" weight="bold" className="text-emerald-700">
              {formatCurrency(selectedItem.jumlah)}
            </Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Urutan Tampilan
            </Text>
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 border-2 border-blue-200">
              <Text size="5" weight="bold" className="text-blue-700 font-mono">
                {selectedItem.urutan}
              </Text>
            </div>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              ID
            </Text>
            <Text size="2" className="text-slate-700 font-mono bg-slate-50 px-3 py-2 border border-slate-200">
              {selectedItem.id}
            </Text>
          </div>

          <div>
            <Text size="1" className="text-slate-500 uppercase tracking-wider mb-2 block">
              Dibuat Pada
            </Text>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="h-4 w-4 text-slate-400" />
              <Text size="2">{formatDateTime(selectedItem.tanggal_dibuat)}</Text>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
