import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'

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
      // Fetch data siswa
      const { data: siswaData, error: siswaError } = await supabase
        .from('siswa')
        .select('*')
        .eq('id', siswaId)
        .single()

      if (siswaError) throw siswaError
      setSiswa(siswaData)

      // Fetch riwayat kelas siswa
      const { data: riwayatData, error: riwayatError } = await supabase
        .from('riwayat_kelas_siswa')
        .select(`
          *,
          kelas:id_kelas(id, tingkat, nama_sub_kelas),
          tahun_ajaran:id_tahun_ajaran(id, nama, tanggal_mulai, tanggal_selesai)
        `)
        .eq('id_siswa', siswaId)
        .order('tanggal_masuk', { ascending: false })

      if (riwayatError) throw riwayatError
      setRiwayatKelas(riwayatData || [])

      // Fetch peminatan siswa
      const { data: peminatanData, error: peminatanError } = await supabase
        .from('peminatan_siswa')
        .select(`
          *,
          peminatan:id_peminatan(id, kode, nama),
          tahun_ajaran:id_tahun_ajaran(id, nama)
        `)
        .eq('id_siswa', siswaId)
        .order('tanggal_mulai', { ascending: false })

      if (peminatanError) throw peminatanError
      setPeminatan(peminatanData || [])

      // Fetch tagihan berdasarkan riwayat kelas siswa
      if (riwayatData && riwayatData.length > 0) {
        const riwayatIds = riwayatData.map(r => r.id)
        
        const { data: tagihanResult, error: tagihanError } = await supabase
          .from('tagihan')
          .select(`
            *,
            riwayat_kelas_siswa:id_riwayat_kelas_siswa(
              id,
              kelas:id_kelas(tingkat, nama_sub_kelas),
              tahun_ajaran:id_tahun_ajaran(nama)
            ),
            rincian_tagihan(
              id,
              deskripsi,
              jumlah,
              jenis_pembayaran:id_jenis_pembayaran(nama)
            ),
            pembayaran(
              id,
              nomor_pembayaran,
              tanggal_dibuat,
              rincian_pembayaran(
                id,
                nomor_transaksi,
                jumlah_dibayar,
                tanggal_bayar,
                metode_pembayaran
              )
            )
          `)
          .in('id_riwayat_kelas_siswa', riwayatIds)
          .order('tanggal_tagihan', { ascending: false })

        if (tagihanError) throw tagihanError
        
        // Group tagihan by tahun ajaran and kelas
        const groupedData = groupTagihanByTahunAjaranKelas(tagihanResult || [])
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
