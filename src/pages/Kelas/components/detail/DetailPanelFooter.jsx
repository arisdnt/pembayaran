import { Text } from '@radix-ui/themes'

export function DetailPanelFooter({ selectedItem, footerInfo }) {
  return (
    <div className="shrink-0 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2.5">
      <div className="flex items-center justify-between">
        <Text size="1" className="text-slate-600 font-medium">
          Data kelas • Sistem Kas Sekolah
        </Text>
        <Text size="1" className="text-slate-500 font-mono">
          {selectedItem.id?.slice(0, 8) || '—'}
        </Text>
      </div>
      {footerInfo && (
        <Text size="1" className="text-slate-500 text-right mt-1 block">
          {footerInfo}
        </Text>
      )}
    </div>
  )
}
