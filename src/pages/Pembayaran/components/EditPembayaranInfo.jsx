import { Text, Badge } from '@radix-ui/themes'
import { User, Receipt, Calendar, Hash } from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function EditPembayaranInfo({ pembayaran, tagihan, siswa }) {
  const totalTagihan = tagihan?.rincian_tagihan?.reduce(
    (sum, r) => sum + parseFloat(r.jumlah || 0), 0
  ) || 0

  const totalDibayar = tagihan?.pembayaran?.reduce((sum, p) =>
    sum + (p.rincian_pembayaran || []).reduce(
      (s, r) => s + parseFloat(r.jumlah_dibayar || 0), 0
    ), 0
  ) || 0

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg shrink-0">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3">
        <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
          Informasi Pembayaran
        </Text>
      </div>
      <div className="p-4 space-y-4">
        {/* Siswa Info */}
        <div className="bg-blue-50 border-2 border-blue-200 p-3">
          <div className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-blue-600" />
            <Text size="2" weight="bold" className="text-blue-900">
              Siswa
            </Text>
          </div>
          <Text size="2" weight="bold" className="text-blue-900 block mb-1">
            {siswa?.nama_lengkap || '-'}
          </Text>
          <Text size="1" className="text-blue-700 font-mono">
            NISN: {siswa?.nisn || '-'}
          </Text>
        </div>

        {/* Tagihan Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Receipt className="h-4 w-4 text-slate-600" />
            <Text size="2" weight="medium" className="text-slate-700">
              Detail Tagihan
            </Text>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <Text size="1" className="text-slate-500">Nomor:</Text>
              <Text size="1" className="font-mono text-slate-700">
                {tagihan?.nomor_tagihan || '-'}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text size="1" className="text-slate-500">Judul:</Text>
              <Text size="1" className="text-slate-700 text-right">
                {tagihan?.judul || '-'}
              </Text>
            </div>
            <div className="flex justify-between">
              <Text size="1" className="text-slate-500">Jatuh Tempo:</Text>
              <Text size="1" className="text-slate-700">
                {formatDate(tagihan?.tanggal_jatuh_tempo)}
              </Text>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="pt-3 border-t-2 border-slate-300 space-y-2">
          <div className="flex justify-between">
            <Text size="2" className="text-slate-600">Total Tagihan:</Text>
            <Text size="2" className="font-mono font-bold text-slate-900">
              {formatCurrency(totalTagihan)}
            </Text>
          </div>
          <div className="flex justify-between">
            <Text size="2" className="text-slate-600">Sudah Dibayar:</Text>
            <Text size="2" className="font-mono font-bold text-green-700">
              {formatCurrency(totalDibayar)}
            </Text>
          </div>
          <div className="flex justify-between pt-2 border-t border-slate-300">
            <Text size="2" weight="bold" className="text-slate-700">Sisa:</Text>
            <Text size="3" className="font-mono font-bold text-red-700">
              {formatCurrency(totalTagihan - totalDibayar)}
            </Text>
          </div>
        </div>

        {/* Pembayaran Info */}
        <div className="pt-3 border-t-2 border-slate-300">
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-4 w-4 text-green-600" />
            <Text size="2" weight="medium" className="text-slate-700">
              No. Pembayaran
            </Text>
          </div>
          <Text size="2" className="font-mono text-slate-900 font-bold">
            {pembayaran?.nomor_pembayaran || '-'}
          </Text>
        </div>
      </div>
    </div>
  )
}
