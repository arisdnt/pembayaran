import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabaseClient'

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
    const { data } = await supabase
      .from('tagihan')
      .select(`
        *,
        riwayat_kelas_siswa:id_riwayat_kelas_siswa(
          siswa:id_siswa(nama_lengkap, nisn),
          kelas:id_kelas(tingkat, nama_sub_kelas)
        ),
        rincian_tagihan(jumlah)
      `)
      .order('tanggal_tagihan', { ascending: false })
    
    if (data) {
      const withTotal = data.map(t => ({
        ...t,
        total_tagihan: t.rincian_tagihan?.reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0) || 0
      }))
      setTagihanList(withTotal)
    }
  }

  const handleTagihanChange = async (tagihanId) => {
    const tagihan = tagihanList.find(t => t.id === tagihanId)
    setSelectedTagihan(tagihan)
    setFormData({...formData, id_tagihan: tagihanId})

    if (tagihan) {
      const { data: pembayaranData } = await supabase
        .from('pembayaran')
        .select(`
          id,
          rincian_pembayaran(jumlah_dibayar, status)
        `)
        .eq('id_tagihan', tagihanId)
      
      let totalPaid = 0
      if (pembayaranData) {
        pembayaranData.forEach(p => {
          p.rincian_pembayaran?.forEach(r => {
            if (r.status === 'terverifikasi') {
              totalPaid += parseFloat(r.jumlah_dibayar || 0)
            }
          })
        })
      }
      
      setSelectedTagihan({
        ...tagihan,
        total_dibayar: totalPaid,
        sisa_tagihan: tagihan.total_tagihan - totalPaid
      })
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
      status: 'menunggu_verifikasi',
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
      const { data: pembayaranData, error: pembayaranError } = await supabase
        .from('pembayaran')
        .insert({
          id_tagihan: formData.id_tagihan,
          nomor_pembayaran: formData.nomor_pembayaran,
          catatan: formData.catatan || null,
        })
        .select()
        .single()

      if (pembayaranError) throw pembayaranError

      const rincianData = rincianItems.map(item => ({
        id_pembayaran: pembayaranData.id,
        nomor_transaksi: item.nomor_transaksi,
        jumlah_dibayar: item.jumlah_dibayar,
        tanggal_bayar: item.tanggal_bayar,
        metode_pembayaran: item.metode_pembayaran,
        referensi_pembayaran: item.referensi_pembayaran || null,
        catatan: item.catatan || null,
        status: item.status,
        cicilan_ke: item.cicilan_ke,
      }))

      const { error: rincianError } = await supabase
        .from('rincian_pembayaran')
        .insert(rincianData)

      if (rincianError) throw rincianError

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
