import { Text } from '@radix-ui/themes'
import { formatDate } from '../../utils/dateHelpers'
import { formatCurrency } from '../../utils/currencyHelpers'

export function RingkasanTagihanCard({ tagihanInfo, summary }) {
  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg h-full flex flex-col">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
        <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
          Ringkasan Tagihan
        </Text>
      </div>
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        <div className="space-y-2 text-sm text-slate-700">
          <div>
            <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">
              Nomor Tagihan
            </Text>
            <Text size="2" className="font-mono mt-0.5">{tagihanInfo?.nomor || '-'}</Text>
          </div>
          <div>
            <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">
              Judul Tagihan
            </Text>
            <Text size="2" weight="medium" className="mt-0.5">{tagihanInfo?.judul || '-'}</Text>
          </div>
          <div>
            <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">
              Tanggal Tagihan
            </Text>
            <Text size="2" className="mt-0.5">{formatDate(tagihanInfo?.tanggal_tagihan)}</Text>
          </div>
        </div>

        {summary && (
          <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
            <div className="flex items-center justify-between">
              <Text size="1" className="text-slate-500">Total Tagihan</Text>
              <Text size="2" weight="medium">{formatCurrency(summary.totalTagihan)}</Text>
            </div>
            <div className="flex items-center justify-between">
              <Text size="1" className="text-slate-500">Sudah Dibayar</Text>
              <Text size="2" weight="medium" className="text-emerald-700">
                {formatCurrency(summary.totalDibayarLain + summary.originalTotalPembayaran)}
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text size="1" className="text-slate-500">Draft Saat Ini</Text>
              <Text size="2" weight="medium" className="text-blue-700">
                {formatCurrency(summary.totalPembayaranSaatIni)}
              </Text>
            </div>
            <div className="flex items-center justify-between">
              <Text size="1" className="text-slate-500">Total Setelah Edit</Text>
              <Text size="2" weight="medium" className="text-emerald-800">
                {formatCurrency(summary.totalDibayar)}
              </Text>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-slate-200">
              <Text size="1" className="text-slate-500">Sisa Tagihan</Text>
              <Text size="2" weight="bold" className={summary.remainingRaw < 0 ? 'text-orange-700' : 'text-slate-900'}>
                {formatCurrency(summary.sisaTagihan)}
              </Text>
            </div>
            {summary.remainingRaw < 0 && (
              <div className="mt-2 p-2 bg-orange-50 border border-orange-200">
                <Text size="1" className="text-orange-700">
                  Pembayaran melebihi tagihan sebesar {formatCurrency(Math.abs(summary.remainingRaw))}
                </Text>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
