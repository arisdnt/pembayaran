import { Flex, Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'

export function FormErrorAlert({ error }) {
  if (!error) return null

  return (
    <Flex align="center" gap="2" className="p-2 bg-red-50 border border-red-200" style={{ borderRadius: 0 }}>
      <AlertCircle className="h-4 w-4 text-red-600" />
      <Text size="2" className="text-red-800">
        {error}
      </Text>
    </Flex>
  )
}
