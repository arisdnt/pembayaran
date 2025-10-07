import { Text } from '@radix-ui/themes'

export function IdentitasSiswaCard({ siswaInfo }) {
  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg h-full flex flex-col">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
        <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
          Identitas Siswa
        </Text>
      </div>
      <div className="p-4 space-y-3 flex-1 overflow-y-auto">
        <div className="space-y-2 text-sm text-slate-700">
          <div>
            <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">
              Nama
            </Text>
            <Text size="2" className="mt-0.5">{siswaInfo?.nama || '-'}</Text>
          </div>
          <div>
            <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">
              NISN
            </Text>
            <Text size="2" className="font-mono mt-0.5">{siswaInfo?.nisn || '-'}</Text>
          </div>
          <div>
            <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">
              Kelas
            </Text>
            <Text size="2" className="mt-0.5">{siswaInfo?.kelas || '-'}</Text>
          </div>
          <div>
            <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">
              Tahun Ajaran
            </Text>
            <Text size="2" className="mt-0.5">{siswaInfo?.tahunAjaran || '-'}</Text>
          </div>
        </div>
      </div>
    </div>
  )
}
