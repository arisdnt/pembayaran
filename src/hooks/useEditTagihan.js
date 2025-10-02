import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export function useEditTagihan() {
  const navigate = useNavigate()
  const { id } = useParams()
  
  const [loading, setLoading] = useState(true)
  const [riwayatKelasSiswaList, setRiwayatKelasSiswaList] = useState([])
  const [jenisPembayaranList, setJenisPembayaranList] = useState([])
  const [formData, setFormData] = useState({
    id_riwayat_kelas_siswa: '',
    nomor_tagihan: '',
    judul: '',
    deskripsi: '',
    tanggal_tagihan: '',
    tanggal_jatuh_tempo: '',
  })
  const [rincianItems, setRincianItems] = useState([])
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    fetchData()
  }, [id])

  const fetchData = async () => {
    setLoading(true)
    
    const { data: tagihanData, error: tagihanError } = await supabase
      .from('tagihan')
      .select(`*, riwayat_kelas_siswa:id_riwayat_kelas_siswa(id, siswa:id_siswa(id, nama_lengkap, nisn), kelas:id_kelas(id, tingkat, nama_sub_kelas), tahun_ajaran:id_tahun_ajaran(id, nama))`)
      .eq('id', id)
      .single()
    
    if (tagihanError) {
      setError('Tagihan tidak ditemukan')
      setLoading(false)
      return
    }

    setFormData({
      id_riwayat_kelas_siswa: tagihanData.id_riwayat_kelas_siswa,
      nomor_tagihan: tagihanData.nomor_tagihan,
      judul: tagihanData.judul,
      deskripsi: tagihanData.deskripsi || '',
      tanggal_tagihan: tagihanData.tanggal_tagihan,
      tanggal_jatuh_tempo: tagihanData.tanggal_jatuh_tempo,
    })

    const { data: rincianData } = await supabase
      .from('rincian_tagihan')
      .select(`*, jenis_pembayaran:id_jenis_pembayaran(kode, nama)`)
      .eq('id_tagihan', id)
      .order('urutan')
    
    if (rincianData) {
      setRincianItems(rincianData.map(r => ({
        id: r.id,
        id_jenis_pembayaran: r.id_jenis_pembayaran,
        deskripsi: r.deskripsi,
        jumlah: r.jumlah,
        urutan: r.urutan,
      })))
    }

    const { data: rksData } = await supabase
      .from('riwayat_kelas_siswa')
      .select(`id, siswa:id_siswa(id, nama_lengkap, nisn), kelas:id_kelas(id, tingkat, nama_sub_kelas), tahun_ajaran:id_tahun_ajaran(id, nama)`)
      .order('id_siswa')
    
    if (rksData) setRiwayatKelasSiswaList(rksData)

    const { data: jenisData } = await supabase
      .from('jenis_pembayaran')
      .select('id, kode, nama, jumlah_default')
      .eq('status_aktif', true)
      .order('kode')
    
    if (jenisData) setJenisPembayaranList(jenisData)

    setLoading(false)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    if (!formData.nomor_tagihan || !formData.judul || !formData.tanggal_tagihan || !formData.tanggal_jatuh_tempo) {
      setError('Nomor tagihan, judul, tanggal tagihan, dan jatuh tempo wajib diisi')
      setSubmitting(false)
      return
    }

    if (rincianItems.length === 0) {
      setError('Minimal harus ada 1 rincian item')
      setSubmitting(false)
      return
    }

    for (let i = 0; i < rincianItems.length; i++) {
      if (!rincianItems[i].id_jenis_pembayaran || !rincianItems[i].jumlah) {
        setError(`Rincian item ${i + 1}: Jenis pembayaran dan jumlah wajib diisi`)
        setSubmitting(false)
        return
      }
    }

    try {
      const { error: tagihanError } = await supabase
        .from('tagihan')
        .update({
          id_riwayat_kelas_siswa: formData.id_riwayat_kelas_siswa,
          nomor_tagihan: formData.nomor_tagihan,
          judul: formData.judul,
          deskripsi: formData.deskripsi || null,
          tanggal_tagihan: formData.tanggal_tagihan,
          tanggal_jatuh_tempo: formData.tanggal_jatuh_tempo,
        })
        .eq('id', id)

      if (tagihanError) throw tagihanError

      for (const item of rincianItems) {
        if (item.id) {
          await supabase
            .from('rincian_tagihan')
            .update({
              id_jenis_pembayaran: item.id_jenis_pembayaran,
              deskripsi: item.deskripsi,
              jumlah: item.jumlah,
              urutan: item.urutan,
            })
            .eq('id', item.id)
        } else {
          await supabase
            .from('rincian_tagihan')
            .insert({
              id_tagihan: id,
              id_jenis_pembayaran: item.id_jenis_pembayaran,
              deskripsi: item.deskripsi,
              jumlah: item.jumlah,
              urutan: item.urutan,
            })
        }
      }

      navigate('/tagihan')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  return {
    loading,
    riwayatKelasSiswaList,
    jenisPembayaranList,
    formData,
    setFormData,
    rincianItems,
    setRincianItems,
    error,
    submitting,
    handleSubmit,
    navigate,
  }
}
