import { Separator, Text } from '@radix-ui/themes'
import { Battery, Clock } from 'lucide-react'
import { StatusBarItem } from './StatusBarItem'

export function DateTimeSection({ currentTime, battery }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('id-ID', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="flex items-center space-x-4">
      <StatusBarItem
        icon={Battery}
        label={`${battery}%`}
        iconColor="text-green-600"
      />
      <Separator orientation="vertical" size="1" className="h-3 bg-gray-500" />
      <Text size="1" className="text-gray-700">
        {formatDate(currentTime)}
      </Text>
      <Separator orientation="vertical" size="1" className="h-3 bg-gray-500" />
      <div className="flex items-center space-x-1">
        <Clock className="h-3 w-3 text-yellow-600" />
        <Text size="1" className="text-gray-900 font-mono">
          {formatTime(currentTime)}
        </Text>
      </div>
    </div>
  )
}
