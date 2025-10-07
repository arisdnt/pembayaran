import { PageLayout } from '../../../layout/PageLayout'
import { Text } from '@radix-ui/themes'

export function LoadingState({ message = 'Memuat data...' }) {
  return (
    <PageLayout>
      <div className="flex items-center justify-center h-full bg-slate-50">
        <Text size="3" className="text-slate-500">{message}</Text>
      </div>
    </PageLayout>
  )
}
