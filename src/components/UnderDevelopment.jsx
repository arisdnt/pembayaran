import { Card, Flex, Heading, Text } from '@radix-ui/themes'
import { Hammer } from 'lucide-react'

export function UnderDevelopment({ details }) {
  return (
    <Card className="border border-dashed border-indigo-200 bg-white shadow-sm">
      <Flex align="start" gap="3">
        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
          <Hammer className="h-5 w-5" />
        </div>
        <div>
          <Heading size="5" className="text-indigo-700 mb-1">
            Masih dalam pengembangan
          </Heading>
          <Text size="2" className="text-indigo-600">
            {details ?? 'Tim kami sedang menyiapkan fitur ini berdasarkan kebutuhan skema database.'}
          </Text>
        </div>
      </Flex>
    </Card>
  )
}
