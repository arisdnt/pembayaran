import { useState, useEffect } from 'react'

const initialFormState = {
  id: '',
  id_siswa: undefined,
  id_peminatan: undefined,
  id_tahun_ajaran: undefined,
  tingkat: '',
  tanggal_mulai: '',
  tanggal_selesai: '',
  catatan: '',
}

export function usePeminatanFormData({ initialData, tahunAjaranList, selectedTahunAjaran }) {
  const [formData, setFormData] = useState(initialData || initialFormState)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    }
  }, [initialData])

  useEffect(() => {
    if (selectedTahunAjaran && tahunAjaranList.length > 0) {
      const tahun = tahunAjaranList.find(ta => ta.id === selectedTahunAjaran)
      if (tahun) {
        const formatDate = (dateStr) => {
          if (!dateStr) return ''
          try {
            const date = new Date(dateStr)
            if (Number.isNaN(date.getTime())) return ''
            return date.toISOString().split('T')[0]
          } catch {
            return ''
          }
        }

        setFormData(prev => ({
          ...prev,
          tanggal_mulai: formatDate(tahun.tanggal_mulai),
          tanggal_selesai: formatDate(tahun.tanggal_selesai)
        }))
      }
    }
  }, [selectedTahunAjaran, tahunAjaranList])

  const updateFormData = (updates) => {
    setFormData(prev => ({ ...prev, ...updates }))
  }

  const resetForm = () => {
    setFormData(initialFormState)
    setError('')
  }

  return {
    formData,
    submitting,
    error,
    setSubmitting,
    setError,
    updateFormData,
    resetForm,
  }
}
