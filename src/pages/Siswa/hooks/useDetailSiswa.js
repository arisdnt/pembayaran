import { useEffect, useState, useCallback } from 'react'
import { db } from '../../../offline/db'

export function useDetailSiswa(siswaId) {
  const [siswa, setSiswa] = useState(null)
  const [riwayatKelas, setRiwayatKelas] = useState([])
  const [peminatan, setPeminatan] = useState([])
  const [tagihanData, setTagihanData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchDetailSiswa = useCallback(async () => {
    if (!siswaId) return

    setLoading(true)
    setError('')

    try {
      // Fetch data siswa dari IndexedDB
      const siswaData = await db.siswa.get(siswaId)
      if (!siswaData) throw new Error('Data siswa tidak ditemukan secara lokal')
      setSiswa(siswaData)

      // Fetch riwayat kelas siswa
      const rawRiwayatAll = await db.riwayat_kelas_siswa.where('id_siswa').equals(siswaId).toArray()
      const rawRiwayat = rawRiwayatAll.sort((a, b) => {
        const dateA = new Date(a.tanggal_masuk || 0)
        const dateB = new Date(b.tanggal_masuk || 0)
        return dateB - dateA // descending (newest first)
      })
      const kelasMap = new Map((await db.kelas.toArray()).map(k => [k.id, k]))
      const tahunMap = new Map((await db.tahun_ajaran.toArray()).map(t => [t.id, t]))
      const riwayatData = rawRiwayat.map(r => ({
        ...r,
        kelas: kelasMap.get(r.id_kelas) ? { id: r.id_kelas, tingkat: kelasMap.get(r.id_kelas).tingkat, nama_sub_kelas: kelasMap.get(r.id_kelas).nama_sub_kelas } : null,
        tahun_ajaran: tahunMap.get(r.id_tahun_ajaran) ? { id: r.id_tahun_ajaran, nama: tahunMap.get(r.id_tahun_ajaran).nama, tanggal_mulai: tahunMap.get(r.id_tahun_ajaran).tanggal_mulai, tanggal_selesai: tahunMap.get(r.id_tahun_ajaran).tanggal_selesai } : null,
      }))
      setRiwayatKelas(riwayatData)

      // Fetch peminatan siswa
      const rawPeminatanAll = await db.peminatan_siswa.where('id_siswa').equals(siswaId).toArray()
      const rawPeminatan = rawPeminatanAll.sort((a, b) => {
        const dateA = new Date(a.tanggal_mulai || 0)
        const dateB = new Date(b.tanggal_mulai || 0)
        return dateB - dateA // descending (newest first)
      })
      const peminatanMap = new Map((await db.peminatan.toArray()).map(p => [p.id, p]))
      const pemTA = new Map((await db.tahun_ajaran.toArray()).map(t => [t.id, t]))
      const peminatanData = rawPeminatan.map(p => ({
        ...p,
        peminatan: peminatanMap.get(p.id_peminatan) ? { id: p.id_peminatan, kode: peminatanMap.get(p.id_peminatan).kode, nama: peminatanMap.get(p.id_peminatan).nama } : null,
        tahun_ajaran: pemTA.get(p.id_tahun_ajaran) ? { id: p.id_tahun_ajaran, nama: pemTA.get(p.id_tahun_ajaran).nama } : null,
      }))
      setPeminatan(peminatanData)

      // Fetch tagihan berdasarkan riwayat kelas siswa
      if (riwayatData && riwayatData.length > 0) {
        const riwayatIds = riwayatData.map(r => r.id)
        const allTagihan = (await db.tagihan.toArray()).filter(t => riwayatIds.includes(t.id_riwayat_kelas_siswa))
        // Build joins locally
        const rincianByTagihan = new Map((await db.rincian_tagihan.toArray()).reduce((acc, r) => {
          const arr = acc.get(r.id_tagihan) || []
          arr.push(r)
          acc.set(r.id_tagihan, arr)
          return acc
        }, new Map()))
        const pembayaranByTagihan = new Map((await db.pembayaran.toArray()).reduce((acc, p) => {
          const arr = acc.get(p.id_tagihan) || []
          arr.push(p)
          acc.set(p.id_tagihan, arr)
          return acc
        }, new Map()))
        const rpByPembayaran = new Map((await db.rincian_pembayaran.toArray()).reduce((acc, rp) => {
          const arr = acc.get(rp.id_pembayaran) || []
          arr.push(rp)
          acc.set(rp.id_pembayaran, arr)
          return acc
        }, new Map()))

        const tagihanResult = allTagihan.map(t => ({
          ...t,
          riwayat_kelas_siswa: {
            id: t.id_riwayat_kelas_siswa,
            kelas: (() => { const k = kelasMap.get(riwayatData.find(r=>r.id===t.id_riwayat_kelas_siswa)?.id_kelas); return k ? { tingkat: k.tingkat, nama_sub_kelas: k.nama_sub_kelas } : null })(),
            tahun_ajaran: (() => { const ta = tahunMap.get(riwayatData.find(r=>r.id===t.id_riwayat_kelas_siswa)?.id_tahun_ajaran); return ta ? { nama: ta.nama } : null })(),
          },
          rincian_tagihan: rincianByTagihan.get(t.id) || [],
          pembayaran: (pembayaranByTagihan.get(t.id) || []).map(p => ({ ...p, rincian_pembayaran: rpByPembayaran.get(p.id) || [] })),
        }))

        const groupedData = groupTagihanByTahunAjaranKelas(tagihanResult)
        setTagihanData(groupedData)
      }

    } catch (err) {
      setError(err.message)
      console.error('Error fetching detail siswa:', err)
    } finally {
      setLoading(false)
    }
  }, [siswaId])

  useEffect(() => {
    fetchDetailSiswa()
  }, [fetchDetailSiswa])

  return {
    siswa,
    riwayatKelas,
    peminatan,
    tagihanData,
    loading,
    error,
    refreshData: fetchDetailSiswa,
  }
}

function groupTagihanByTahunAjaranKelas(tagihanList) {
  const grouped = {}

  tagihanList.forEach(tagihan => {
    const tahunAjaran = tagihan.riwayat_kelas_siswa?.tahun_ajaran?.nama || 'Tidak diketahui'
    const kelas = tagihan.riwayat_kelas_siswa?.kelas
      ? `${tagihan.riwayat_kelas_siswa.kelas.tingkat} ${tagihan.riwayat_kelas_siswa.kelas.nama_sub_kelas}`
      : 'Tidak diketahui'
    
    const key = `${tahunAjaran}|${kelas}`

    if (!grouped[key]) {
      grouped[key] = {
        tahunAjaran,
        kelas,
        tagihan: [],
        totalTagihan: 0,
        totalDibayar: 0,
      }
    }

    // Calculate total tagihan
    const totalTagihan = tagihan.rincian_tagihan?.reduce((sum, item) => sum + Number(item.jumlah || 0), 0) || 0
    
    // Calculate total dibayar
    const totalDibayar = tagihan.pembayaran?.reduce((sum, pembayaran) => {
      return sum + (pembayaran.rincian_pembayaran?.reduce((s, r) => s + Number(r.jumlah_dibayar || 0), 0) || 0)
    }, 0) || 0

    grouped[key].tagihan.push({
      ...tagihan,
      totalTagihan,
      totalDibayar,
      sisaTagihan: totalTagihan - totalDibayar,
    })

    grouped[key].totalTagihan += totalTagihan
    grouped[key].totalDibayar += totalDibayar
  })

  return Object.values(grouped).map(group => ({
    ...group,
    sisaTagihan: group.totalTagihan - group.totalDibayar,
  }))
}
