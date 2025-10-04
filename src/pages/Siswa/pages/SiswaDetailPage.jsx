import { useParams, useNavigate } from 'react-router-dom'
import { useDetailSiswa } from '../hooks/useDetailSiswa'
import {
  DetailSiswaLayout,
  DetailLoadingState,
  DetailErrorState,
  DetailNotFoundState,
} from '../components/detail'

export function DetailSiswa() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { siswa, riwayatKelas, peminatan, tagihanData, loading, error } = useDetailSiswa(id)

  const handleBack = () => navigate('/siswa')

  if (loading) {
    return <DetailLoadingState />
  }

  if (error) {
    return <DetailErrorState error={error} onBack={handleBack} />
  }

  if (!siswa) {
    return <DetailNotFoundState onBack={handleBack} />
  }

  return (
    <DetailSiswaLayout
      siswa={siswa}
      riwayatKelas={riwayatKelas}
      peminatan={peminatan}
      tagihanData={tagihanData}
      onBack={handleBack}
    />
  )
}
