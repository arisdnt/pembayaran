import { Text } from '@radix-ui/themes'
import { ArrowLeft, User } from 'lucide-react'

export function DetailHeader({ statusAktif, onBack }) {
  return (
    <div className="shrink-0 bg-white px-2 py-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User className="h-5 w-5 text-blue-600" />
          <Text size="4" weight="bold" className="text-slate-900">
            Detail Siswa
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
            type="button"
          >
            <ArrowLeft className="h-4 w-4 text-slate-600" />
            <Text size="2" weight="medium" className="text-slate-700">
              Kembali
            </Text>
          </button>
          {statusAktif ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300">
              <Text size="2" weight="medium" className="text-green-700">
                Status: Aktif
              </Text>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300">
              <Text size="2" weight="medium" className="text-gray-700">
                Status: Tidak Aktif
              </Text>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
