import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Theme } from '@radix-ui/themes'
import { Login } from './pages/Login'
import { Dashboard } from './pages/Dashboard'
import { Siswa } from './pages/Siswa/index'
import { DetailSiswa } from './pages/Siswa/DetailSiswa'
import { Kelas } from './pages/Kelas/index'
import { TahunAjaran } from './pages/TahunAjaran'
import { RiwayatKelasSiswa } from './pages/RiwayatKelasSiswa/index'
import { WaliKelas } from './pages/WaliKelas/index'
import { RiwayatWaliKelas } from './pages/RiwayatWaliKelas/index'
import { Peminatan } from './pages/Peminatan/index'
import { PeminatanSiswa } from './pages/PeminatanSiswa/index'
import { JenisPembayaran } from './pages/JenisPembayaran/index'
import { Tagihan } from './pages/Tagihan/index'
import { CreateTagihan } from './pages/Tagihan/CreateTagihan'
import { EditTagihan } from './pages/Tagihan/EditTagihan'
import { Pembayaran } from './pages/Pembayaran/index'
import { CreatePembayaran } from './pages/Pembayaran/CreatePembayaran'
import { EditPembayaran } from './pages/Pembayaran/EditPembayaran'
import { DetailPembayaran } from './pages/Pembayaran/DetailPembayaran'
import { UbahPassword } from './pages/UbahPassword'
import { ProtectedShell } from './components/ProtectedShell'

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
]

function App() {
  return (
    <Theme accentColor="indigo" grayColor="slate">
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            {routes.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Theme>
  )
}

export default App
