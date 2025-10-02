import { useParams, useNavigate } from 'react-router-dom'
import { PageLayout } from '../../layout/PageLayout'
import { Text, Button, Badge } from '@radix-ui/themes'
import { ArrowLeft, User, AlertCircle } from 'lucide-react'
import { useDetailSiswa } from './hooks/useDetailSiswa'
import { InfoSiswaSection } from './components/detail/InfoSiswaSection'
import { RiwayatKelasSection } from './components/detail/RiwayatKelasSection'
import { PeminatanSection } from './components/detail/PeminatanSection'
import { TagihanPembayaranSection } from './components/detail/TagihanPembayaranSection'

export function DetailSiswa() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { siswa, riwayatKelas, peminatan, tagihanData, loading, error } = useDetailSiswa(id)

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin h-12 w-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
            <Text size="3" className="text-slate-600">
              Memuat data siswa...
            </Text>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (error) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <Text size="4" weight="bold" className="text-slate-800 mb-2 block">
              Terjadi Kesalahan
            </Text>
            <Text size="2" className="text-slate-600 mb-4 block">
              {error}
            </Text>
            <Button onClick={() => navigate('/siswa')} style={{ borderRadius: 0 }}>
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Siswa
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  if (!siswa) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <User className="h-16 w-16 text-slate-300 mx-auto mb-4" />
            <Text size="4" weight="bold" className="text-slate-800 mb-2 block">
              Siswa Tidak Ditemukan
            </Text>
            <Text size="2" className="text-slate-600 mb-4 block">
              Data siswa yang Anda cari tidak ditemukan dalam sistem.
            </Text>
            <Button onClick={() => navigate('/siswa')} style={{ borderRadius: 0 }}>
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Siswa
            </Button>
          </div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="shrink-0 bg-white px-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              <Text size="4" weight="bold" className="text-slate-900">
                Detail Siswa
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/siswa')}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                type="button"
              >
                <ArrowLeft className="h-4 w-4 text-slate-600" />
                <Text size="2" weight="medium" className="text-slate-700">
                  Kembali
                </Text>
              </button>
              {siswa.status_aktif ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-green-100 border border-green-300">
                  <Text size="2" weight="medium" className="text-green-700">
                    Status: Aktif
                  </Text>
                </div>
              ) : (
                <div className="flex items-center gap-2 px-4 py-2 bg-gray-100 border border-gray-300">
                  <Text size="2" weight="medium" className="text-gray-700">
                    Status: Tidak Aktif
                  </Text>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-auto excel-scrollbar bg-white">
          <div className="p-2 space-y-4">
            {/* Informasi Siswa */}
            <InfoSiswaSection siswa={siswa} />

            {/* Riwayat Kelas */}
            <RiwayatKelasSection riwayatKelas={riwayatKelas} />

            {/* Peminatan */}
            {peminatan.length > 0 && (
              <PeminatanSection peminatan={peminatan} />
            )}

            {/* Tagihan dan Pembayaran */}
            <TagihanPembayaranSection tagihanData={tagihanData} />
          </div>
        </div>
      </div>

      {/* Excel-style scrollbar */}
      <style>{`
        .excel-scrollbar::-webkit-scrollbar {
          width: 16px;
          height: 16px;
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
    </PageLayout>
  )
}
