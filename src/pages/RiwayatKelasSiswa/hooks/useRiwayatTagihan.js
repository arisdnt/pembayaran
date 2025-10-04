import { useState, useEffect } from 'react'
import { db } from '../../../offline/db'

export function useRiwayatTagihan(riwayatId) {
  const [tagihan, setTagihan] = useState({
    list: [],
    summary: {
      totalTagihan: 0,
      totalDibayar: 0,
      totalTunggakan: 0,
      jumlahTagihan: 0,
      tagihanLunas: 0,
      tagihanBelumLunas: 0
    },
    loading: true
  })

  useEffect(() => {
    if (!riwayatId) {
      setTagihan({
        list: [],
        summary: {
          totalTagihan: 0,
          totalDibayar: 0,
          totalTunggakan: 0,
          jumlahTagihan: 0,
          tagihanLunas: 0,
          tagihanBelumLunas: 0
        },
        loading: false
      })
      return
    }

    async function fetchTagihan() {
      try {
        // Fetch all data from IndexedDB
        const [allTagihan, allRincianTagihan, allPembayaran, allRincianPembayaran] = await Promise.all([
          db.tagihan.toArray(),
          db.rincian_tagihan.toArray(),
          db.pembayaran.toArray(),
          db.rincian_pembayaran.toArray()
        ])

        // Filter tagihan untuk riwayat ini
        const tagihanFiltered = allTagihan.filter(t => t.id_riwayat_kelas_siswa === riwayatId)

        // Build rincian tagihan map
        const rincianByTagihan = new Map()
        allRincianTagihan.forEach(r => {
          if (!rincianByTagihan.has(r.id_tagihan)) {
            rincianByTagihan.set(r.id_tagihan, [])
          }
          rincianByTagihan.get(r.id_tagihan).push(r)
        })

        // Build pembayaran map
        const pembayaranByTagihan = new Map()
        allPembayaran.forEach(p => {
          if (!pembayaranByTagihan.has(p.id_tagihan)) {
            pembayaranByTagihan.set(p.id_tagihan, [])
          }
          pembayaranByTagihan.get(p.id_tagihan).push(p)
        })

        // Build rincian pembayaran map
        const rincianPembayaranByPembayaran = new Map()
        allRincianPembayaran.forEach(rp => {
          if (!rincianPembayaranByPembayaran.has(rp.id_pembayaran)) {
            rincianPembayaranByPembayaran.set(rp.id_pembayaran, [])
          }
          rincianPembayaranByPembayaran.get(rp.id_pembayaran).push(rp)
        })

        // Calculate totals for each tagihan
        let totalTagihan = 0
        let totalDibayar = 0
        let tagihanLunas = 0
        let tagihanBelumLunas = 0

        const tagihanList = tagihanFiltered.map(t => {
          // Calculate total tagihan
          const rincian = rincianByTagihan.get(t.id) || []
          const jumlahTagihan = rincian.reduce((sum, r) => sum + Number(r.jumlah || 0), 0)

          // Calculate total dibayar
          const pembayaran = pembayaranByTagihan.get(t.id) || []
          const jumlahDibayar = pembayaran.reduce((sum, p) => {
            const rincianPembayaran = rincianPembayaranByPembayaran.get(p.id) || []
            return sum + rincianPembayaran.reduce((s, rp) => s + Number(rp.jumlah_dibayar || 0), 0)
          }, 0)

          const sisa = Math.max(jumlahTagihan - jumlahDibayar, 0)
          const isLunas = jumlahDibayar >= jumlahTagihan

          // Aggregate totals
          totalTagihan += jumlahTagihan
          totalDibayar += jumlahDibayar
          if (isLunas) {
            tagihanLunas++
          } else {
            tagihanBelumLunas++
          }

          return {
            id: t.id,
            nomorTagihan: t.nomor_tagihan,
            judul: t.judul,
            tanggalTagihan: t.tanggal_tagihan,
            tanggalJatuhTempo: t.tanggal_jatuh_tempo,
            jumlahTagihan,
            jumlahDibayar,
            sisa,
            isLunas,
            jumlahRincian: rincian.length
          }
        })

        // Sort by tanggal_tagihan descending
        tagihanList.sort((a, b) => {
          const dateA = new Date(a.tanggalTagihan || 0)
          const dateB = new Date(b.tanggalTagihan || 0)
          return dateB - dateA
        })

        const totalTunggakan = Math.max(totalTagihan - totalDibayar, 0)

        setTagihan({
          list: tagihanList,
          summary: {
            totalTagihan,
            totalDibayar,
            totalTunggakan,
            jumlahTagihan: tagihanList.length,
            tagihanLunas,
            tagihanBelumLunas
          },
          loading: false
        })
      } catch (err) {
        console.error('Error fetching riwayat tagihan:', err)
        setTagihan({
          list: [],
          summary: {
            totalTagihan: 0,
            totalDibayar: 0,
            totalTunggakan: 0,
            jumlahTagihan: 0,
            tagihanLunas: 0,
            tagihanBelumLunas: 0
          },
          loading: false
        })
      }
    }

    fetchTagihan()
  }, [riwayatId])

  return tagihan
}
