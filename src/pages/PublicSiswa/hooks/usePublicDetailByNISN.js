import { useCallback, useEffect, useMemo, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

// Grouping helper copied from Siswa hook to preserve identical formatting
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

    const totalTagihan = tagihan.rincian_tagihan?.reduce((sum, item) => sum + Number(item.jumlah || 0), 0) || 0
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

export function usePublicDetailByNISN(nisn) {
  const [siswa, setSiswa] = useState(null)
  const [riwayatKelas, setRiwayatKelas] = useState([])
  const [peminatan, setPeminatan] = useState([])
  const [tagihanData, setTagihanData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchViaRPC = useCallback(async (nisnParam) => {
    const { data, error } = await supabase.rpc('get_siswa_detail_by_nisn', { p_nisn: nisnParam })
    if (error) throw error
    return data
  }, [])

  const fetchManually = useCallback(async (nisnParam) => {
    const { data: siswaRow, error: siswaErr } = await supabase
      .from('siswa')
      .select('*')
      .eq('nisn', nisnParam)
      .maybeSingle()
    if (siswaErr) throw siswaErr
    if (!siswaRow) return { siswa: null }

    // Riwayat kelas + ref tables
    const [riwayatRes, kelasRes, tahunRes] = await Promise.all([
      supabase.from('riwayat_kelas_siswa').select('*').eq('id_siswa', siswaRow.id),
      supabase.from('kelas').select('*'),
      supabase.from('tahun_ajaran').select('*'),
    ])
    if (riwayatRes.error) throw riwayatRes.error
    if (kelasRes.error) throw kelasRes.error
    if (tahunRes.error) throw tahunRes.error

    const kelasMap = new Map((kelasRes.data || []).map(k => [k.id, k]))
    const tahunMap = new Map((tahunRes.data || []).map(t => [t.id, t]))
    const riwayatSorted = (riwayatRes.data || []).sort((a, b) => {
      const dateA = new Date(a.tanggal_masuk || 0)
      const dateB = new Date(b.tanggal_masuk || 0)
      return dateB - dateA
    })
    const riwayatData = riwayatSorted.map(r => ({
      ...r,
      kelas: kelasMap.get(r.id_kelas) ? { id: r.id_kelas, tingkat: kelasMap.get(r.id_kelas).tingkat, nama_sub_kelas: kelasMap.get(r.id_kelas).nama_sub_kelas } : null,
      tahun_ajaran: tahunMap.get(r.id_tahun_ajaran) ? { id: r.id_tahun_ajaran, nama: tahunMap.get(r.id_tahun_ajaran).nama, tanggal_mulai: tahunMap.get(r.id_tahun_ajaran).tanggal_mulai, tanggal_selesai: tahunMap.get(r.id_tahun_ajaran).tanggal_selesai } : null,
    }))

    // Peminatan + ref tables
    const [pemRows, pemMaster, pemTA] = await Promise.all([
      supabase.from('peminatan_siswa').select('*').eq('id_siswa', siswaRow.id),
      supabase.from('peminatan').select('*'),
      supabase.from('tahun_ajaran').select('*'),
    ])
    if (pemRows.error) throw pemRows.error
    if (pemMaster.error) throw pemMaster.error
    if (pemTA.error) throw pemTA.error

    const pemMap = new Map((pemMaster.data || []).map(p => [p.id, p]))
    const taMap = new Map((pemTA.data || []).map(t => [t.id, t]))
    const peminatanSorted = (pemRows.data || []).sort((a, b) => {
      const dateA = new Date(a.tanggal_mulai || 0)
      const dateB = new Date(b.tanggal_mulai || 0)
      return dateB - dateA
    })
    const peminatanData = peminatanSorted.map(p => ({
      ...p,
      peminatan: pemMap.get(p.id_peminatan) ? { id: p.id_peminatan, kode: pemMap.get(p.id_peminatan).kode, nama: pemMap.get(p.id_peminatan).nama } : null,
      tahun_ajaran: taMap.get(p.id_tahun_ajaran) ? { id: p.id_tahun_ajaran, nama: taMap.get(p.id_tahun_ajaran).nama } : null,
    }))

    // Tagihan + children
    let tagihanResult = []
    if (riwayatData.length > 0) {
      const rksIds = riwayatData.map(r => r.id)
      const { data: tagihanRows, error: tagihanErr } = await supabase
        .from('tagihan')
        .select('*')
        .in('id_riwayat_kelas_siswa', rksIds)
      if (tagihanErr) throw tagihanErr

      const tagihanIds = (tagihanRows || []).map(t => t.id)
      const [rincianRows, pembayaranRows, rpRows, jenisRows] = await Promise.all([
        tagihanIds.length ? supabase.from('rincian_tagihan').select('*').in('id_tagihan', tagihanIds) : { data: [], error: null },
        tagihanIds.length ? supabase.from('pembayaran').select('*').in('id_tagihan', tagihanIds) : { data: [], error: null },
        tagihanIds.length ? supabase.from('rincian_pembayaran').select('*').in('id_pembayaran', (await (async () => {
          // We need pembayaran ids first
          const ids = (pembayaranRows?.data || []).map(p => p.id)
          return ids.length ? ids : ['00000000-0000-0000-0000-000000000000'] // dummy to avoid empty IN
        })())) : { data: [], error: null },
        supabase.from('jenis_pembayaran').select('*'),
      ])
      if (rincianRows.error) throw rincianRows.error
      if (pembayaranRows.error) throw pembayaranRows.error
      if (rpRows.error) throw rpRows.error
      if (jenisRows.error) throw jenisRows.error

      const jenisMap = new Map((jenisRows.data || []).map(j => [j.id, j]))
      const rincianByTagihan = new Map((rincianRows.data || []).reduce((acc, r) => {
        r.jenis_pembayaran = jenisMap.get(r.id_jenis_pembayaran) ? { id: r.id_jenis_pembayaran, kode: jenisMap.get(r.id_jenis_pembayaran).kode, nama: jenisMap.get(r.id_jenis_pembayaran).nama } : null
        const arr = acc.get(r.id_tagihan) || []
        arr.push(r)
        acc.set(r.id_tagihan, arr)
        return acc
      }, new Map()))

      const rpByPembayaran = new Map((rpRows.data || []).reduce((acc, rp) => {
        const arr = acc.get(rp.id_pembayaran) || []
        arr.push(rp)
        acc.set(rp.id_pembayaran, arr)
        return acc
      }, new Map()))

      const pembayaranByTagihan = new Map((pembayaranRows.data || []).reduce((acc, p) => {
        const arr = acc.get(p.id_tagihan) || []
        arr.push({ ...p, rincian_pembayaran: rpByPembayaran.get(p.id) || [] })
        acc.set(p.id_tagihan, arr)
        return acc
      }, new Map()))

      tagihanResult = (tagihanRows || []).map(t => ({
        ...t,
        riwayat_kelas_siswa: {
          id: t.id_riwayat_kelas_siswa,
          kelas: (() => { const k = kelasMap.get(riwayatData.find(r=>r.id===t.id_riwayat_kelas_siswa)?.id_kelas); return k ? { tingkat: k.tingkat, nama_sub_kelas: k.nama_sub_kelas } : null })(),
          tahun_ajaran: (() => { const ta = tahunMap.get(riwayatData.find(r=>r.id===t.id_riwayat_kelas_siswa)?.id_tahun_ajaran); return ta ? { nama: ta.nama } : null })(),
        },
        rincian_tagihan: rincianByTagihan.get(t.id) || [],
        pembayaran: pembayaranByTagihan.get(t.id) || [],
      }))
    }

    return {
      siswa: siswaRow,
      riwayat_kelas: riwayatData,
      peminatan: peminatanData,
      tagihan: tagihanResult,
    }
  }, [])

  const fetchDetail = useCallback(async () => {
    if (!nisn) return
    setLoading(true)
    setError('')
    try {
      // Try RPC first for best RLS-compat and performance
      let payload
      try {
        payload = await fetchViaRPC(nisn)
      } catch (rpcErr) {
        // Fallback to manual selects (may fail if RLS blocks anon)
        payload = await fetchManually(nisn)
      }

      if (!payload || !payload.siswa) {
        setSiswa(null)
        setRiwayatKelas([])
        setPeminatan([])
        setTagihanData([])
        return
      }

      setSiswa(payload.siswa)
      setRiwayatKelas(payload.riwayat_kelas || [])
      setPeminatan(payload.peminatan || [])
      const grouped = groupTagihanByTahunAjaranKelas(payload.tagihan || [])
      setTagihanData(grouped)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [nisn, fetchViaRPC, fetchManually])

  useEffect(() => {
    fetchDetail()
  }, [fetchDetail])

  return useMemo(() => ({
    siswa,
    riwayatKelas,
    peminatan,
    tagihanData,
    loading,
    error,
    refreshData: fetchDetail,
  }), [siswa, riwayatKelas, peminatan, tagihanData, loading, error, fetchDetail])
}

