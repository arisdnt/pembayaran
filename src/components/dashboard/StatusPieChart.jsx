import { Text } from '@radix-ui/themes'
import { PieChart } from 'lucide-react'

const STATUS_CONFIG = {
  verified: { label: 'Terverifikasi', color: 'bg-green-500' },
  pending: { label: 'Pending', color: 'bg-amber-500' },
  rejected: { label: 'Ditolak', color: 'bg-red-500' }
}

export function StatusPieChart({ data, loading }) {
  if (loading) {
    return (
      <div className="border-2 border-slate-300 bg-white shadow-lg h-full flex items-center justify-center">
        <Text size="2" className="text-slate-500">Memuat data...</Text>
      </div>
    )
  }

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col h-full">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <PieChart className="h-4 w-4 text-slate-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Status Pembayaran
          </Text>
        </div>
      </div>
      <div className="p-6 flex-1 flex items-center justify-center">
        <div className="space-y-4 w-full">
          {data.map((item, index) => {
            const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0
            const config = STATUS_CONFIG[item.name] || { label: item.name, color: 'bg-gray-500' }
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 ${config.color}`} />
                    <Text size="2" className="text-slate-700">{config.label}</Text>
                  </div>
                  <Text size="2" weight="bold" className="text-slate-900 font-mono">
                    {item.value} ({percentage}%)
                  </Text>
                </div>
                <div className="w-full bg-slate-200 h-2">
                  <div 
                    className={`h-full ${config.color}`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
