import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { usePublicDetailByNISN } from './hooks/usePublicDetailByNISN'
import { ReceiptLayout } from './components/ReceiptLayout'
import { Loader2, AlertCircle, AlertTriangle, Phone, Mail, MapPin } from 'lucide-react'
import { getSchoolName, getSchoolPhone, getSchoolEmail, getSchoolAddress } from '../../config/appInfo'

function LoadingState() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="text-center">
        <Loader2 className="w-16 h-16 text-blue-500 animate-spin mx-auto mb-4" strokeWidth={2} />
        <h2 className="text-xl font-bold text-slate-800 mb-2">Memuat Data</h2>
        <p className="text-slate-600 text-sm">Mohon tunggu sebentar...</p>
      </div>
    </div>
  )
}

function ErrorState({ error }) {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md w-full">
        <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-10 h-10 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Terjadi Kesalahan</h2>
        <p className="text-slate-600 text-sm mb-6">{error || 'Tidak dapat memuat data. Silakan coba lagi.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold hover:bg-slate-700 transition-colors"
        >
          Muat Ulang
        </button>
      </div>
    </div>
  )
}

function NotFoundState() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="text-center mb-8">
          <AlertTriangle className="w-24 h-24 text-amber-500 mx-auto mb-4" strokeWidth={1.5} />
          <div className="border-t-4 border-amber-500 pt-6">
            <h1 className="text-3xl font-bold text-slate-800 mb-3">Data Tidak Ditemukan</h1>
            <p className="text-lg text-slate-600 mb-2">
              NISN yang Anda cari tidak terdaftar dalam sistem
            </p>
            <p className="text-sm text-slate-500 mt-4">
              Pastikan NISN yang dimasukkan sudah benar
            </p>
          </div>
        </div>

        <div className="border-t-2 border-slate-300 pt-6">
          <h2 className="text-lg font-bold text-slate-800 mb-4 text-center">Hubungi Kami</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-slate-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-800">{getSchoolName()}</p>
                <p className="text-slate-600">{getSchoolAddress()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-5 h-5 text-slate-600 flex-shrink-0" />
              <div>
                <p className="text-slate-600">{getSchoolPhone()}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-5 h-5 text-slate-600 flex-shrink-0" />
              <div>
                <p className="text-slate-600">{getSchoolEmail()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export function PublicSiswaByNISN() {
  const { nisn } = useParams()
  const {
    siswa,
    riwayatKelas,
    tagihanData,
    loading,
    error,
  } = usePublicDetailByNISN(nisn)

  useEffect(() => {
    const schoolName = getSchoolName()
    const baseTitle = `${schoolName} | Portal Tagihan Siswa`
    const newTitle = siswa ? `${siswa.nama_lengkap} · ${baseTitle}` : baseTitle

    document.title = newTitle

    const descriptionContent = siswa
      ? `Rincian tagihan dan pembayaran ${siswa.nama_lengkap} (${siswa.nisn || 'NISN tidak tersedia'}) - ${schoolName}`
      : `Portal tagihan dan pembayaran siswa ${schoolName}. Akses informasi tagihan dengan memasukkan NISN.`

    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', descriptionContent)
    }
  }, [nisn, siswa])

  if (loading) return <LoadingState />
  if (error) return <ErrorState error={error} />
  if (!siswa) return <NotFoundState />

  return (
    <ReceiptLayout
      siswa={siswa}
      riwayatKelas={riwayatKelas}
      tagihanData={tagihanData}
    />
  )
}
