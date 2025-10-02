import { Text } from '@radix-ui/themes'

export function StatusBarItem({ icon: Icon, label, iconColor }) {
  return (
    <div className="flex items-center space-x-1">
      <Icon className={`h-3 w-3 ${iconColor}`} />
      <Text size="1" className="text-gray-700">
        {label}
      </Text>
    </div>
  )
}
