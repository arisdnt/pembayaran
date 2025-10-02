import { Card, Heading, Text } from '@radix-ui/themes'

export function StatsCard({ title, value, description, valueColor, loading }) {
  if (loading) {
    return (
      <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
        <div className="p-6">
          <div className="space-y-3 animate-pulse">
            <div className="h-4 w-32 bg-slate-200" />
            <div className="h-10 w-24 bg-slate-200" />
            <div className="h-3 w-40 bg-slate-200" />
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-white border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
      <div className="p-6">
        <Heading size="3" className="text-gray-900 mb-2">{title}</Heading>
        <Text size="8" weight="bold" className={`${valueColor} block mb-1`}>
          {value}
        </Text>
        <Text size="2" className="text-gray-500">
          {description}
        </Text>
      </div>
    </Card>
  )
}
