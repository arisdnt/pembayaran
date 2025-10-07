import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'

export function ErrorAlert({ error }) {
  if (!error) return null

  return (
    <div className="shrink-0 mx-6 mt-4 flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3">
      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
      <div>
        <Text size="2" weight="medium" className="text-red-700 mb-1">
          Terjadi Kesalahan
        </Text>
        <Text size="2" className="text-red-600">
          {error}
        </Text>
      </div>
    </div>
  )
}
