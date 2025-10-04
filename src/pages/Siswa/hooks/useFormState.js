import { useState, useEffect } from 'react'

const INITIAL_FORM_STATE = {
  id: '',
  nama_lengkap: '',
  nisn: '',
  tanggal_lahir: '',
  jenis_kelamin: '',
  alamat: '',
  nama_wali_siswa: '',
  nomor_whatsapp_wali: '',
  status_aktif: true,
}

export function useFormState(initialData) {
  const [formData, setFormData] = useState(initialData || INITIAL_FORM_STATE)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData(INITIAL_FORM_STATE)
    }
  }, [initialData])

  const resetForm = () => {
    setFormData(INITIAL_FORM_STATE)
    setError('')
  }

  const validateForm = () => {
    if (!formData.nama_lengkap) {
      setError('Nama lengkap wajib diisi')
      return false
    }
    return true
  }

  const handleSubmit = async (e, onSubmit, onOpenChange, isEdit) => {
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
      resetForm()
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
    setError,
    resetForm,
    handleSubmit,
  }
}
