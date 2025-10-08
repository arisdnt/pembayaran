import { Text, Badge } from '@radix-ui/themes'
import { School, Users, BookOpen } from 'lucide-react'
import { useWaliKelasAmpu } from '../../../hooks/useWaliKelasAmpu'

export function WaliKelasAmpuSection({ waliKelasId }) {
  const { kelasList, siswaList, summary, loading } = useWaliKelasAmpu(waliKelasId)

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-20 bg-slate-100 animate-pulse border border-slate-300" style={{ borderRadius: 0 }} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Ringkasan */}
      <div className="p-3 bg-white border border-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-4 w-4 text-emerald-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Ringkasan Kelas Diampu
          </Text>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-blue-50 border border-blue-200">
            <div className="flex items-center gap-1 mb-1">
              <School className="h-3 w-3 text-blue-700" />
              <Text size="1" className="text-blue-700 uppercase tracking-wide">
                Total Kelas
              </Text>
            </div>
            <Text size="3" weight="bold" className="text-blue-900 font-mono">
              {summary.totalKelas}
            </Text>
          </div>
          <div className="p-2 bg-green-50 border border-green-200">
            <div className="flex items-center gap-1 mb-1">
              <Users className="h-3 w-3 text-green-700" />
              <Text size="1" className="text-green-700 uppercase tracking-wide">
                Total Siswa
              </Text>
            </div>
            <Text size="3" weight="bold" className="text-green-900 font-mono">
              {summary.totalSiswa}
            </Text>
          </div>
        </div>
      </div>

      {/* Daftar Kelas */}
      <div className="p-3 bg-white border border-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <School className="h-4 w-4 text-indigo-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Daftar Kelas ({kelasList.length})
          </Text>
        </div>
        
        {kelasList.length > 0 ? (
          <div className="space-y-1.5 max-h-[250px] overflow-auto excel-scrollbar">
            {kelasList.map((kelas) => (
              <div
                key={kelas.id}
                className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="flex items-center justify-center w-7 h-7 bg-indigo-600 border border-indigo-700 shrink-0">
                      <Text size="1" weight="bold" className="text-white font-mono">
                        {kelas.tingkat}
                      </Text>
                    </div>
                    <div className="min-w-0 flex-1">
                      <Text size="2" weight="medium" className="text-slate-900 truncate block">
                        Kelas {kelas.tingkat} {kelas.namaSubKelas}
                      </Text>
                      {kelas.kapasitasMaksimal && (
                        <Text size="1" className="text-slate-500 block mt-0.5">
                          {kelas.jumlahSiswa}/{kelas.kapasitasMaksimal} siswa
                        </Text>
                      )}
                    </div>
                  </div>
                  <Badge 
                    color="blue" 
                    variant="soft" 
                    size="1"
                    style={{ borderRadius: 0, flexShrink: 0 }}
                  >
                    <Users className="h-3 w-3 mr-1" />
                    {kelas.jumlahSiswa}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Text size="2" className="text-slate-400">
              Tidak ada kelas yang diampu
            </Text>
          </div>
        )}
      </div>

      {/* Daftar Siswa */}
      <div className="p-3 bg-white border border-slate-300">
        <div className="flex items-center gap-2 mb-2">
          <Users className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            Daftar Siswa ({siswaList.length})
          </Text>
        </div>
        
        {siswaList.length > 0 ? (
          <div className="space-y-1.5 max-h-[300px] overflow-auto excel-scrollbar">
            {siswaList.map((siswa, index) => (
              <div
                key={siswa.id}
                className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Text size="1" className="text-slate-500 font-mono shrink-0">
                        {index + 1}.
                      </Text>
                      <Text size="2" weight="medium" className="text-slate-900 truncate">
                        {siswa.namaLengkap}
                      </Text>
                    </div>
                    <div className="flex items-center gap-2 ml-5 mt-0.5">
                      {siswa.nisn && (
                        <Text size="1" className="text-slate-500 font-mono">
                          NISN: {siswa.nisn}
                        </Text>
                      )}
                      {siswa.jenisKelamin && (
                        <>
                          <span className="text-slate-400">•</span>
                          <Text size="1" className="text-slate-500">
                            {siswa.jenisKelamin === 'Laki-laki' ? 'L' : siswa.jenisKelamin === 'Perempuan' ? 'P' : '?'}
                          </Text>
                        </>
                      )}
                    </div>
                  </div>
                  <Badge 
                    color="indigo" 
                    variant="soft" 
                    size="1"
                    style={{ borderRadius: 0, flexShrink: 0 }}
                  >
                    {siswa.kelasLabel}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <Text size="2" className="text-slate-400">
              Belum ada siswa
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}
