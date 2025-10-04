import { useState, useEffect, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../offline/db'

export function useJenisPembayaranForm(initialData, isEdit, onSubmit, onClose) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      kode: '',
      nama: '',
      deskripsi: '',
      jumlah_default: '',
      tipe_pembayaran: '',
      id_tahun_ajaran: '',
      tingkat: '',
      id_kelas: '',
      id_peminatan: '',
      wajib: true,
      status_aktif: true,
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const kelasList = useLiveQuery(() => db.kelas.toArray(), [], [])
  const peminatanList = useLiveQuery(() => db.peminatan.toArray(), [], [])

  const filteredKelasList = useMemo(() => {
    if (!formData.tingkat || !kelasList) return []
    return kelasList.filter(k => k.tingkat === formData.tingkat).sort((a, b) => a.nama_sub_kelas.localeCompare(b.nama_sub_kelas))
  }, [formData.tingkat, kelasList])

  const filteredPeminatanList = useMemo(() => {
    if (!formData.id_kelas || !peminatanList || !kelasList) return []
    const selectedKelas = kelasList.find(k => k.id === formData.id_kelas)
    if (!selectedKelas || !selectedKelas.id_peminatan) return []
    return peminatanList.filter(p => p.id === selectedKelas.id_peminatan)
  }, [formData.id_kelas, peminatanList, kelasList])

  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tingkat: initialData.tingkat || '',
        id_kelas: initialData.id_kelas || '',
        id_peminatan: initialData.id_peminatan || '',
        wajib: initialData.wajib ?? true,
        status_aktif: initialData.status_aktif ?? true,
      })
    } else {
      setFormData({
        id: '',
        kode: '',
        nama: '',
        deskripsi: '',
        jumlah_default: '',
        tipe_pembayaran: '',
        id_tahun_ajaran: '',
        tingkat: '',
        id_kelas: '',
        id_peminatan: '',
        wajib: true,
        status_aktif: true,
      })
    }
  }, [initialData])

  const validate = () => {
    if (!formData.kode || !formData.nama) {
      setError('Kode dan Nama wajib diisi')
      return false
    }
    if (!formData.id_tahun_ajaran) {
      setError('Tahun Ajaran wajib dipilih')
      return false
    }
    if (!formData.tipe_pembayaran) {
      setError('Tipe Pembayaran wajib dipilih')
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!validate()) {
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onClose(false)
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return {
    formData,
    setFormData,
    submitting,
    error,
    filteredKelasList,
    filteredPeminatanList,
    handleSubmit,
  }
}
