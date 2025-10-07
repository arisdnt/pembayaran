import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { updatePembayaranWithRincian } from '../../../offline/actions/pembayaran'
import { validatePembayaranForm, preparePayloadItems } from '../utils/validationHelpers'

export function useEditPembayaranHandlers(formData, setFormData, rincianItems, setRincianItems, tagihanInfo) {
  const navigate = useNavigate()
  const { id } = useParams()

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  const handleInfoChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddRincian = (data) => {
    setRincianItems(prev => ([...prev, data]))
  }

  const handleRemoveRincian = (index) => {
    setRincianItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleRincianChange = (index, field, value) => {
    setRincianItems(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleSubmit = async () => {
    if (submitting || !tagihanInfo) {
      setError('Data tagihan tidak valid. Muat ulang halaman dan coba lagi.')
      return
    }

    setSubmitting(true)
    setError('')

    const newErrors = validatePembayaranForm(formData, rincianItems)
    setValidationErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      setError(newErrors.rincian || newErrors.nomor_pembayaran)
      setSubmitting(false)
      return
    }

    try {
      const payloadItems = preparePayloadItems(rincianItems)
      await updatePembayaranWithRincian(id, {
        id_tagihan: tagihanInfo.id,
        nomor_pembayaran: formData.nomor_pembayaran.trim(),
        catatan: formData.catatan ? formData.catatan.trim() : null,
      }, payloadItems)

      navigate('/pembayaran')
    } catch (err) {
      console.error('Error updating pembayaran:', err)
      setError(err.message || 'Gagal menyimpan perubahan pembayaran')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = Boolean(formData.nomor_pembayaran?.trim()) && rincianItems.length > 0 && !submitting

  return {
    error,
    submitting,
    validationErrors,
    canSubmit,
    handleInfoChange,
    handleAddRincian,
    handleRemoveRincian,
    handleRincianChange,
    handleSubmit,
  }
}
