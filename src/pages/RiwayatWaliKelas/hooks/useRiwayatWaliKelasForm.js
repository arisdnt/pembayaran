import { useState, useEffect } from 'react'

export function useRiwayatWaliKelasForm(initialData, onSubmit, isEdit, onOpenChange) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      id_wali_kelas: '',
      id_kelas: '',
      id_tahun_ajaran: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      status: 'aktif',
      catatan: '',
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        id: '',
        id_wali_kelas: '',
        id_kelas: '',
        id_tahun_ajaran: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        status: 'aktif',
        catatan: '',
      })
    }
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.id_wali_kelas || !formData.id_kelas || !formData.id_tahun_ajaran || !formData.tanggal_mulai) {
      setError('Mohon lengkapi semua field yang wajib diisi')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      setFormData({
        id: '',
        id_wali_kelas: '',
        id_kelas: '',
        id_tahun_ajaran: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        status: 'aktif',
        catatan: '',
      })
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
    handleSubmit,
  }
}
