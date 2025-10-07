import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../../../offline/db'
import { createPembayaranWithRincian } from '../../../offline/actions/pembayaran'

export function useCreatePembayaran() {
  const navigate = useNavigate()
  
  const [tagihanList, setTagihanList] = useState([])
  const [selectedTagihan, setSelectedTagihan] = useState(null)
  
  const [formData, setFormData] = useState({
    id_tagihan: '',
    nomor_pembayaran: '',
    catatan: '',
  })
  
  const [rincianItems, setRincianItems] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchTagihan()
  }, [])

  const fetchTagihan = async () => {
    const t = await db.tagihan.orderBy('tanggal_tagihan').reverse().toArray()
    const rincianByTagihan = new Map((await db.rincian_tagihan.toArray()).reduce((acc, r) => {
      const arr = acc.get(r.id_tagihan) || []
      arr.push(r)
      acc.set(r.id_tagihan, arr)
      return acc
    }, new Map()))
    const enriched = t.map(x => ({
      ...x,
      rincian_tagihan: rincianByTagihan.get(x.id) || [],
      total_tagihan: (rincianByTagihan.get(x.id) || []).reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0)
    }))
    setTagihanList(enriched)
  }

  const handleTagihanChange = async (tagihanId) => {
    const tagihan = tagihanList.find(t => t.id === tagihanId)
    setSelectedTagihan(tagihan)
    setFormData({...formData, id_tagihan: tagihanId})

    if (tagihan) {
      const pembayaranByTagihan = (await db.pembayaran.where('id_tagihan').equals(tagihanId).toArray())
      const rpByPembayaran = new Map((await db.rincian_pembayaran.toArray()).reduce((acc, rp) => {
        const arr = acc.get(rp.id_pembayaran) || []
        arr.push(rp)
        acc.set(rp.id_pembayaran, arr)
        return acc
      }, new Map()))
      const totalPaid = pembayaranByTagihan.reduce((sum, p) => sum + (rpByPembayaran.get(p.id) || []).reduce((s, r) => s + parseFloat(r.jumlah_dibayar || 0), 0), 0)
      setSelectedTagihan({ ...tagihan, total_dibayar: totalPaid, sisa_tagihan: tagihan.total_tagihan - totalPaid })
    }
  }

  const handleAddRincian = () => {
    setRincianItems([...rincianItems, {
      nomor_transaksi: '',
      jumlah_dibayar: '',
      tanggal_bayar: new Date().toISOString().split('T')[0],
      metode_pembayaran: 'transfer',
      referensi_pembayaran: '',
      catatan: '',
      cicilan_ke: rincianItems.length + 1,
    }])
  }

  const handleRemoveRincian = (index) => {
    setRincianItems(rincianItems.filter((_, i) => i !== index))
  }

  const handleRincianChange = (index, field, value) => {
    const updated = [...rincianItems]
    updated[index][field] = value
    setRincianItems(updated)
  }

  const totalPembayaran = rincianItems.reduce((sum, item) => sum + parseFloat(item.jumlah_dibayar || 0), 0)

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    if (!formData.id_tagihan || !formData.nomor_pembayaran) {
      setError('Tagihan dan nomor pembayaran wajib diisi')
      setSubmitting(false)
      return
    }

    if (rincianItems.length === 0) {
      setError('Minimal harus ada 1 rincian pembayaran')
      setSubmitting(false)
      return
    }

    for (let i = 0; i < rincianItems.length; i++) {
      if (!rincianItems[i].nomor_transaksi || !rincianItems[i].jumlah_dibayar || !rincianItems[i].tanggal_bayar) {
        setError(`Rincian ${i + 1}: Nomor transaksi, jumlah, dan tanggal bayar wajib diisi`)
        setSubmitting(false)
        return
      }
    }

    try {
      const items = rincianItems.map(item => ({
        nomor_transaksi: item.nomor_transaksi,
        jumlah_dibayar: item.jumlah_dibayar,
        tanggal_bayar: item.tanggal_bayar,
        metode_pembayaran: item.metode_pembayaran,
        referensi_pembayaran: item.referensi_pembayaran || null,
        catatan: item.catatan || null,
        cicilan_ke: item.cicilan_ke,
      }))
      await createPembayaranWithRincian({
        id_tagihan: formData.id_tagihan,
        nomor_pembayaran: formData.nomor_pembayaran,
        catatan: formData.catatan || null,
      }, items)
      navigate('/pembayaran')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return {
    tagihanList,
    selectedTagihan,
    formData,
    setFormData,
    rincianItems,
    error,
    submitting,
    handleTagihanChange,
    handleAddRincian,
    handleRemoveRincian,
    handleRincianChange,
    totalPembayaran,
    handleSubmit,
  }
}
