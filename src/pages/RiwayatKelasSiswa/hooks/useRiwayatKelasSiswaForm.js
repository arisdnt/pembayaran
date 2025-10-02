import { useState } from 'react'

export function useRiwayatKelasSiswaForm(initialData, isEdit, onSubmit, onOpenChange) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      id_siswa: undefined,
      id_kelas: undefined,
      id_tahun_ajaran: undefined,
      tanggal_masuk: '',
      tanggal_keluar: '',
      status: 'aktif',
      catatan: '',
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.id_siswa || !formData.id_kelas || !formData.id_tahun_ajaran || !formData.tanggal_masuk) {
      setError('Siswa, Kelas, Tahun Ajaran, dan Tanggal Masuk wajib diisi')
      setSubmitting(false)
      return
    }

    if (formData.tanggal_keluar && formData.tanggal_keluar <= formData.tanggal_masuk) {
      setError('Tanggal keluar harus setelah tanggal masuk')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      setFormData({
        id: '',
        id_siswa: undefined,
        id_kelas: undefined,
        id_tahun_ajaran: undefined,
        tanggal_masuk: '',
        tanggal_keluar: '',
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
