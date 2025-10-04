import { Text } from '@radix-ui/themes'

export function StatCard({ label, value, color = 'blue' }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    pink: 'bg-pink-50 border-pink-200 text-pink-900',
    gray: 'bg-gray-50 border-gray-200 text-gray-900',
  }

  return (
    <div className={`border-2 ${colorClasses[color]} px-3 py-2`}>
      <Text size="1" className="text-slate-600 uppercase tracking-wide text-[0.65rem] mb-0.5 block">
        {label}
      </Text>
      <Text size="4" weight="bold" className="leading-none">
        {value}
      </Text>
    </div>
  )
}
