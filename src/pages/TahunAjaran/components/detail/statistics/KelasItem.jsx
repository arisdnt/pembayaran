import { Text } from '@radix-ui/themes'

export function KelasItem({ kelas }) {
  return (
    <div className="px-2.5 py-1.5 hover:bg-slate-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 flex-1 min-w-0">
          <Text size="1" weight="medium" className="text-slate-900 text-[0.7rem]">
            {kelas.namaSubKelas}
          </Text>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-[0.65rem]">
            <div className="w-1.5 h-1.5 bg-blue-600" />
            <Text size="1" className="text-slate-700 font-mono">
              {kelas.lakiLaki}
            </Text>
          </div>
          <div className="flex items-center gap-1.5 text-[0.65rem]">
            <div className="w-1.5 h-1.5 bg-pink-600" />
            <Text size="1" className="text-slate-700 font-mono">
              {kelas.perempuan}
            </Text>
          </div>
          {kelas.tidakDiketahui > 0 && (
            <div className="flex items-center gap-1.5 text-[0.65rem]">
              <div className="w-1.5 h-1.5 bg-gray-400" />
              <Text size="1" className="text-slate-700 font-mono">
                {kelas.tidakDiketahui}
              </Text>
            </div>
          )}
          <div className="flex items-center gap-0.5 ml-1">
            <Text size="1" weight="bold" className="text-slate-900 font-mono text-[0.7rem]">
              {kelas.jumlahSiswa}
            </Text>
          </div>
        </div>
      </div>
      {/* Progress bar */}
      <div className="flex h-1.5 border border-slate-300 overflow-hidden mt-1">
        {kelas.lakiLaki > 0 && (
          <div
            className="bg-blue-600"
            style={{ width: `${(kelas.lakiLaki / kelas.jumlahSiswa) * 100}%` }}
          />
        )}
        {kelas.perempuan > 0 && (
          <div
            className="bg-pink-600"
            style={{ width: `${(kelas.perempuan / kelas.jumlahSiswa) * 100}%` }}
          />
        )}
        {kelas.tidakDiketahui > 0 && (
          <div
            className="bg-gray-400"
            style={{ width: `${(kelas.tidakDiketahui / kelas.jumlahSiswa) * 100}%` }}
          />
        )}
      </div>
    </div>
  )
}
