import { Text } from '@radix-ui/themes'

export function TahunAjaranDetailFooter() {
  return (
    <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 text-center">
      <Text size="1" className="text-slate-400">
        Dokumen ini dihasilkan otomatis oleh sistem Sekolah Digital
      </Text>
      <Text size="1" className="mt-1 text-slate-400">
        © {new Date().getFullYear()} Sekolah Digital · Arsip Akademik
      </Text>
    </div>
  )
}
