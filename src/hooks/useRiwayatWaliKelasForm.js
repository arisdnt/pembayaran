import { useState } from 'react'

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

  const validateForm = () => {
    if (!formData.id_wali_kelas || !formData.id_kelas || !formData.id_tahun_ajaran || !formData.tanggal_mulai) {
      setError('Wali Kelas, Kelas, Tahun Ajaran, dan Tanggal Mulai wajib diisi')
      return false
    }

    if (formData.tanggal_selesai && formData.tanggal_selesai <= formData.tanggal_mulai) {
      setError('Tanggal selesai harus setelah tanggal mulai')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!validateForm()) {
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
