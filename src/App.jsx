import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Theme } from '@radix-ui/themes'
import { RefreshProvider } from './contexts/RefreshContext'
import { ProtectedShell } from './components/layout/ProtectedShell'
import { Loader } from './components/ui/Loader'

// Lazy load all page components for optimal performance
const Login = lazy(() => import('./pages/Login').then(m => ({ default: m.Login })))
const Dashboard = lazy(() => import('./pages/Dashboard').then(m => ({ default: m.Dashboard })))
const Siswa = lazy(() => import('./pages/Siswa').then(m => ({ default: m.Siswa })))
const DetailSiswa = lazy(() => import('./pages/Siswa').then(m => ({ default: m.DetailSiswa })))
const Kelas = lazy(() => import('./pages/Kelas').then(m => ({ default: m.Kelas })))
const TahunAjaran = lazy(() => import('./pages/TahunAjaran').then(m => ({ default: m.TahunAjaran })))
const RiwayatKelasSiswa = lazy(() => import('./pages/RiwayatKelasSiswa/index').then(m => ({ default: m.RiwayatKelasSiswa })))
const WaliKelas = lazy(() => import('./pages/WaliKelas/index').then(m => ({ default: m.WaliKelas })))
const RiwayatWaliKelas = lazy(() => import('./pages/RiwayatWaliKelas/index').then(m => ({ default: m.RiwayatWaliKelas })))
const Peminatan = lazy(() => import('./pages/Peminatan/index').then(m => ({ default: m.Peminatan })))
const PeminatanSiswa = lazy(() => import('./pages/PeminatanSiswa/index').then(m => ({ default: m.PeminatanSiswa })))
const JenisPembayaran = lazy(() => import('./pages/JenisPembayaran/index').then(m => ({ default: m.JenisPembayaran })))
const Tagihan = lazy(() => import('./pages/Tagihan/index').then(m => ({ default: m.Tagihan })))
const CreateTagihan = lazy(() => import('./pages/Tagihan/CreateTagihan').then(m => ({ default: m.CreateTagihan })))
const EditTagihan = lazy(() => import('./pages/Tagihan/EditTagihan').then(m => ({ default: m.EditTagihan })))
const Pembayaran = lazy(() => import('./pages/Pembayaran/index').then(m => ({ default: m.Pembayaran })))
const CreatePembayaran = lazy(() => import('./pages/Pembayaran/CreatePembayaran').then(m => ({ default: m.CreatePembayaran })))
const EditPembayaran = lazy(() => import('./pages/Pembayaran/EditPembayaran').then(m => ({ default: m.EditPembayaran })))
const DetailPembayaran = lazy(() => import('./pages/Pembayaran/DetailPembayaran').then(m => ({ default: m.DetailPembayaran })))
const UbahPassword = lazy(() => import('./pages/UbahPassword').then(m => ({ default: m.UbahPassword })))
const SyncStatus = lazy(() => import('./pages/SyncStatus').then(m => ({ default: m.SyncStatus })))
const PublicSiswaByNISN = lazy(() => import('./pages/PublicSiswa/PublicSiswaByNISN').then(m => ({ default: m.PublicSiswaByNISN })))

const routes = [
  { path: 'dashboard', element: <Dashboard /> },
  { path: 'siswa', element: <Siswa /> },
  { path: 'siswa/:id', element: <DetailSiswa /> },
  { path: 'kelas', element: <Kelas /> },
  { path: 'tahun-ajaran', element: <TahunAjaran /> },
  { path: 'riwayat-kelas-siswa', element: <RiwayatKelasSiswa /> },
  { path: 'wali-kelas', element: <WaliKelas /> },
  { path: 'riwayat-wali-kelas', element: <RiwayatWaliKelas /> },
  { path: 'peminatan', element: <Peminatan /> },
  { path: 'peminatan-siswa', element: <PeminatanSiswa /> },
  { path: 'jenis-pembayaran', element: <JenisPembayaran /> },
  { path: 'tagihan', element: <Tagihan /> },
  { path: 'tagihan/create', element: <CreateTagihan /> },
  { path: 'tagihan/edit/:id', element: <EditTagihan /> },
  { path: 'pembayaran', element: <Pembayaran /> },
  { path: 'pembayaran/create', element: <CreatePembayaran /> },
  { path: 'pembayaran/edit/:id', element: <EditPembayaran /> },
  { path: 'pembayaran/detail/:id', element: <DetailPembayaran /> },
  { path: 'ubah-password', element: <UbahPassword /> },
  { path: 'sync', element: <SyncStatus /> },
]

function App() {
  return (
    <Theme accentColor="indigo" grayColor="slate">
      <RefreshProvider>
        <BrowserRouter>
          <Suspense fallback={<Loader />}>
            <Routes>
              {/* Public route: wali murid accesses detail by NISN without login */}
              <Route path="/nisn/:nisn" element={<PublicSiswaByNISN />} />
              <Route path="/login" element={<Login />} />
              <Route element={<ProtectedShell />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                {routes.map(({ path, element }) => (
                  <Route key={path} path={path} element={element} />
                ))}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Route>
            </Routes>
          </Suspense>
        </BrowserRouter>
      </RefreshProvider>
    </Theme>
  )
}

export default App
