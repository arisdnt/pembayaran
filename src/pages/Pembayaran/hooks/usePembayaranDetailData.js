import { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../../offline/db'

export function usePembayaranDetailData() {
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({ nomor_pembayaran: '', catatan: '' })
  const [rincianItems, setRincianItems] = useState([])
  const [siswaInfo, setSiswaInfo] = useState(null)
  const [tagihanInfo, setTagihanInfo] = useState(null)
  const [tagihanTotals, setTagihanTotals] = useState(null)
  const [maxCicilanSeed, setMaxCicilanSeed] = useState(0)

  useEffect(() => {
    const fetchPembayaran = async () => {
      try {
        setLoading(true)
        setError('')

        const pembayaranRow = await db.pembayaran.get(id)
        if (!pembayaranRow) {
          setNotFound(true)
          setError('Pembayaran tidak ditemukan')
          setLoading(false)
          return
        }

        const tagihan = await db.tagihan.get(pembayaranRow.id_tagihan)
        if (!tagihan) {
          setError('Tagihan untuk pembayaran ini tidak ditemukan')
          setNotFound(true)
          setLoading(false)
          return
        }

        const rks = await db.riwayat_kelas_siswa.get(tagihan.id_riwayat_kelas_siswa)
        const siswa = rks ? await db.siswa.get(rks.id_siswa) : null
        const kelas = rks ? await db.kelas.get(rks.id_kelas) : null
        const tahun = rks ? await db.tahun_ajaran.get(rks.id_tahun_ajaran) : null

        setSiswaInfo({
          nama: siswa?.nama_lengkap || '-',
          nisn: siswa?.nisn || '-',
          kelas: kelas ? `${kelas.tingkat || '-'} ${kelas.nama_sub_kelas || ''}`.trim() : '-',
          tahunAjaran: tahun?.nama || '-',
        })

        setTagihanInfo({
          id: tagihan.id,
          nomor: tagihan.nomor_tagihan || '-',
          judul: tagihan.judul || '-',
          tanggal_tagihan: tagihan.tanggal_tagihan || null,
          tahunAjaran: tahun?.nama || '-',
        })

        const rincianTagihan = await db.rincian_tagihan.where('id_tagihan').equals(tagihan.id).toArray()
        const totalTagihan = rincianTagihan.reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0)

        const semuaPembayaran = await db.pembayaran.where('id_tagihan').equals(tagihan.id).toArray()
        const pembayaranIds = semuaPembayaran.map(p => p.id)

        let seluruhRincian = []
        if (pembayaranIds.length > 0) {
          seluruhRincian = await db.rincian_pembayaran.where('id_pembayaran').anyOf(pembayaranIds).toArray()
        }
        const totalDibayarSemua = seluruhRincian.reduce((sum, item) => sum + parseFloat(item.jumlah_dibayar || 0), 0)
        const maxCicilan = seluruhRincian.reduce((max, item) => Math.max(max, item.cicilan_ke || 0), 0)
        setMaxCicilanSeed(maxCicilan)

        const rincianCurrent = await db.rincian_pembayaran.where('id_pembayaran').equals(id).toArray()
        const sortedRincian = [...rincianCurrent].sort((a, b) => (a.cicilan_ke || 0) - (b.cicilan_ke || 0))
        const originalTotalPembayaran = sortedRincian.reduce((sum, item) => sum + parseFloat(item.jumlah_dibayar || 0), 0)
        const totalDibayarLain = Math.max(0, totalDibayarSemua - originalTotalPembayaran)

        setFormData({
          nomor_pembayaran: pembayaranRow.nomor_pembayaran || '',
          catatan: pembayaranRow.catatan || '',
        })

        setRincianItems(sortedRincian.map(item => ({
          id: item.id,
          nomor_transaksi: item.nomor_transaksi || '',
          jumlah_dibayar: item.jumlah_dibayar !== null && item.jumlah_dibayar !== undefined
            ? String(item.jumlah_dibayar)
            : '',
          tanggal_bayar: item.tanggal_bayar ? item.tanggal_bayar.split('T')[0] : '',
          metode_pembayaran: item.metode_pembayaran || 'transfer',
          referensi_pembayaran: item.referensi_pembayaran || '',
          catatan: item.catatan || '',
          cicilan_ke: item.cicilan_ke || undefined,
        })))

        setTagihanTotals({
          totalTagihan,
          totalDibayarLain,
          originalTotalPembayaran,
        })

        setLoading(false)
      } catch (err) {
        console.error('Error fetching pembayaran:', err)
        setError(err.message || 'Gagal memuat data pembayaran')
        setLoading(false)
      }
    }

    if (id) {
      fetchPembayaran()
    }
  }, [id])

  const totalPembayaran = useMemo(() => (
    rincianItems.reduce((sum, item) => sum + (parseFloat(item.jumlah_dibayar) || 0), 0)
  ), [rincianItems])

  const summary = useMemo(() => {
    if (!tagihanTotals) return null
    const totalDibayar = tagihanTotals.totalDibayarLain + totalPembayaran
    const remainingRaw = tagihanTotals.totalTagihan - totalDibayar

    return {
      totalTagihan: tagihanTotals.totalTagihan,
      totalDibayar,
      totalDibayarLain: tagihanTotals.totalDibayarLain,
      totalPembayaranSaatIni: totalPembayaran,
      originalTotalPembayaran: tagihanTotals.originalTotalPembayaran,
      remainingRaw,
      sisaTagihan: remainingRaw < 0 ? 0 : remainingRaw,
    }
  }, [tagihanTotals, totalPembayaran])

  const getNextCicilanKe = () => {
    const maxInForm = rincianItems.reduce((max, item) => Math.max(max, item.cicilan_ke || 0), 0)
    return Math.max(maxCicilanSeed, maxInForm) + 1
  }

  return {
    loading,
    notFound,
    error,
    formData,
    setFormData,
    rincianItems,
    setRincianItems,
    siswaInfo,
    tagihanInfo,
    totalPembayaran,
    summary,
    getNextCicilanKe,
  }
}
