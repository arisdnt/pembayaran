import { Card, Flex, Heading, Text } from '@radix-ui/themes'

export function ErrorCard({ error }) {
  if (!error) return null

  return (
    <Card className="mb-6 border border-red-200 bg-red-50">
      <Flex direction="column" gap="3">
        <Heading size="4" className="text-red-800">Konfigurasi Realtime</Heading>
        <Text color="red" size="2">
          {error}
        </Text>
        <Text size="2" color="gray">
          Buat tabel `dashboard_items` dengan kolom minimal `id` (uuid), `event_type` (text), dan `created_at` (timestamptz default now()).
        </Text>
        <Text size="2" color="gray">
          Setiap insert/update/delete akan muncul otomatis di bawah tanpa reload halaman.
        </Text>
      </Flex>
    </Card>
  )
}
