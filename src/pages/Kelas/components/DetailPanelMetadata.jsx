import { Text } from '@radix-ui/themes'
import { Clock } from 'lucide-react'
import { formatDateTime } from '../utils/dateHelpers'

export function DetailPanelMetadata({ selectedItem }) {
  return (
    <div className="border-2 border-slate-300 bg-slate-50">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-3 py-2">
        <div className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-slate-500" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Metadata
          </Text>
        </div>
      </div>
      <div className="p-3 space-y-3">
        {/* Dibuat */}
        <div className="flex items-start gap-2">
          <Clock className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-1 block">
              Dibuat Pada
            </Text>
            <Text size="2" className="text-slate-900">
              {formatDateTime(selectedItem.dibuat_pada)}
            </Text>
          </div>
        </div>

        {/* Diperbarui */}
        {selectedItem.diperbarui_pada && (
          <div className="flex items-start gap-2">
            <Clock className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-1 block">
                Diperbarui Pada
              </Text>
              <Text size="2" className="text-slate-900">
                {formatDateTime(selectedItem.diperbarui_pada)}
              </Text>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
