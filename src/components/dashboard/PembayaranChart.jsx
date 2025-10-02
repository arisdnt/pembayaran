import { Text } from '@radix-ui/themes'
import { TrendingUp } from 'lucide-react'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
}

function getMonthName(monthKey) {
  const [year, month] = monthKey.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${months[parseInt(month) - 1]} ${year}`
}

export function PembayaranChart({ data, loading }) {
  if (loading) {
    return (
      <div className="border-2 border-slate-300 bg-white shadow-lg h-full flex items-center justify-center">
        <Text size="2" className="text-slate-500">Memuat data...</Text>
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.total), 1)

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col h-full overflow-hidden">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Pembayaran 6 Bulan Terakhir
          </Text>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-end overflow-hidden">
        <div className="flex items-end justify-between gap-2 h-40 relative">
          {data.map((item, index) => {
            const height = maxValue > 0 ? (item.total / maxValue) * 100 : 0
            return (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <div className="w-full relative group">
                  <div 
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 transition-all cursor-pointer border-2 border-blue-700"
                    style={{ height: `${Math.max(height, 2)}%` }}
                    title={formatCurrency(item.total)}
                  />
                </div>
                <Text size="1" className="text-slate-600 text-center truncate w-full">
                  {getMonthName(item.month)}
                </Text>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
