import { Text } from '@radix-ui/themes'
import { Clock, Hash } from 'lucide-react'
import { formatDateTime } from '../../helpers/formatters'

export function DetailPanelMetadata({ selectedItem }) {
  return (
    <>
      {/* Dibuat Pada */}
      <div className="p-3 bg-white border border-slate-300 mx-4">
        <div className="flex items-center gap-2 mb-1">
          <Clock className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Dibuat Pada
          </Text>
        </div>
        <Text size="2" className="text-slate-900">
          {formatDateTime(selectedItem.dibuat_pada)}
        </Text>
      </div>

      {/* Diperbarui Pada */}
      {selectedItem.diperbarui_pada && (
        <div className="p-3 bg-white border border-slate-300 mx-4">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="h-4 w-4 text-purple-500" />
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
              Diperbarui Pada
            </Text>
          </div>
          <Text size="2" className="text-slate-900">
            {formatDateTime(selectedItem.diperbarui_pada)}
          </Text>
        </div>
      )}

      {/* ID */}
      <div className="p-3 bg-slate-50 border border-slate-300 mx-4">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            ID
          </Text>
        </div>
        <Text size="1" className="text-slate-500 font-mono break-all">
          {selectedItem.id}
        </Text>
      </div>
    </>
  )
}
