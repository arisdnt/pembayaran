import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAppRefresh } from './useAppRefresh'

function getDateRange(timeRange) {
  const now = new Date()
  let startDate = null

  switch (timeRange) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0))
      break
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7))
      break
    case 'month':
      startDate = new Date(now.setDate(now.getDate() - 30))
      break
    case 'quarter':
      startDate = new Date(now.setMonth(now.getMonth() - 3))
      break
    case 'semester':
      startDate = new Date(now.setMonth(now.getMonth() - 6))
      break
    case 'year':
      startDate = new Date(now.getFullYear(), 0, 1)
      break
    case 'all':
    default:
      startDate = null
  }

  return startDate?.toISOString()
}

export function useDashboardData(filters = {}) {
  const [data, setData] = useState({
    stats: {
      totalSiswa: 0,
      totalTagihan: 0,
      totalPembayaran: 0,
      totalTunggakan: 0,
      siswaAktif: 0,
      tagihanBelumLunas: 0
    },
    chartData: {
      pembayaranPerBulan: [],
      statusPembayaran: [],
      pembayaranPerTingkat: []
    },
    recentData: {
      tagihanTerbaru: [],
      pembayaranPending: []
    }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Determine tahun ajaran to use
      let tahunAjaranId = filters.tahunAjaran
      
      if (!tahunAjaranId) {
        const { data: tahunAktif } = await supabase
          .from('tahun_ajaran')
          .select('id')
          .eq('status_aktif', true)
          .single()

        if (!tahunAktif) {
          throw new Error('Tidak ada tahun ajaran aktif')
        }
        
        tahunAjaranId = tahunAktif.id
      }

      // Get date range filter
      const startDate = getDateRange(filters.timeRange || 'all')

      // Parallel fetch untuk performa
      const [
        siswaResult,
        tagihanResult,
        pembayaranResult,
        rincianPembayaranResult,
        tagihanTerbaruResult,
        pembayaranPendingResult
      ] = await Promise.all([
        // Total siswa aktif tahun ini
        (() => {
          let query = supabase
            .from('riwayat_kelas_siswa')
            .select('id, siswa:id_siswa(id), kelas:id_kelas(tingkat)', { count: 'exact', head: false })
            .eq('id_tahun_ajaran', tahunAjaranId)
            .eq('status', 'aktif')
          
          if (filters.kelas) {
            query = query.eq('id_kelas', filters.kelas)
          } else if (filters.tingkat) {
            query = query.eq('kelas.tingkat', filters.tingkat)
          }
          
          return query
        })(),

        // Tagihan tahun ini dengan rincian
        (() => {
          let query = supabase
            .from('tagihan')
            .select(`
              id, tanggal_tagihan,
              riwayat_kelas_siswa!inner(id, id_tahun_ajaran, id_kelas, kelas:id_kelas(tingkat)),
              rincian_tagihan(jumlah)
            `)
            .eq('riwayat_kelas_siswa.id_tahun_ajaran', tahunAjaranId)
          
          if (filters.kelas) {
            query = query.eq('riwayat_kelas_siswa.id_kelas', filters.kelas)
          } else if (filters.tingkat) {
            query = query.eq('riwayat_kelas_siswa.kelas.tingkat', filters.tingkat)
          }
          
          if (startDate) {
            query = query.gte('tanggal_tagihan', startDate)
          }
          
          return query
        })(),

        // Pembayaran tahun ini
        (() => {
          let query = supabase
            .from('pembayaran')
            .select(`
              id, tanggal_dibuat,
              tagihan!inner(
                id,
                riwayat_kelas_siswa!inner(id_tahun_ajaran, id_kelas, kelas:id_kelas(tingkat))
              )
            `)
            .eq('tagihan.riwayat_kelas_siswa.id_tahun_ajaran', tahunAjaranId)
          
          if (filters.kelas) {
            query = query.eq('tagihan.riwayat_kelas_siswa.id_kelas', filters.kelas)
          } else if (filters.tingkat) {
            query = query.eq('tagihan.riwayat_kelas_siswa.kelas.tingkat', filters.tingkat)
          }
          
          if (startDate) {
            query = query.gte('tanggal_dibuat', startDate)
          }
          
          return query
        })(),

        // Rincian pembayaran untuk perhitungan
        (() => {
          let query = supabase
            .from('rincian_pembayaran')
            .select(`
              jumlah_dibayar, status, tanggal_bayar,
              pembayaran!inner(
                tagihan!inner(
                  riwayat_kelas_siswa!inner(id_tahun_ajaran, id_kelas, kelas:id_kelas(tingkat))
                )
              )
            `)
            .eq('pembayaran.tagihan.riwayat_kelas_siswa.id_tahun_ajaran', tahunAjaranId)
          
          if (filters.kelas) {
            query = query.eq('pembayaran.tagihan.riwayat_kelas_siswa.id_kelas', filters.kelas)
          } else if (filters.tingkat) {
            query = query.eq('pembayaran.tagihan.riwayat_kelas_siswa.kelas.tingkat', filters.tingkat)
          }
          
          if (startDate) {
            query = query.gte('tanggal_bayar', startDate)
          }
          
          return query
        })(),

        // 5 Tagihan terbaru
        (() => {
          let query = supabase
            .from('tagihan')
            .select(`
              id, nomor_tagihan, judul, tanggal_tagihan,
              riwayat_kelas_siswa!inner(
                id_kelas,
                siswa:id_siswa(nama_lengkap),
                kelas:id_kelas(tingkat, nama_sub_kelas)
              ),
              rincian_tagihan(jumlah)
            `)
            .eq('riwayat_kelas_siswa.id_tahun_ajaran', tahunAjaranId)
          
          if (filters.kelas) {
            query = query.eq('riwayat_kelas_siswa.id_kelas', filters.kelas)
          } else if (filters.tingkat) {
            query = query.eq('riwayat_kelas_siswa.kelas.tingkat', filters.tingkat)
          }
          
          if (startDate) {
            query = query.gte('tanggal_tagihan', startDate)
          }
          
          return query.order('tanggal_tagihan', { ascending: false }).limit(5)
        })(),

        // 5 Pembayaran pending verification
        (() => {
          let query = supabase
            .from('rincian_pembayaran')
            .select(`
              id, nomor_transaksi, jumlah_dibayar, tanggal_bayar,
              pembayaran!inner(
                nomor_pembayaran,
                tagihan!inner(
                  nomor_tagihan,
                  riwayat_kelas_siswa!inner(
                    id_kelas,
                    siswa:id_siswa(nama_lengkap),
                    kelas:id_kelas(tingkat),
                    id_tahun_ajaran
                  )
                )
              )
            `)
            .eq('status', 'pending')
            .eq('pembayaran.tagihan.riwayat_kelas_siswa.id_tahun_ajaran', tahunAjaranId)
          
          if (filters.kelas) {
            query = query.eq('pembayaran.tagihan.riwayat_kelas_siswa.id_kelas', filters.kelas)
          } else if (filters.tingkat) {
            query = query.eq('pembayaran.tagihan.riwayat_kelas_siswa.kelas.tingkat', filters.tingkat)
          }
          
          if (startDate) {
            query = query.gte('tanggal_bayar', startDate)
          }
          
          return query.order('tanggal_bayar', { ascending: false }).limit(5)
        })()
      ])

      // Calculate stats
      const totalSiswa = siswaResult.count || 0
      const totalTagihan = tagihanResult.data?.length || 0
      const totalPembayaran = pembayaranResult.data?.length || 0

      const totalNominalTagihan = tagihanResult.data?.reduce((sum, t) => {
        const subtotal = t.rincian_tagihan?.reduce((s, r) => s + parseFloat(r.jumlah || 0), 0) || 0
        return sum + subtotal
      }, 0) || 0

      const totalNominalBayar = rincianPembayaranResult.data
        ?.filter(r => r.status === 'verified')
        .reduce((sum, r) => sum + parseFloat(r.jumlah_dibayar || 0), 0) || 0

      const totalTunggakan = totalNominalTagihan - totalNominalBayar

      // Process data
      setData({
        stats: {
          totalSiswa,
          totalTagihan,
          totalPembayaran,
          totalTunggakan,
          siswaAktif: totalSiswa,
          tagihanBelumLunas: tagihanResult.data?.length || 0
        },
        chartData: processChartData(rincianPembayaranResult.data, tagihanResult.data),
        recentData: {
          tagihanTerbaru: tagihanTerbaruResult.data || [],
          pembayaranPending: pembayaranPendingResult.data || []
        }
      })

    } catch (err) {
      console.error('Error fetching dashboard:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const handleAppRefresh = useCallback(() => fetchDashboardData(), [fetchDashboardData])
  useAppRefresh(handleAppRefresh)

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])

  return { data, loading, error, refresh: fetchDashboardData }
}

function processChartData(rincianPembayaran, tagihan) {
  // Pembayaran per bulan (6 bulan terakhir)
  const pembayaranPerBulan = getPembayaranPerBulan(rincianPembayaran)
  
  // Status pembayaran (verified, pending, rejected)
  const statusPembayaran = getStatusPembayaran(rincianPembayaran)
  
  // Pembayaran per tingkat
  const pembayaranPerTingkat = getPembayaranPerTingkat(tagihan)

  return { pembayaranPerBulan, statusPembayaran, pembayaranPerTingkat }
}

function getPembayaranPerBulan(data) {
  const months = {}

  // Kumpulkan semua pembayaran verified
  data?.filter(r => r.status === 'verified').forEach(r => {
    const date = new Date(r.tanggal_bayar)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    if (!months[key]) {
      months[key] = { month: key, total: 0 }
    }
    months[key].total += parseFloat(r.jumlah_dibayar || 0)
  })

  // Jika tidak ada data, return array kosong
  if (Object.keys(months).length === 0) {
    return []
  }

  // Sort by month key
  return Object.values(months).sort((a, b) => a.month.localeCompare(b.month))
}

function getStatusPembayaran(data) {
  const status = { verified: 0, pending: 0, rejected: 0 }
  data?.forEach(r => {
    if (status[r.status] !== undefined) {
      status[r.status]++
    }
  })
  return Object.entries(status).map(([name, value]) => ({ name, value }))
}

function getPembayaranPerTingkat(tagihan) {
  const tingkat = {}
  tagihan?.forEach(t => {
    const tk = t.riwayat_kelas_siswa?.kelas?.tingkat || 'Unknown'
    if (!tingkat[tk]) tingkat[tk] = 0
    tingkat[tk]++
  })
  return Object.entries(tingkat).map(([name, value]) => ({ name, value }))
}
