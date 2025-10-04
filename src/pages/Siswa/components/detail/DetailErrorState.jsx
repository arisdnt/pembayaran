import { PageLayout } from '../../../../layout/PageLayout'
import { Text, Button } from '@radix-ui/themes'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export function DetailErrorState({ error, onBack }) {
  return (
    <PageLayout>
      <div className="flex items-center justify-center h-full">
        <div className="text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <Text size="4" weight="bold" className="text-slate-800 mb-2 block">
            Terjadi Kesalahan
          </Text>
          <Text size="2" className="text-slate-600 mb-4 block">
            {error}
          </Text>
          <Button onClick={onBack} style={{ borderRadius: 0 }}>
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Daftar Siswa
          </Button>
        </div>
      </div>
    </PageLayout>
  )
}
