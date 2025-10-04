import { useState, useEffect } from 'react'
import { db } from '../../../offline/db'

export function useWaliKelasAmpu(waliKelasId) {
  const [data, setData] = useState({
    kelasList: [],
    siswaList: [],
    summary: {
      totalKelas: 0,
      totalSiswa: 0
    },
    loading: true
  })

  useEffect(() => {
    if (!waliKelasId) {
      setData({
        kelasList: [],
        siswaList: [],
        summary: {
          totalKelas: 0,
          totalSiswa: 0
        },
        loading: false
      })
      return
    }

    async function fetchData() {
      try {
        // Fetch all required data from IndexedDB
        const [tahunAjaranList, riwayatWaliKelasList, kelasList, riwayatKelasSiswaList, siswaList] = await Promise.all([
          db.tahun_ajaran.toArray(),
          db.riwayat_wali_kelas.toArray(),
          db.kelas.toArray(),
          db.riwayat_kelas_siswa.toArray(),
          db.siswa.toArray()
        ])

        // Find active tahun ajaran
        const tahunAjaranAktif = tahunAjaranList.find(ta => ta.status_aktif === true)
        if (!tahunAjaranAktif) {
          setData({
            kelasList: [],
            siswaList: [],
            summary: {
              totalKelas: 0,
              totalSiswa: 0
            },
            loading: false
          })
          return
        }

        // Find riwayat wali kelas for this wali kelas in active tahun ajaran
        const riwayatWaliKelas = riwayatWaliKelasList.filter(rwk => 
          rwk.id_wali_kelas === waliKelasId && 
          rwk.id_tahun_ajaran === tahunAjaranAktif.id &&
          rwk.status === 'aktif'
        )

        if (riwayatWaliKelas.length === 0) {
          setData({
            kelasList: [],
            siswaList: [],
            summary: {
              totalKelas: 0,
              totalSiswa: 0
            },
            loading: false
          })
          return
        }

        // Build kelas map for quick lookup
        const kelasMap = new Map()
        kelasList.forEach(k => kelasMap.set(k.id, k))

        // Build siswa map for quick lookup
        const siswaMap = new Map()
        siswaList.forEach(s => siswaMap.set(s.id, s))

        // Build kelas list with student count
        const kelasListData = riwayatWaliKelas.map(rwk => {
          const kelas = kelasMap.get(rwk.id_kelas)
          if (!kelas) return null

          // Count students in this kelas
          const siswaCount = riwayatKelasSiswaList.filter(rks => 
            rks.id_kelas === rwk.id_kelas &&
            rks.id_tahun_ajaran === rwk.id_tahun_ajaran &&
            rks.status === 'aktif'
          ).length

          return {
            id: kelas.id,
            tingkat: kelas.tingkat,
            namaSubKelas: kelas.nama_sub_kelas,
            kapasitasMaksimal: kelas.kapasitas_maksimal,
            jumlahSiswa: siswaCount,
            riwayatId: rwk.id
          }
        }).filter(Boolean)

        // Get all kelas IDs
        const kelasIds = kelasListData.map(k => k.id)

        // Build siswa list from all kelas
        const siswaListData = riwayatKelasSiswaList
          .filter(rks => 
            kelasIds.includes(rks.id_kelas) &&
            rks.id_tahun_ajaran === tahunAjaranAktif.id &&
            rks.status === 'aktif'
          )
          .map(rks => {
            const siswa = siswaMap.get(rks.id_siswa)
            const kelas = kelasMap.get(rks.id_kelas)
            if (!siswa || !kelas) return null

            return {
              id: siswa.id,
              namaLengkap: siswa.nama_lengkap,
              nisn: siswa.nisn,
              jenisKelamin: siswa.jenis_kelamin,
              tanggalLahir: siswa.tanggal_lahir,
              kelasId: kelas.id,
              kelasTingkat: kelas.tingkat,
              kelasNama: kelas.nama_sub_kelas,
              kelasLabel: `${kelas.tingkat} ${kelas.nama_sub_kelas}`
            }
          })
          .filter(Boolean)

        // Sort siswa by kelas then by name
        siswaListData.sort((a, b) => {
          const kelasCompare = a.kelasLabel.localeCompare(b.kelasLabel)
          if (kelasCompare !== 0) return kelasCompare
          return (a.namaLengkap || '').localeCompare(b.namaLengkap || '')
        })

        setData({
          kelasList: kelasListData,
          siswaList: siswaListData,
          summary: {
            totalKelas: kelasListData.length,
            totalSiswa: siswaListData.length
          },
          loading: false
        })
      } catch (err) {
        console.error('Error fetching wali kelas ampu:', err)
        setData({
          kelasList: [],
          siswaList: [],
          summary: {
            totalKelas: 0,
            totalSiswa: 0
          },
          loading: false
        })
      }
    }

    fetchData()
  }, [waliKelasId])

  return data
}
