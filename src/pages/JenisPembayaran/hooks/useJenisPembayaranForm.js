import { useState, useEffect, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../offline/db'

export function useJenisPembayaranForm(initialData, isEdit, onSubmit, onClose) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      nama: '',
      deskripsi: '',
      jumlah_default: '',
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
    if (!formData.tingkat || !peminatanList) return []
    const tingkatNum = parseInt(formData.tingkat, 10)
    if (isNaN(tingkatNum)) return []
    
    // Filter peminatan yang berlaku untuk tingkat ini
    return peminatanList.filter(p => {
      // Hanya tampilkan peminatan yang aktif
      if (!p.aktif) return false
      
      // Jika tidak ada batasan tingkat, berarti berlaku untuk semua tingkat
      if (p.tingkat_min === null && p.tingkat_max === null) return true
      
      // Jika ada tingkat_min, cek apakah tingkat >= tingkat_min
      if (p.tingkat_min !== null && tingkatNum < p.tingkat_min) return false
      
      // Jika ada tingkat_max, cek apakah tingkat <= tingkat_max
      if (p.tingkat_max !== null && tingkatNum > p.tingkat_max) return false
      
      return true
    }).sort((a, b) => a.kode.localeCompare(b.kode))
  }, [formData.tingkat, peminatanList])

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
        nama: '',
        deskripsi: '',
        jumlah_default: '',
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
    if (!formData.nama) {
      setError('Nama wajib diisi')
      return false
    }
    if (!formData.id_tahun_ajaran) {
      setError('Tahun Ajaran wajib dipilih')
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
