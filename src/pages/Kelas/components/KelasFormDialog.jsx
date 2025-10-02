import { useState } from 'react'
import { Dialog, TextField, Flex, Text, Button } from '@radix-ui/themes'
import { AlertCircle, GraduationCap, Edit3, Hash, Users, X } from 'lucide-react'

function KelasFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit 
}) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      tingkat: '',
      nama_sub_kelas: '',
      kapasitas_maksimal: '',
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.tingkat || !formData.nama_sub_kelas) {
      setError('Tingkat dan Nama Kelas wajib diisi')
      setSubmitting(false)
      return
    }

    if (formData.kapasitas_maksimal && formData.kapasitas_maksimal <= 0) {
      setError('Kapasitas maksimal harus lebih dari 0')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      setFormData({
        id: '',
        tingkat: '',
        nama_sub_kelas: '',
        kapasitas_maksimal: '',
      })
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content 
        style={{ 
          maxWidth: '1100px',
          width: '95vw',
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header - Excel style */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-10 w-10 items-center justify-center border shadow-sm ${
              isEdit ? 'bg-amber-600 border-amber-700' : 'bg-green-600 border-green-700'
            }`}>
              {isEdit ? (
                <Edit3 className="h-5 w-5 text-white" />
              ) : (
                <GraduationCap className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                {isEdit ? 'Edit Kelas' : 'Tambah Kelas'}
              </Text>
              <Text size="1" className="text-slate-600">
                {isEdit ? 'Perbarui informasi kelas' : 'Tambahkan kelas baru ke sistem'}
              </Text>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
            aria-label="Close"
            type="button"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-auto bg-white" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6">
            {/* Row 1: Tingkat & Nama Kelas - 2 Columns */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Hash className="h-3.5 w-3.5 text-blue-500" />
                  <Text as="div" size="2" weight="medium">
                    Tingkat <span className="text-red-600">*</span>
                  </Text>
                </div>
                <TextField.Root
                  placeholder="Contoh: 10, 11, 12"
                  value={formData.tingkat}
                  onChange={(e) => setFormData({ ...formData, tingkat: e.target.value })}
                  style={{ borderRadius: 0 }}
                  required
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Tingkat kelas (10, 11, 12, dst)
                </Text>
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                  <Text as="div" size="2" weight="medium">
                    Nama Kelas <span className="text-red-600">*</span>
                  </Text>
                </div>
                <TextField.Root
                  placeholder="Contoh: A, B, IPA-1, IPS-2"
                  value={formData.nama_sub_kelas}
                  onChange={(e) => setFormData({ ...formData, nama_sub_kelas: e.target.value })}
                  style={{ borderRadius: 0 }}
                  required
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Nama sub-kelas atau jurusan
                </Text>
              </label>
            </div>

            {/* Row 2: Kapasitas - Full Width */}
            <div className="mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Users className="h-3.5 w-3.5 text-green-500" />
                  <Text as="div" size="2" weight="medium">
                    Kapasitas Maksimal
                  </Text>
                </div>
                <TextField.Root
                  type="number"
                  placeholder="Contoh: 30"
                  value={formData.kapasitas_maksimal}
                  onChange={(e) => setFormData({ ...formData, kapasitas_maksimal: e.target.value })}
                  style={{ borderRadius: 0 }}
                  min="1"
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Jumlah maksimal siswa (opsional)
                </Text>
              </label>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 mb-4">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <Text size="2" className="text-red-800 font-medium">
                  {error}
                </Text>
              </div>
            )}
          </div>
        </form>

        {/* Footer - Excel style */}
        <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold transition-colors shadow-sm hover:shadow border border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: 0 }}
            >
              <span className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Batal
              </span>
            </button>
            <button
              type="submit"
              disabled={submitting}
              onClick={handleSubmit}
              className={`px-5 py-2 text-white text-sm font-semibold transition-colors shadow-sm hover:shadow border disabled:opacity-50 disabled:cursor-not-allowed ${
                isEdit 
                  ? 'bg-amber-600 hover:bg-amber-700 border-amber-700' 
                  : 'bg-green-600 hover:bg-green-700 border-green-700'
              }`}
              style={{ borderRadius: 0 }}
            >
              <span className="flex items-center gap-2">
                {isEdit ? <Edit3 className="h-4 w-4" /> : <GraduationCap className="h-4 w-4" />}
                {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
              </span>
            </button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default KelasFormDialog
