import { useState } from 'react'
import { Dialog, TextField, TextArea, Flex, Text, Button, Switch } from '@radix-ui/themes'
import { AlertCircle, BookOpen, Edit3, Hash, FileText, TrendingUp, TrendingDown, Power, X } from 'lucide-react'

export function PeminatanFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit 
}) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      kode: '',
      nama: '',
      keterangan: '',
      tingkat_min: '',
      tingkat_max: '',
      aktif: true,
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.kode || !formData.nama) {
      setError('Kode dan Nama Peminatan wajib diisi')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      setFormData({
        id: '',
        kode: '',
        nama: '',
        keterangan: '',
        tingkat_min: '',
        tingkat_max: '',
        aktif: true,
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
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-10 w-10 items-center justify-center border shadow-sm ${
              isEdit ? 'bg-amber-600 border-amber-700' : 'bg-green-600 border-green-700'
            }`}>
              {isEdit ? (
                <Edit3 className="h-5 w-5 text-white" />
              ) : (
                <BookOpen className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                {isEdit ? 'Edit Peminatan' : 'Tambah Peminatan'}
              </Text>
              <Text size="1" className="text-slate-600">
                {isEdit ? 'Perbarui informasi peminatan' : 'Tambahkan peminatan baru ke sistem'}
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
            {/* Row 1: Kode & Nama - 2 Columns */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Hash className="h-3.5 w-3.5 text-blue-500" />
                  <Text as="div" size="2" weight="medium">
                    Kode <span className="text-red-600">*</span>
                  </Text>
                </div>
                <TextField.Root
                  placeholder="Contoh: IPA, IPS, BHS"
                  value={formData.kode}
                  onChange={(e) => setFormData({ ...formData, kode: e.target.value })}
                  style={{ borderRadius: 0 }}
                  required
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Kode unik untuk identifikasi
                </Text>
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                  <Text as="div" size="2" weight="medium">
                    Nama Peminatan <span className="text-red-600">*</span>
                  </Text>
                </div>
                <TextField.Root
                  placeholder="Contoh: IPA, IPS, Bahasa"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  style={{ borderRadius: 0 }}
                  required
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Nama lengkap peminatan
                </Text>
              </label>
            </div>

            {/* Row 2: Keterangan - Full Width */}
            <div className="mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText className="h-3.5 w-3.5 text-purple-500" />
                  <Text as="div" size="2" weight="medium">
                    Keterangan
                  </Text>
                </div>
                <TextArea
                  placeholder="Deskripsi atau catatan tentang peminatan ini"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  style={{ borderRadius: 0, minHeight: '80px' }}
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Informasi tambahan (opsional)
                </Text>
              </label>
            </div>

            {/* Row 3: Tingkat Min & Max - 2 Columns */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingDown className="h-3.5 w-3.5 text-green-500" />
                  <Text as="div" size="2" weight="medium">
                    Tingkat Minimum
                  </Text>
                </div>
                <TextField.Root
                  type="number"
                  placeholder="Contoh: 10"
                  value={formData.tingkat_min}
                  onChange={(e) => setFormData({ ...formData, tingkat_min: e.target.value })}
                  style={{ borderRadius: 0 }}
                  min="0"
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Tingkat terendah yang diperbolehkan
                </Text>
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <TrendingUp className="h-3.5 w-3.5 text-orange-500" />
                  <Text as="div" size="2" weight="medium">
                    Tingkat Maximum
                  </Text>
                </div>
                <TextField.Root
                  type="number"
                  placeholder="Contoh: 12"
                  value={formData.tingkat_max}
                  onChange={(e) => setFormData({ ...formData, tingkat_max: e.target.value })}
                  style={{ borderRadius: 0 }}
                  min="0"
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Tingkat tertinggi yang diperbolehkan
                </Text>
              </label>
            </div>

            {/* Row 4: Status Aktif */}
            <div className="mb-4">
              <label className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-300">
                <Power className="h-5 w-5 text-green-600" />
                <div className="flex-1">
                  <Text as="div" size="2" weight="medium" className="text-slate-700">
                    Status Aktif
                  </Text>
                  <Text size="1" className="text-slate-500">
                    Peminatan aktif dapat dipilih oleh siswa
                  </Text>
                </div>
                <Switch
                  checked={formData.aktif}
                  onCheckedChange={(checked) => setFormData({ ...formData, aktif: checked })}
                  style={{ cursor: 'pointer' }}
                />
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

        {/* Footer */}
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
                {isEdit ? <Edit3 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
              </span>
            </button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
