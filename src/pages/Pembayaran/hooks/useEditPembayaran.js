import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { db } from '../../../offline/db'
import { updatePembayaranWithRincian } from '../../../offline/actions/pembayaran'

export function useEditPembayaran() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [loading, setLoading] = useState(true)
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
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    const pembayaranData = await db.pembayaran.get(id)
    if (!pembayaranData) {
      setError('Pembayaran tidak ditemukan')
      setLoading(false)
      return
    }
    const tagihan = await db.tagihan.get(pembayaranData.id_tagihan)
    const rincianTagihan = tagihan ? await db.rincian_tagihan.where('id_tagihan').equals(tagihan.id).toArray() : []
    const totalTagihan = rincianTagihan.reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0)
    
    setFormData({
      id_tagihan: pembayaranData.id_tagihan,
      nomor_pembayaran: pembayaranData.nomor_pembayaran,
      catatan: pembayaranData.catatan || '',
    })

    setSelectedTagihan({ ...tagihan, total_tagihan: totalTagihan })

    const rincianAll = await db.rincian_pembayaran.where('id_pembayaran').equals(id).toArray()
    const rincianData = rincianAll.sort((a, b) => (a.cicilan_ke || 0) - (b.cicilan_ke || 0))
    if (rincianData) {
      setRincianItems(rincianData.map(r => ({
        id: r.id,
        nomor_transaksi: r.nomor_transaksi,
        jumlah_dibayar: r.jumlah_dibayar,
        tanggal_bayar: (r.tanggal_bayar || '').split('T')[0] || r.tanggal_bayar,
        metode_pembayaran: r.metode_pembayaran,
        referensi_pembayaran: r.referensi_pembayaran || '',
        catatan: r.catatan || '',
        status: r.status,
        cicilan_ke: r.cicilan_ke,
      })))
    }

    const tagihanListData = await db.tagihan.orderBy('tanggal_tagihan').reverse().toArray()
    const rincianByTagihan = new Map((await db.rincian_tagihan.toArray()).reduce((acc, r) => {
      const arr = acc.get(r.id_tagihan) || []
      arr.push(r)
      acc.set(r.id_tagihan, arr)
      return acc
    }, new Map()))
    const withTotal = tagihanListData.map(t => ({ ...t, total_tagihan: (rincianByTagihan.get(t.id) || []).reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0) }))
    setTagihanList(withTotal)

    setLoading(false)
  }

  const handleAddRincian = () => {
    setRincianItems([...rincianItems, {
      nomor_transaksi: '',
      jumlah_dibayar: '',
      tanggal_bayar: new Date().toISOString().split('T')[0],
      metode_pembayaran: 'transfer',
      referensi_pembayaran: '',
      catatan: '',
      status: 'menunggu_verifikasi',
      cicilan_ke: rincianItems.length + 1,
    }])
  }

  const handleRemoveRincian = async (index) => {
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
      await updatePembayaranWithRincian(id, {
        id_tagihan: formData.id_tagihan,
        nomor_pembayaran: formData.nomor_pembayaran,
        catatan: formData.catatan || null,
      }, rincianItems)
      navigate('/pembayaran')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return {
    loading,
    tagihanList,
    selectedTagihan,
    formData,
    setFormData,
    rincianItems,
    error,
    submitting,
    handleAddRincian,
    handleRemoveRincian,
    handleRincianChange,
    totalPembayaran,
    handleSubmit,
  }
}
