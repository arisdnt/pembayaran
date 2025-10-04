import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'

export function FormError({ error }) {
  if (!error) return null

  return (
    <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 mb-4">
      <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
      <Text size="2" className="text-red-800 font-medium">
        {error}
      </Text>
    </div>
  )
}
