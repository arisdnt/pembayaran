import { useState, useEffect } from 'react'
import { Text, Badge } from '@radix-ui/themes'
import { BookOpen, Hash, FileText, TrendingUp, TrendingDown, Power, PowerOff, Users, UserCheck } from 'lucide-react'
import { db } from '../../../offline/db'

export function DetailPanel({ selectedItem, isLoading = false, isRefreshing = false, selectedYearLabel = 'Semua Tahun Ajaran', selectedYearId = null }) {
  const [siswaList, setSiswaList] = useState([])
  const [loadingSiswa, setLoadingSiswa] = useState(false)

  useEffect(() => {
    if (!selectedItem?.id) {
      setSiswaList([])
      return
    }

    const fetchSiswa = async () => {
      setLoadingSiswa(true)
      try {
        // Get peminatan_siswa for this peminatan
        let peminatanSiswaList = await db.peminatan_siswa
          .where('id_peminatan')
          .equals(selectedItem.id)
          .toArray()

        // Filter by tahun ajaran if selected
        if (selectedYearId && selectedYearId !== 'all') {
          peminatanSiswaList = peminatanSiswaList.filter(ps => 
            ps.id_tahun_ajaran === selectedYearId
          )
        }

        // Get siswa details
        const siswaIds = peminatanSiswaList.map(ps => ps.id_siswa)
        const siswaData = await db.siswa
          .where('id')
          .anyOf(siswaIds)
          .toArray()

        // Combine data
        const combined = peminatanSiswaList.map(ps => {
          const siswa = siswaData.find(s => s.id === ps.id_siswa)
          return {
            ...ps,
            siswa
          }
        }).filter(item => item.siswa)

        // Sort by nama
        combined.sort((a, b) => 
          (a.siswa?.nama_lengkap || '').localeCompare(b.siswa?.nama_lengkap || '')
        )

        setSiswaList(combined)
      } catch (error) {
        console.error('Error fetching siswa:', error)
        setSiswaList([])
      } finally {
        setLoadingSiswa(false)
      }
    }

    fetchSiswa()
  }, [selectedItem?.id, selectedYearId])
  if (isLoading) {
    return (
      <div className="h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
        <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
          <div className="h-6 bg-slate-200 animate-pulse" style={{ borderRadius: 0 }} />
        </div>
        <div className="flex-1 p-4 space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-slate-100 animate-pulse" style={{ borderRadius: 0 }} />
          ))}
        </div>
      </div>
    )
  }

  if (!selectedItem) {
    return (
      <div className="h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="text-center">
            <BookOpen className="h-16 w-16 text-slate-300 mx-auto mb-3" />
            <Text size="2" className="text-slate-500">
              Pilih peminatan untuk melihat detail
            </Text>
          </div>
        </div>
      </div>
    )
  }

  const schoolName = import.meta.env.VITE_SCHOOL_NAME || 'Nama Sekolah'

  return (
    <div className="relative h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
      {isRefreshing ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent animate-pulse" />
      ) : null}

      {/* Header */}
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Peminatan
          </Text>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 overflow-auto excel-scrollbar">
        <div className="p-4 space-y-3">
          {/* Nama & Status */}
          <div className="p-3 bg-slate-50 border border-slate-300">
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider mb-2 block">
              Informasi Utama
            </Text>
            <Text size="3" weight="bold" className="text-slate-900 mb-2 block">
              {selectedItem.nama}
            </Text>
            <div className="flex items-center gap-2">
              {selectedItem.aktif ? (
                <Badge color="green" variant="solid" style={{ borderRadius: 0 }}>
                  <Power className="h-3 w-3 mr-1" />
                  Aktif
                </Badge>
              ) : (
                <Badge color="red" variant="solid" style={{ borderRadius: 0 }}>
                  <PowerOff className="h-3 w-3 mr-1" />
                  Non-Aktif
                </Badge>
              )}
            </div>
          </div>

          {/* Kode */}
          <div className="p-3 bg-white border border-slate-300">
            <div className="flex items-center gap-2 mb-1">
              <Hash className="h-4 w-4 text-blue-500" />
              <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
                Kode (Auto-Generated)
              </Text>
            </div>
            <Text size="2" className="text-slate-900 font-semibold">
              {selectedItem.kode}
            </Text>
          </div>

          {/* Keterangan */}
          {selectedItem.keterangan && (
            <div className="p-3 bg-white border border-slate-300">
              <div className="flex items-center gap-2 mb-1">
                <FileText className="h-4 w-4 text-purple-500" />
                <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
                  Keterangan
                </Text>
              </div>
              <Text size="2" className="text-slate-700">
                {selectedItem.keterangan}
              </Text>
            </div>
          )}

          {/* Total Siswa */}
          <div className="p-3 bg-white border border-slate-300">
            <div className="flex items-center gap-2 mb-1">
              <Users className="h-4 w-4 text-emerald-500" />
              <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
                Total Siswa ({selectedYearLabel})
              </Text>
            </div>
            <Text size="3" weight="bold" className="text-slate-900">
              {selectedItem.total_siswa || 0} siswa
            </Text>
          </div>

          {/* Tingkat */}
          <div className="p-3 bg-white border border-slate-300">
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider mb-2 block">
              Rentang Tingkat
            </Text>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingDown className="h-3.5 w-3.5 text-green-500" />
                  <Text size="1" className="text-slate-600">
                    Minimum
                  </Text>
                </div>
                {selectedItem.tingkat_min ? (
                  <Text size="2" weight="bold" className="text-slate-900">
                    Tingkat {selectedItem.tingkat_min}
                  </Text>
                ) : (
                  <Text size="2" className="text-slate-400">
                    Tidak dibatasi
                  </Text>
                )}
              </div>
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                  <Text size="1" className="text-slate-600">
                    Maximum
                  </Text>
                </div>
                {selectedItem.tingkat_max ? (
                  <Text size="2" weight="bold" className="text-slate-900">
                    Tingkat {selectedItem.tingkat_max}
                  </Text>
                ) : (
                  <Text size="2" className="text-slate-400">
                    Tidak dibatasi
                  </Text>
                )}
              </div>
            </div>
          </div>

          {/* List Siswa */}
          <div className="p-3 bg-white border border-slate-300">
            <div className="flex items-center gap-2 mb-2">
              <UserCheck className="h-4 w-4 text-blue-500" />
              <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
                Daftar Siswa ({siswaList.length})
              </Text>
            </div>
            
            {loadingSiswa ? (
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-12 bg-slate-100 animate-pulse" style={{ borderRadius: 0 }} />
                ))}
              </div>
            ) : siswaList.length === 0 ? (
              <div className="text-center py-4">
                <Text size="2" className="text-slate-400">
                  Belum ada siswa
                </Text>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-[300px] overflow-auto excel-scrollbar">
                {siswaList.map((item, index) => (
                  <div 
                    key={item.id || index}
                    className="p-2 bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Text size="2" weight="medium" className="text-slate-900 block truncate">
                          {item.siswa?.nama_lengkap || '—'}
                        </Text>
                        {item.siswa?.nisn && (
                          <Text size="1" className="text-slate-500 font-mono block mt-0.5">
                            NISN: {item.siswa.nisn}
                          </Text>
                        )}
                      </div>
                      <Badge 
                        color="blue" 
                        variant="soft" 
                        size="1"
                        style={{ borderRadius: 0, flexShrink: 0 }}
                      >
                        Tingkat {item.tingkat || '—'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ID */}
          <div className="p-3 bg-slate-50 border border-slate-300">
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider mb-1 block">
              ID
            </Text>
            <Text size="1" className="text-slate-500 font-mono break-all">
              {selectedItem.id}
            </Text>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
        <Text size="1" className="text-slate-600 text-center block">
          Data Peminatan - {schoolName}
        </Text>
      </div>

      {/* Excel-style scrollbar */}
      <style>{`
        .excel-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        
        .excel-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-left: 1px solid #cbd5e1;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border: 2px solid #e2e8f0;
          transition: background 0.2s;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  )
}
