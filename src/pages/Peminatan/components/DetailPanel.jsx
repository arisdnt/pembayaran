import { Text, Badge } from '@radix-ui/themes'
import { BookOpen, Hash, FileText, TrendingUp, TrendingDown, Power, PowerOff, Calendar } from 'lucide-react'

export function DetailPanel({ selectedItem, isLoading = false, isRefreshing = false }) {
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
        <div className="flex items-center gap-2 mb-2">
          <BookOpen className="h-5 w-5 text-indigo-600" />
          <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
            Detail Peminatan
          </Text>
        </div>
        <Text size="1" className="text-slate-600">
          {schoolName}
        </Text>
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
                Kode
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
