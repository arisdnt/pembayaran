import { useState, useEffect } from 'react'

export function useFormState(initialData) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      nama_lengkap: '',
      nip: '',
      nomor_telepon: '',
      email: '',
      status_aktif: true,
    }
  )

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        nama_lengkap: initialData.nama_lengkap || '',
        nip: initialData.nip || '',
        nomor_telepon: initialData.nomor_telepon || '',
        email: initialData.email || '',
        status_aktif: initialData.status_aktif !== undefined ? initialData.status_aktif : true,
      })
    }
  }, [initialData])

  const resetForm = () => {
    setFormData({
      id: '',
      nama_lengkap: '',
      nip: '',
      nomor_telepon: '',
      email: '',
      status_aktif: true,
    })
  }

  return { formData, setFormData, resetForm }
}
