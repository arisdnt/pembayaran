import { memo } from 'react'
import { Text } from '@radix-ui/themes'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount || 0)
}

export const StatCard = memo(function StatCard({ title, value, icon: Icon, color, isCurrency, loading }) {
  // Tampilkan data yang ada, tidak menampilkan loading state saat refresh
  const displayValue = isCurrency
    ? formatCurrency(value)
    : `Rp ${value.toLocaleString('id-ID')}`

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <Icon className={`h-3.5 w-3.5 ${color}`} />
          <Text size="1" weight="bold" className="text-slate-600 uppercase tracking-wider">
            {title}
          </Text>
        </div>
      </div>
      <div className="px-3 py-1.5 text-right">
        <Text size="8" weight="bold" className={`${color} font-mono transition-all duration-300`}>
          {displayValue}
        </Text>
      </div>
    </div>
  )
})
