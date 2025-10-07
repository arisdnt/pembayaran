import { PageLayout } from '../../../layout/PageLayout'
import { Text } from '@radix-ui/themes'

export function NotFoundState({ message, onBack }) {
  return (
    <PageLayout>
      <div className="flex flex-col items-center justify-center h-full gap-4 bg-slate-50">
        <Text size="4" className="text-red-600">{message || 'Data tidak ditemukan'}</Text>
        {onBack && (
          <button
            onClick={onBack}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            type="button"
          >
            Kembali
          </button>
        )}
      </div>
    </PageLayout>
  )
}
