import { Badge, Table, Text } from '@radix-ui/themes'

export function EventsTable({ events, loading }) {
  if (loading) {
    return (
      <div className="overflow-hidden rounded-lg border border-gray-200">
        <Table.Root>
          <Table.Header>
            <Table.Row className="bg-gray-50">
              <Table.ColumnHeaderCell className="font-semibold text-gray-900">
                Event Type
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="font-semibold text-gray-900">
                Payload
              </Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell className="font-semibold text-gray-900">
                Dibuat
              </Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {Array.from({ length: 6 }).map((_, index) => (
              <Table.Row key={`dashboard-skeleton-${index}`} className="animate-pulse">
                <Table.Cell>
                  <div className="h-6 w-24 bg-slate-200" />
                </Table.Cell>
                <Table.Cell>
                  <div className="h-16 w-full bg-slate-200" />
                </Table.Cell>
                <Table.Cell>
                  <div className="h-4 w-32 bg-slate-200" />
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="py-12 text-center">
        <Text size="3" className="text-gray-500">
          Belum ada data. Tambahkan baris baru ke tabel `dashboard_items` melalui Supabase untuk melihat realtime.
        </Text>
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200">
      <Table.Root>
        <Table.Header>
          <Table.Row className="bg-gray-50">
            <Table.ColumnHeaderCell className="font-semibold text-gray-900">
              Event Type
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold text-gray-900">
              Payload
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="font-semibold text-gray-900">
              Dibuat
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {events.map((row, index) => (
            <Table.Row key={row.id ?? `${row.created_at ?? 'row'}-${index}`} className="hover:bg-gray-50">
              <Table.Cell>
                <Badge color="blue" variant="soft">
                  {row.event_type ?? '—'}
                </Badge>
              </Table.Cell>
              <Table.Cell>
                <pre className="whitespace-pre-wrap rounded-md border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
                  {JSON.stringify(row.payload ?? {}, null, 2)}
                </pre>
              </Table.Cell>
              <Table.Cell>
                <Text size="2" className="text-gray-600">
                  {row.created_at ? new Date(row.created_at).toLocaleString() : '—'}
                </Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
