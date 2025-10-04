import { useState, useEffect } from 'react'
import { db } from '../../../offline/db'

export function useTahunAjaranStats(tahunAjaranId) {
  const [stats, setStats] = useState({
    totalSiswa: 0,
    totalKelas: 0,
    distribusiGender: {
      lakiLaki: 0,
      perempuan: 0,
      tidakDiketahui: 0
    },
    distribusiKelas: [],
    loading: true
  })

  useEffect(() => {
    if (!tahunAjaranId) {
      setStats({
        totalSiswa: 0,
        totalKelas: 0,
        distribusiGender: { lakiLaki: 0, perempuan: 0, tidakDiketahui: 0 },
        distribusiKelas: [],
        loading: false
      })
      return
    }

    async function fetchStats() {
      try {
        // Fetch all data from IndexedDB
        const [allRks, allKelas, allSiswa] = await Promise.all([
          db.riwayat_kelas_siswa.toArray(),
          db.kelas.toArray(),
          db.siswa.toArray()
        ])

        // Filter riwayat_kelas_siswa untuk tahun ajaran ini dan status aktif
        const rksFiltered = allRks.filter(
          r => r.id_tahun_ajaran === tahunAjaranId && (r.status || '').toLowerCase() === 'aktif'
        )

        // Get unique siswa IDs
        const siswaIds = new Set(rksFiltered.map(r => r.id_siswa))
        const totalSiswa = siswaIds.size

        // Get siswa data untuk distribusi gender
        const siswaInTahunAjaran = allSiswa.filter(s => siswaIds.has(s.id))
        
        const distribusiGender = {
          lakiLaki: siswaInTahunAjaran.filter(s => s.jenis_kelamin === 'Laki-laki').length,
          perempuan: siswaInTahunAjaran.filter(s => s.jenis_kelamin === 'Perempuan').length,
          tidakDiketahui: siswaInTahunAjaran.filter(s => !s.jenis_kelamin || (s.jenis_kelamin !== 'Laki-laki' && s.jenis_kelamin !== 'Perempuan')).length
        }

        // Build kelas map
        const kelasMap = new Map(allKelas.map(k => [k.id, k]))

        // Build siswa map
        const siswaMap = new Map(allSiswa.map(s => [s.id, s]))

        // Group siswa by kelas with gender breakdown
        const kelasSiswaData = new Map()
        rksFiltered.forEach(r => {
          const siswa = siswaMap.get(r.id_siswa)
          const kelasData = kelasSiswaData.get(r.id_kelas) || {
            total: 0,
            lakiLaki: 0,
            perempuan: 0,
            tidakDiketahui: 0
          }
          
          kelasData.total++
          
          if (siswa) {
            if (siswa.jenis_kelamin === 'Laki-laki') {
              kelasData.lakiLaki++
            } else if (siswa.jenis_kelamin === 'Perempuan') {
              kelasData.perempuan++
            } else {
              kelasData.tidakDiketahui++
            }
          } else {
            kelasData.tidakDiketahui++
          }
          
          kelasSiswaData.set(r.id_kelas, kelasData)
        })

        // Build distribusi kelas (flat list)
        const distribusiKelasList = Array.from(kelasSiswaData.entries())
          .map(([kelasId, data]) => {
            const kelas = kelasMap.get(kelasId)
            return {
              id: kelasId,
              tingkat: kelas?.tingkat || '-',
              namaSubKelas: kelas?.nama_sub_kelas || '-',
              jumlahSiswa: data.total,
              lakiLaki: data.lakiLaki,
              perempuan: data.perempuan,
              tidakDiketahui: data.tidakDiketahui
            }
          })
          .sort((a, b) => {
            // Sort by tingkat, then by nama_sub_kelas
            if (a.tingkat !== b.tingkat) {
              return (a.tingkat || '').localeCompare(b.tingkat || '')
            }
            return (a.namaSubKelas || '').localeCompare(b.namaSubKelas || '')
          })

        // Group by tingkat (nested structure)
        const tingkatMap = new Map()
        distribusiKelasList.forEach(kelas => {
          const tingkat = kelas.tingkat
          if (!tingkatMap.has(tingkat)) {
            tingkatMap.set(tingkat, {
              tingkat: tingkat,
              totalSiswa: 0,
              lakiLaki: 0,
              perempuan: 0,
              tidakDiketahui: 0,
              kelasList: []
            })
          }
          
          const tingkatData = tingkatMap.get(tingkat)
          tingkatData.totalSiswa += kelas.jumlahSiswa
          tingkatData.lakiLaki += kelas.lakiLaki
          tingkatData.perempuan += kelas.perempuan
          tingkatData.tidakDiketahui += kelas.tidakDiketahui
          tingkatData.kelasList.push(kelas)
        })

        // Convert to array and sort
        const distribusiKelas = Array.from(tingkatMap.values())
          .sort((a, b) => (a.tingkat || '').localeCompare(b.tingkat || ''))

        // Count unique kelas with students
        const totalKelas = distribusiKelasList.length

        setStats({
          totalSiswa,
          totalKelas,
          distribusiGender,
          distribusiKelas,
          loading: false
        })
      } catch (err) {
        console.error('Error fetching tahun ajaran stats:', err)
        setStats({
          totalSiswa: 0,
          totalKelas: 0,
          distribusiGender: { lakiLaki: 0, perempuan: 0, tidakDiketahui: 0 },
          distribusiKelas: [],
          loading: false
        })
      }
    }

    fetchStats()
  }, [tahunAjaranId])

  return stats
}
