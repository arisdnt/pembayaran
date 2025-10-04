import { Text } from '@radix-ui/themes'

export function ProgressBar({ label, value, total, color = 'blue' }) {
  const percentage = total > 0 ? Math.round((value / total) * 100) : 0
  
  const colorClasses = {
    blue: 'bg-blue-600',
    pink: 'bg-pink-600',
    gray: 'bg-gray-400',
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <Text size="1" className="text-slate-700 font-medium">
          {label}
        </Text>
        <Text size="1" weight="bold" className="text-slate-900 font-mono">
          {value} ({percentage}%)
        </Text>
      </div>
      <div className="h-2 bg-slate-200 border border-slate-300 overflow-hidden">
        <div 
          className={`h-full ${colorClasses[color]} transition-all duration-300`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}
