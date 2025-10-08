import { memo } from 'react'
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
  if (!monthKey) return '-'
  const [year, month] = monthKey.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${months[parseInt(month) - 1]} ${year}`
}

function generateChartTitle(filters, masterData) {
  const parts = []
  
  // Period label
  const periodLabels = {
    'today': 'Hari Ini',
    'week': '7 Hari Terakhir',
    'month': '30 Hari Terakhir',
    'quarter': '3 Bulan Terakhir',
    'semester': '6 Bulan Terakhir',
    'year': 'Tahun Ini',
    'all': 'Semua Waktu'
  }
  const period = periodLabels[filters?.timeRange || 'all'] || 'Semua Waktu'
  parts.push(`Pembayaran ${period}`)
  
  // Tahun Ajaran
  if (filters?.tahunAjaran && masterData?.tahunAjaranList) {
    const ta = masterData.tahunAjaranList.find(t => t.id === filters.tahunAjaran)
    if (ta) {
      parts.push(`- ${ta.nama}`)
    }
  }
  
  // Tingkat
  if (filters?.tingkat) {
    parts.push(`- Tingkat ${filters.tingkat}`)
  }
  
  // Kelas
  if (filters?.kelas && masterData?.kelasList) {
    const kelas = masterData.kelasList.find(k => k.id === filters.kelas)
    if (kelas) {
      parts.push(`- ${kelas.tingkat} ${kelas.nama_sub_kelas}`)
    }
  }
  
  return parts.join(' ')
}

export const PembayaranChart = memo(function PembayaranChart({ data, loading, filters, masterData }) {
  // Tetap tampilkan chart meski sedang refresh, hanya data yang berubah
  const maxValue = Math.max(...(data?.map(d => d.total) || [1]), 1)
  const chartTitle = generateChartTitle(filters, masterData)

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col h-full overflow-hidden">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2 shrink-0">
        <div className="flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            {chartTitle}
          </Text>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col justify-end overflow-hidden">
        <div className="flex items-end justify-between gap-2 h-40 relative">
          {(data || []).map((item, index) => {
            const height = maxValue > 0 ? (item.total / maxValue) * 100 : 0
            return (
              <div key={item.bulan || index} className="flex-1 flex flex-col items-center gap-2 min-w-0">
                <div className="w-full relative group">
                  <div
                    className="w-full bg-gradient-to-t from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 transition-all duration-300 cursor-pointer border-2 border-blue-700"
                    style={{ height: `${Math.max(height, 2)}%` }}
                    title={formatCurrency(item.total)}
                  />
                </div>
                <Text size="1" className="text-slate-600 text-center truncate w-full">
                  {getMonthName(item.bulan)}
                </Text>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
})
