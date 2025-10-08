import { Text } from '@radix-ui/themes'

export function DetailPanelFooter() {
  const schoolName = import.meta.env.VITE_SCHOOL_NAME || 'Nama Sekolah'
  
  return (
    <div className="shrink-0 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
      <Text size="1" className="text-slate-600 text-center block">
        Data Kelas - {schoolName}
      </Text>
    </div>
  )
}
