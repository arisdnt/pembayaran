import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../../../lib/supabaseClient'

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
    
    const { data: pembayaranData, error: pembayaranError } = await supabase
      .from('pembayaran')
      .select(`
        *,
        tagihan:id_tagihan(
          *,
          riwayat_kelas_siswa:id_riwayat_kelas_siswa(
            siswa:id_siswa(nama_lengkap),
            kelas:id_kelas(tingkat, nama_sub_kelas)
          ),
          rincian_tagihan(jumlah)
        )
      `)
      .eq('id', id)
      .single()
    
    if (pembayaranError) {
      setError('Pembayaran tidak ditemukan')
      setLoading(false)
      return
    }

    const totalTagihan = pembayaranData.tagihan.rincian_tagihan?.reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0) || 0
    
    setFormData({
      id_tagihan: pembayaranData.id_tagihan,
      nomor_pembayaran: pembayaranData.nomor_pembayaran,
      catatan: pembayaranData.catatan || '',
    })

    setSelectedTagihan({
      ...pembayaranData.tagihan,
      total_tagihan: totalTagihan
    })

    const { data: rincianData } = await supabase
      .from('rincian_pembayaran')
      .select('*')
      .eq('id_pembayaran', id)
      .order('cicilan_ke')
    
    if (rincianData) {
      setRincianItems(rincianData.map(r => ({
        id: r.id,
        nomor_transaksi: r.nomor_transaksi,
        jumlah_dibayar: r.jumlah_dibayar,
        tanggal_bayar: r.tanggal_bayar.split('T')[0],
        metode_pembayaran: r.metode_pembayaran,
        referensi_pembayaran: r.referensi_pembayaran || '',
        catatan: r.catatan || '',
        status: r.status,
        cicilan_ke: r.cicilan_ke,
      })))
    }

    const { data: tagihanListData } = await supabase
      .from('tagihan')
      .select(`
        *,
        riwayat_kelas_siswa:id_riwayat_kelas_siswa(
          siswa:id_siswa(nama_lengkap)
        ),
        rincian_tagihan(jumlah)
      `)
      .order('tanggal_tagihan', { ascending: false })
    
    if (tagihanListData) {
      const withTotal = tagihanListData.map(t => ({
        ...t,
        total_tagihan: t.rincian_tagihan?.reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0) || 0
      }))
      setTagihanList(withTotal)
    }

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
    const item = rincianItems[index]
    
    if (item.id) {
      await supabase
        .from('rincian_pembayaran')
        .delete()
        .eq('id', item.id)
    }
    
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
      const { error: pembayaranError } = await supabase
        .from('pembayaran')
        .update({
          id_tagihan: formData.id_tagihan,
          nomor_pembayaran: formData.nomor_pembayaran,
          catatan: formData.catatan || null,
        })
        .eq('id', id)

      if (pembayaranError) throw pembayaranError

      for (const item of rincianItems) {
        if (item.id) {
          await supabase
            .from('rincian_pembayaran')
            .update({
              nomor_transaksi: item.nomor_transaksi,
              jumlah_dibayar: item.jumlah_dibayar,
              tanggal_bayar: item.tanggal_bayar,
              metode_pembayaran: item.metode_pembayaran,
              referensi_pembayaran: item.referensi_pembayaran || null,
              catatan: item.catatan || null,
              status: item.status,
              cicilan_ke: item.cicilan_ke,
            })
            .eq('id', item.id)
        } else {
          await supabase
            .from('rincian_pembayaran')
            .insert({
              id_pembayaran: id,
              nomor_transaksi: item.nomor_transaksi,
              jumlah_dibayar: item.jumlah_dibayar,
              tanggal_bayar: item.tanggal_bayar,
              metode_pembayaran: item.metode_pembayaran,
              referensi_pembayaran: item.referensi_pembayaran || null,
              catatan: item.catatan || null,
              status: item.status,
              cicilan_ke: item.cicilan_ke,
            })
        }
      }

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
