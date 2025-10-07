import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../../../offline/db'

export function usePeminatanData() {
  const riwayatKelasSiswa = useLiveQuery(() => db.riwayat_kelas_siswa.toArray(), [], [])
  const kelasList = useLiveQuery(() => db.kelas.toArray(), [], [])
  const existingPeminatanSiswa = useLiveQuery(() => db.peminatan_siswa.toArray(), [], [])
  
  return {
    riwayatKelasSiswa,
    kelasList,
    existingPeminatanSiswa,
  }
}
