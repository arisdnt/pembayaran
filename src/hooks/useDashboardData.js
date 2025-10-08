import { useState, useEffect, useCallback } from 'react'
import { useAppRefresh } from './useAppRefresh'
import { useRefreshContext } from '../contexts/RefreshContext'
import { db } from '../offline/db'

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
  const { setIsRefreshing } = useRefreshContext()
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

  const fetchDashboardData = useCallback(async (isBackgroundRefresh = false) => {
    try {
      // Skip if filters is null (waiting for master data)
      if (!filters) {
        return
      }

      // Hanya set loading true jika bukan background refresh
      if (!isBackgroundRefresh) {
        setLoading(true)
      } else {
        setIsRefreshing(true)
      }
      setError(null)

      // Determine tahun ajaran to use ('' or null means "all years")
      const tahunAjaranId = filters.tahunAjaran || null

      // Get date range filter
      const startDate = getDateRange(filters.timeRange || 'all')

      // OPTIMIZED: Load only critical data first using indexed queries
      const [allRks, kelas, siswa] = await Promise.all([
        // If filtering by tahun ajaran, use indexed query; otherwise load all
        tahunAjaranId
          ? db.riwayat_kelas_siswa.where('id_tahun_ajaran').equals(tahunAjaranId).toArray()
          : db.riwayat_kelas_siswa.toArray(),
        db.kelas.toArray(),
        db.siswa.toArray(),
      ])

      // Filter active status in memory (compound index needs string values)
      const rksActive = allRks.filter(r => (r.status || '').toLowerCase() === 'aktif')

      // Filter by kelas/tingkat if needed
      const kelasMap = new Map(kelas.map(k => [k.id, k]))
      const rksFiltered = rksActive
        .filter(r => (filters.kelas ? r.id_kelas === filters.kelas : true))
        .filter(r => (filters.tingkat ? (kelasMap.get(r.id_kelas)?.tingkat === filters.tingkat) : true))

      const rksIdsFilter = new Set(rksFiltered.map(r => r.id))

      // OPTIMIZED: Load secondary data only for filtered rks
      const [tagihan, rincianTagihan, pembayaran, rincianPembayaran] = await Promise.all([
        // Guard against anyOf([]) which can error; return [] if no rks
        rksIdsFilter.size > 0
          ? db.tagihan.where('id_riwayat_kelas_siswa').anyOf(Array.from(rksIdsFilter)).toArray()
          : Promise.resolve([]),
        db.rincian_tagihan.toArray(),
        db.pembayaran.toArray(),
        db.rincian_pembayaran.toArray(),
      ])

      const totalSiswa = rksFiltered.length

      // Tagihan already filtered by rks from indexed query, just apply date filter
      const tagihanFiltered = tagihan
        .filter(t => (startDate ? (new Date(t.tanggal_tagihan) >= new Date(startDate)) : true))
      const totalTagihan = tagihanFiltered.length

      const rincianByTagihan = new Map(
        rincianTagihan.reduce((acc, r) => {
          const arr = acc.get(r.id_tagihan) || []
          arr.push(r)
          acc.set(r.id_tagihan, arr)
          return acc
        }, new Map())
      )

      const rpByPembayaran = new Map(
        rincianPembayaran.reduce((acc, rp) => {
          const arr = acc.get(rp.id_pembayaran) || []
          arr.push(rp)
          acc.set(rp.id_pembayaran, arr)
          return acc
        }, new Map())
      )

      const pembayaranFiltered = pembayaran
        .filter(p => rksIdsFilter.has(tagihan.find(t => t.id === p.id_tagihan)?.id_riwayat_kelas_siswa))
        .filter(p => (startDate ? (new Date(p.diperbarui_pada) >= new Date(startDate)) : true))
      const totalPembayaran = pembayaranFiltered.reduce(
        (sum, p) => sum + (rpByPembayaran.get(p.id) || []).reduce((s, r) => s + Number(r.jumlah_dibayar || 0), 0),
        0
      )

      const totalTagihanAmount = tagihanFiltered.reduce(
        (sum, t) => sum + (rincianByTagihan.get(t.id) || []).reduce((s, r) => s + Number(r.jumlah || 0), 0),
        0
      )
      const totalTunggakan = Math.max(totalTagihanAmount - totalPembayaran, 0)

      // Chart - pembayaran per bulan
      const pembayaranPerBulanRaw = rincianPembayaran
        .filter(r => (startDate ? (new Date(r.tanggal_bayar) >= new Date(startDate)) : true))
        .filter(r => {
          const p = pembayaran.find(p => p.id === r.id_pembayaran)
          const t = p && tagihan.find(t => t.id === p.id_tagihan)
          return t && rksIdsFilter.has(t.id_riwayat_kelas_siswa)
        })
        .reduce((acc, r) => {
          const d = new Date(r.tanggal_bayar)
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
          acc[key] = (acc[key] || 0) + Number(r.jumlah_dibayar || 0)
          return acc
        }, {})

      // Generate consistent month keys based on timeRange
      const now = new Date()
      let monthsToShow = 6 // default
      
      switch (filters.timeRange) {
        case 'today':
        case 'week':
          monthsToShow = 1
          break
        case 'month':
          monthsToShow = 2
          break
        case 'quarter':
          monthsToShow = 3
          break
        case 'semester':
          monthsToShow = 6
          break
        case 'year':
          monthsToShow = 12
          break
        case 'all':
          monthsToShow = 12 // show last 12 months for "all"
          break
      }

      const monthKeys = []
      for (let i = monthsToShow - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        monthKeys.push(key)
      }

      const pembayaranPerBulan = monthKeys.reduce((acc, key) => {
        acc[key] = pembayaranPerBulanRaw[key] || 0
        return acc
      }, {})

      // Status pembayaran (lunas vs belum) berdasarkan total vs paid
      const statusPembayaran = tagihanFiltered.map(t => {
        const total = (rincianByTagihan.get(t.id) || []).reduce((s, r) => s + Number(r.jumlah || 0), 0)
        const paid = pembayaranFiltered
          .filter(p => p.id_tagihan === t.id)
          .reduce((sum, p) => sum + (rpByPembayaran.get(p.id) || []).reduce((s, r) => s + Number(r.jumlah_dibayar || 0), 0), 0)
        return { total, paid }
      })
      const lunasCount = statusPembayaran.filter(s => s.paid >= s.total).length
      const belumCount = statusPembayaran.length - lunasCount

      // Recent
      const tagihanTerbaru = [...tagihanFiltered]
        .sort((a, b) => new Date(b.tanggal_tagihan) - new Date(a.tanggal_tagihan))
        .slice(0, 5)
        .map(t => ({
          id: t.id,
          nomor_tagihan: t.nomor_tagihan,
          judul: t.judul,
          tanggal_tagihan: t.tanggal_tagihan,
          riwayat_kelas_siswa: (() => {
            const rRow = rksActive.find(r => r.id === t.id_riwayat_kelas_siswa)
            const sRow = siswa.find(s => s.id === rRow?.id_siswa)
            const kRow = kelasMap.get(rRow?.id_kelas)
            return {
              siswa: sRow ? { nama_lengkap: sRow.nama_lengkap } : null,
              kelas: kRow ? { tingkat: kRow.tingkat, nama_sub_kelas: kRow.nama_sub_kelas } : null,
            }
          })(),
          rincian_tagihan: rincianByTagihan.get(t.id) || [],
        }))

      const pembayaranPending = rincianPembayaran
        .filter(r => (r.status || '').toLowerCase() === 'pending')
        .filter(r => {
          const p = pembayaran.find(p => p.id === r.id_pembayaran)
          const t = p && tagihan.find(t => t.id === p.id_tagihan)
          const rRow = t && rksActive.find(x => x.id === t.id_riwayat_kelas_siswa)
          if (!rRow) return false
          if (filters.kelas && rRow.id_kelas !== filters.kelas) return false
          if (filters.tingkat && kelasMap.get(rRow.id_kelas)?.tingkat !== filters.tingkat) return false
          if (startDate && new Date(r.tanggal_bayar) < new Date(startDate)) return false
          return true
        })
        .sort((a, b) => new Date(b.tanggal_bayar) - new Date(a.tanggal_bayar))
        .slice(0, 5)
        .map(r => {
          const p = pembayaran.find(p => p.id === r.id_pembayaran)
          const t = p && tagihan.find(t => t.id === p.id_tagihan)
          const rRow = t && rksActive.find(x => x.id === t.id_riwayat_kelas_siswa)
          const sRow = rRow && siswa.find(s => s.id === rRow.id_siswa)
          return {
            id: r.id,
            nomor_transaksi: r.nomor_transaksi,
            jumlah_dibayar: r.jumlah_dibayar,
            tanggal_bayar: r.tanggal_bayar,
            pembayaran: {
              nomor_pembayaran: p?.nomor_pembayaran,
              tagihan: {
                nomor_tagihan: t?.nomor_tagihan,
                riwayat_kelas_siswa: {
                  siswa: { nama_lengkap: sRow?.nama_lengkap },
                  kelas: { tingkat: kelasMap.get(rRow?.id_kelas)?.tingkat },
                }
              }
            }
          }
        })

      setData({
        stats: {
          totalSiswa,
          totalTagihan,
          totalPembayaran,
          totalTunggakan,
          siswaAktif: totalSiswa,
          tagihanBelumLunas: tagihanFiltered.filter((t) => {
            const total = (rincianByTagihan.get(t.id) || []).reduce((s, r) => s + Number(r.jumlah || 0), 0)
            const paid = pembayaranFiltered
              .filter(p => p.id_tagihan === t.id)
              .reduce((sum, p) => sum + (rpByPembayaran.get(p.id) || []).reduce((s, r) => s + Number(r.jumlah_dibayar || 0), 0), 0)
            return total - paid > 0
          }).length
        },
        chartData: {
          pembayaranPerBulan: Object.entries(pembayaranPerBulan).map(([bulan, total]) => ({ bulan, total })),
          statusPembayaran: [
            { label: 'Lunas', value: lunasCount },
            { label: 'Belum Lunas', value: belumCount },
          ],
          pembayaranPerTingkat: [],
        },
        recentData: {
          tagihanTerbaru,
          pembayaranPending,
        }
      })

    } catch (err) {
      console.error('Error fetching dashboard:', err)
      setError(err.message)
    } finally {
      setLoading(false)
      setIsRefreshing(false)
    }
  }, [filters, setIsRefreshing])

  const handleAppRefresh = useCallback(() => fetchDashboardData(true), [fetchDashboardData])
  useAppRefresh(handleAppRefresh)

  useEffect(() => {
    fetchDashboardData(false)
  }, [fetchDashboardData])

  return { data, loading, error, refresh: () => fetchDashboardData(false) }
}
