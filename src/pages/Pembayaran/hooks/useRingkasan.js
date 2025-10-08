import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../offline/db'

export function useRingkasan(dateFilter, startDate, endDate) {
  const rincianPembayaran = useLiveQuery(
    async () => db.rincian_pembayaran.toArray(),
    [],
    undefined
  )

  const data = useMemo(() => {
    if (!rincianPembayaran) return null

    const now = new Date()
    now.setHours(23, 59, 59, 999)
    
    const filtered = rincianPembayaran.filter((item) => {
      const itemDate = new Date(item.tanggal_bayar)
      
      if (dateFilter === 'custom' && startDate && endDate) {
        const start = new Date(startDate)
        start.setHours(0, 0, 0, 0)
        const end = new Date(endDate)
        end.setHours(23, 59, 59, 999)
        return itemDate >= start && itemDate <= end
      }

      if (dateFilter === 'today') {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        return itemDate >= today && itemDate <= now
      }

      if (dateFilter === '3days') {
        const threeDaysAgo = new Date(now)
        threeDaysAgo.setDate(threeDaysAgo.getDate() - 3)
        threeDaysAgo.setHours(0, 0, 0, 0)
        return itemDate >= threeDaysAgo && itemDate <= now
      }

      if (dateFilter === '7days') {
        const sevenDaysAgo = new Date(now)
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
        sevenDaysAgo.setHours(0, 0, 0, 0)
        return itemDate >= sevenDaysAgo && itemDate <= now
      }

      if (dateFilter === '14days') {
        const fourteenDaysAgo = new Date(now)
        fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14)
        fourteenDaysAgo.setHours(0, 0, 0, 0)
        return itemDate >= fourteenDaysAgo && itemDate <= now
      }

      if (dateFilter === '30days') {
        const thirtyDaysAgo = new Date(now)
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
        thirtyDaysAgo.setHours(0, 0, 0, 0)
        return itemDate >= thirtyDaysAgo && itemDate <= now
      }

      return true
    })

    const tunai = filtered
      .filter((item) => {
        const method = (item.metode_pembayaran || '').toLowerCase()
        return method === 'tunai' || method === 'cash'
      })
      .reduce((sum, item) => sum + Number(item.jumlah_dibayar || 0), 0)

    const nonTunai = filtered
      .filter((item) => {
        const method = (item.metode_pembayaran || '').toLowerCase()
        return method !== 'tunai' && method !== 'cash'
      })
      .reduce((sum, item) => sum + Number(item.jumlah_dibayar || 0), 0)

    const total = tunai + nonTunai
    const jumlahTransaksi = filtered.length

    const metodePembayaran = filtered.reduce((acc, item) => {
      const method = item.metode_pembayaran || 'Tidak Diketahui'
      if (!acc[method]) {
        acc[method] = { count: 0, total: 0 }
      }
      acc[method].count += 1
      acc[method].total += Number(item.jumlah_dibayar || 0)
      return acc
    }, {})

    return {
      tunai,
      nonTunai,
      total,
      jumlahTransaksi,
      metodePembayaran,
      rawData: filtered,
    }
  }, [rincianPembayaran, dateFilter, startDate, endDate])

  return {
    data,
    loading: rincianPembayaran === undefined,
  }
}
