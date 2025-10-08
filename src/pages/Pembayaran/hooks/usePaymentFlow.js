import { useState, useEffect } from 'react'
import { db } from '../../../offline/db'
import { createPembayaranWithRincian } from '../../../offline/actions/pembayaran'
import { generateNomorPembayaran, generateNomorTransaksi } from '../utils/nomorGenerator'

function calculateTagihanSummary(tagihan) {
  const total = (tagihan.rincian_tagihan || []).reduce(
    (sum, r) => sum + parseFloat(r.jumlah || 0), 0
  )
  const dibayar = (tagihan.pembayaran || []).reduce((sum, p) =>
    sum + (p.rincian_pembayaran || []).reduce(
      (s, rp) => s + parseFloat(rp.jumlah_dibayar || 0), 0
    ), 0
  )
  return { total, dibayar, sisa: total - dibayar }
}

export function usePaymentFlow() {
  const [siswaList, setSiswaList] = useState([])
  const [selectedSiswa, setSelectedSiswa] = useState(null)
  const [unpaidTagihan, setUnpaidTagihan] = useState([])
  const [selectedPayments, setSelectedPayments] = useState([])
  const [modalOpen, setModalOpen] = useState(false)
  const [currentTagihan, setCurrentTagihan] = useState(null)
  const [currentSummary, setCurrentSummary] = useState(null)
  const [editIndex, setEditIndex] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [invoiceData, setInvoiceData] = useState(null)
  const [pendingGeneration, setPendingGeneration] = useState(null)

  useEffect(() => {
    loadSiswa()
  }, [])

  useEffect(() => {
    if (selectedSiswa) {
      loadUnpaidTagihan(selectedSiswa.id)
    } else {
      setUnpaidTagihan([])
    }
  }, [selectedSiswa])

  const loadSiswa = async () => {
    const siswa = await db.siswa.orderBy('nama_lengkap').toArray()
    const allRks = await db.riwayat_kelas_siswa.toArray()
    const tahunAjaranMap = new Map((await db.tahun_ajaran.toArray()).map(ta => [ta.id, ta]))
    const kelasMap = new Map((await db.kelas.toArray()).map(k => [k.id, k]))

    const enriched = siswa.map(s => {
      // Cari riwayat kelas siswa yang aktif (status = 'aktif')
      // Urutkan berdasarkan tanggal_masuk terbaru untuk mendapat riwayat terakhir
      const rksAktif = allRks
        .filter(rks => rks.id_siswa === s.id && rks.status === 'aktif')
        .sort((a, b) => new Date(b.tanggal_masuk) - new Date(a.tanggal_masuk))[0]
      
      if (rksAktif) {
        const tahunAjaran = tahunAjaranMap.get(rksAktif.id_tahun_ajaran)
        const kelas = kelasMap.get(rksAktif.id_kelas)
        
        return {
          ...s,
          tahun_ajaran: tahunAjaran?.nama || '-',
          kelas: kelas ? `${kelas.tingkat} - ${kelas.nama_sub_kelas}` : '-'
        }
      }
      
      return {
        ...s,
        tahun_ajaran: '-',
        kelas: '-'
      }
    })

    setSiswaList(enriched || [])
  }

  const loadUnpaidTagihan = async (idSiswa) => {
    const rks = await db.riwayat_kelas_siswa.where('id_siswa').equals(idSiswa).toArray()
    const rksIds = new Set(rks.map(r => r.id))
    const rksMap = new Map(rks.map(r => [r.id, r]))
    const allTagihan = await db.tagihan.toArray()
    const tagihanSiswa = allTagihan.filter(t => rksIds.has(t.id_riwayat_kelas_siswa))

    const tahunAjaranMap = new Map((await db.tahun_ajaran.toArray()).map(ta => [ta.id, ta]))
    const kelasMap = new Map((await db.kelas.toArray()).map(k => [k.id, k]))

    const rincianMap = new Map()
    const allRincian = await db.rincian_tagihan.toArray()
    allRincian.forEach(r => {
      if (!rincianMap.has(r.id_tagihan)) rincianMap.set(r.id_tagihan, [])
      rincianMap.get(r.id_tagihan).push(r)
    })

    const pembayaranMap = new Map()
    const allPembayaran = await db.pembayaran.toArray()
    allPembayaran.forEach(p => {
      if (!pembayaranMap.has(p.id_tagihan)) pembayaranMap.set(p.id_tagihan, [])
      pembayaranMap.get(p.id_tagihan).push(p)
    })

    const rpMap = new Map()
    const allRP = await db.rincian_pembayaran.toArray()
    allRP.forEach(rp => {
      if (!rpMap.has(rp.id_pembayaran)) rpMap.set(rp.id_pembayaran, [])
      rpMap.get(rp.id_pembayaran).push(rp)
    })

    const enriched = tagihanSiswa.map(t => {
      const rksData = rksMap.get(t.id_riwayat_kelas_siswa)
      const tahunAjaran = rksData ? tahunAjaranMap.get(rksData.id_tahun_ajaran) : null
      const kelas = rksData ? kelasMap.get(rksData.id_kelas) : null

      return {
        ...t,
        tahun_ajaran: tahunAjaran?.nama || '-',
        kelas: kelas ? `${kelas.tingkat} - ${kelas.nama_sub_kelas}` : '-',
        rincian_tagihan: rincianMap.get(t.id) || [],
        pembayaran: (pembayaranMap.get(t.id) || []).map(p => ({
          ...p,
          rincian_pembayaran: rpMap.get(p.id) || []
        }))
      }
    })

    const unpaid = enriched.filter(t => {
      const summary = calculateTagihanSummary(t)
      return summary.sisa > 0
    }).sort((a, b) => new Date(b.tanggal_tagihan) - new Date(a.tanggal_tagihan))

    setUnpaidTagihan(unpaid)
  }

  const handlePayClick = (tagihan, summary) => {
    setCurrentTagihan(tagihan)
    setCurrentSummary(summary)
    setEditIndex(null)
    setModalOpen(true)
  }

  const handleAddPayment = (paymentData) => {
    setPendingGeneration(null)
    if (editIndex !== null) {
      const updated = [...selectedPayments]
      updated[editIndex] = paymentData
      setSelectedPayments(updated)
    } else {
      setSelectedPayments([...selectedPayments, paymentData])
    }
  }

  const handleRemovePayment = (index) => {
    setPendingGeneration(null)
    setSelectedPayments(selectedPayments.filter((_, i) => i !== index))
  }

  const handleEditPayment = (index) => {
    const item = selectedPayments[index]
    setCurrentTagihan(item.tagihan)
    setCurrentSummary(item.summary)
    setEditIndex(index)
    setModalOpen(true)
    setPendingGeneration(null)
  }

  const preparePaymentNumbers = async () => {
    if (!selectedSiswa || selectedPayments.length === 0) {
      setPendingGeneration(null)
      return null
    }

    const now = new Date()
    const prepared = []

    for (let i = 0; i < selectedPayments.length; i += 1) {
      const nomorPembayaran = await generateNomorPembayaran({
        siswa: selectedSiswa,
        timestamp: now,
        sequenceOffset: i,
      })
      const nomorTransaksi = await generateNomorTransaksi({
        pembayaran: nomorPembayaran,
        siswa: selectedSiswa,
        timestamp: now,
        sequenceOffset: 0,
      })

      prepared.push({
        nomor_pembayaran: nomorPembayaran,
        nomor_transaksi: nomorTransaksi,
      })
    }

    const payload = {
      generatedAt: now,
      timestamp: now.toISOString(),
      prepared,
    }

    setPendingGeneration(payload)
    return payload
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    if (selectedPayments.length === 0) {
      setError('Belum ada pembayaran yang dipilih')
      setSubmitting(false)
      return
    }

    try {
      let generation = pendingGeneration

      if (!generation || generation.prepared.length !== selectedPayments.length) {
        generation = await preparePaymentNumbers()
        if (!generation) {
          throw new Error('Gagal menyiapkan nomor pembayaran')
        }
      }

      const timestamp = generation.timestamp
      const timestampDate = new Date(timestamp)
      const savedPayments = []

      for (let index = 0; index < selectedPayments.length; index += 1) {
        const item = selectedPayments[index]
        const kandidatPembayaran = generation.prepared[index]?.nomor_pembayaran
        const kandidatTransaksi = generation.prepared[index]?.nomor_transaksi

        const nomorPembayaran = kandidatPembayaran || await generateNomorPembayaran({
          siswa: selectedSiswa,
          timestamp: timestampDate,
          sequenceOffset: index,
        })
        const nomorTransaksi = kandidatTransaksi || await generateNomorTransaksi({
          pembayaran: nomorPembayaran,
          siswa: selectedSiswa,
          timestamp: timestampDate,
          sequenceOffset: 0,
        })

        const existingPembayaran = item.tagihan.pembayaran || []
        const allRincian = existingPembayaran.flatMap(p => p.rincian_pembayaran || [])
        const maxCicilan = Math.max(0, ...allRincian.map(r => r.cicilan_ke || 0))

        await createPembayaranWithRincian(
          {
            id_tagihan: item.tagihan.id,
            nomor_pembayaran: nomorPembayaran,
            catatan: item.payment.catatan || null,
          },
          [{
            nomor_transaksi: nomorTransaksi,
            jumlah_dibayar: item.payment.jumlah_dibayar,
            tanggal_bayar: timestamp,
            metode_pembayaran: item.payment.metode_pembayaran,
            referensi_pembayaran: item.payment.referensi_pembayaran || null,
            bukti_file: item.payment.bukti_file || null, // Pass file for upload
            catatan: item.payment.catatan || null,
            cicilan_ke: maxCicilan + 1,
          }]
        )

        savedPayments.push({
          ...item,
          nomor_pembayaran: nomorPembayaran,
          nomor_transaksi: nomorTransaksi,
          timestamp,
        })
      }

      // Set invoice data dan tampilkan modal invoice
      setInvoiceData({
        siswaInfo: selectedSiswa,
        payments: savedPayments,
        totalAmount,
        timestamp,
        nomor_pembayaran: savedPayments[0]?.nomor_pembayaran || null,
      })

      setPendingGeneration(null)
      setSubmitting(false)
    } catch (err) {
      setError(err.message || 'Gagal menyimpan pembayaran')
      setSubmitting(false)
    }
  }

  const totalAmount = selectedPayments.reduce(
    (sum, item) => sum + parseFloat(item.payment.jumlah_dibayar || 0), 0
  )

  const selectedTagihanIds = selectedPayments.map(p => p.tagihan.id)

  return {
    siswaList,
    selectedSiswa,
    setSelectedSiswa,
    unpaidTagihan,
    selectedPayments,
    modalOpen,
    setModalOpen,
    currentTagihan,
    currentSummary,
    handlePayClick,
    handleAddPayment,
    handleRemovePayment,
    handleEditPayment,
    handleSubmit,
    totalAmount,
    selectedTagihanIds,
    submitting,
    error,
    invoiceData,
    setInvoiceData,
    pendingGeneration,
    preparePaymentNumbers,
  }
}
