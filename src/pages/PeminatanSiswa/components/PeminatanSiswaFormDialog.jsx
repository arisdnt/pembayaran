import { useState } from 'react'
import { Dialog, TextField, TextArea, Select, Text, Button } from '@radix-ui/themes'
import { AlertCircle, BookOpen, Edit3, Users, Calendar, Hash, FileText, X } from 'lucide-react'

export function PeminatanSiswaFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit,
  siswaList = [],
  peminatanList = [],
  tahunAjaranList = [],
}) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      id_siswa: undefined,
      id_peminatan: undefined,
      id_tahun_ajaran: undefined,
      tingkat: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      catatan: '',
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.id_siswa || !formData.id_peminatan || !formData.id_tahun_ajaran) {
      setError('Siswa, Peminatan, dan Tahun Ajaran wajib dipilih')
      setSubmitting(false)
      return
    }

    if (!formData.tingkat) {
      setError('Tingkat wajib diisi')
      setSubmitting(false)
      return
    }

    if (!formData.tanggal_mulai) {
      setError('Tanggal mulai wajib diisi')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      setFormData({
        id: '',
        id_siswa: undefined,
        id_peminatan: undefined,
        id_tahun_ajaran: undefined,
        tingkat: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        catatan: '',
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
          maxWidth: '900px',
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
                {isEdit ? 'Edit Peminatan Siswa' : 'Tambah Peminatan Siswa'}
              </Text>
              <Text size="1" className="text-slate-600">
                {isEdit ? 'Perbarui data peminatan siswa' : 'Tambahkan peminatan siswa baru'}
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
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Siswa */}
                <label>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Users className="h-3.5 w-3.5 text-blue-500" />
                    <Text as="div" size="2" weight="medium">
                      Siswa <span className="text-red-600">*</span>
                    </Text>
                  </div>
                  <Select.Root 
                    value={formData.id_siswa} 
                    onValueChange={(value) => setFormData({ ...formData, id_siswa: value })}
                    required
                  >
                    <Select.Trigger 
                      style={{ borderRadius: 0, width: '100%' }}
                      placeholder="Pilih siswa..."
                    />
                    <Select.Content 
                      position="popper"
                      style={{ borderRadius: 0, maxHeight: '300px' }}
                      className="border-2 border-slate-300 shadow-lg bg-white z-50"
                    >
                      {siswaList.map((siswa) => (
                        <Select.Item 
                          key={siswa.id} 
                          value={siswa.id}
                          style={{ borderRadius: 0 }}
                          className="hover:bg-blue-50 cursor-pointer px-3 py-2"
                        >
                          {siswa.nama_lengkap} {siswa.nisn ? `(${siswa.nisn})` : ''}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Text size="1" className="text-slate-500 mt-1">
                    Pilih siswa yang akan ditambahkan
                  </Text>
                </label>

                {/* Peminatan */}
                <label>
                  <div className="flex items-center gap-1.5 mb-1">
                    <BookOpen className="h-3.5 w-3.5 text-indigo-500" />
                    <Text as="div" size="2" weight="medium">
                      Peminatan <span className="text-red-600">*</span>
                    </Text>
                  </div>
                  <Select.Root 
                    value={formData.id_peminatan} 
                    onValueChange={(value) => setFormData({ ...formData, id_peminatan: value })}
                    required
                  >
                    <Select.Trigger 
                      style={{ borderRadius: 0, width: '100%' }}
                      placeholder="Pilih peminatan..."
                    />
                    <Select.Content 
                      position="popper"
                      style={{ borderRadius: 0, maxHeight: '300px' }}
                      className="border-2 border-slate-300 shadow-lg bg-white z-50"
                    >
                      {peminatanList.map((peminatan) => (
                        <Select.Item 
                          key={peminatan.id} 
                          value={peminatan.id}
                          style={{ borderRadius: 0 }}
                          className="hover:bg-blue-50 cursor-pointer px-3 py-2"
                        >
                          {peminatan.kode} - {peminatan.nama}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Text size="1" className="text-slate-500 mt-1">
                    Pilih peminatan untuk siswa
                  </Text>
                </label>

                {/* Tahun Ajaran */}
                <label>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="h-3.5 w-3.5 text-purple-500" />
                    <Text as="div" size="2" weight="medium">
                      Tahun Ajaran <span className="text-red-600">*</span>
                    </Text>
                  </div>
                  <Select.Root 
                    value={formData.id_tahun_ajaran} 
                    onValueChange={(value) => setFormData({ ...formData, id_tahun_ajaran: value })}
                    required
                  >
                    <Select.Trigger 
                      style={{ borderRadius: 0, width: '100%' }}
                      placeholder="Pilih tahun ajaran..."
                    />
                    <Select.Content 
                      position="popper"
                      style={{ borderRadius: 0 }}
                      className="border-2 border-slate-300 shadow-lg bg-white z-50"
                    >
                      {tahunAjaranList.map((ta) => (
                        <Select.Item 
                          key={ta.id} 
                          value={ta.id}
                          style={{ borderRadius: 0 }}
                          className="hover:bg-blue-50 cursor-pointer px-3 py-2"
                        >
                          {ta.nama}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Text size="1" className="text-slate-500 mt-1">
                    Pilih tahun ajaran
                  </Text>
                </label>

                {/* Tingkat */}
                <label>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Hash className="h-3.5 w-3.5 text-green-500" />
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
                    Tingkat siswa saat mengikuti peminatan
                  </Text>
                </label>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Tanggal Mulai */}
                <label>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="h-3.5 w-3.5 text-green-500" />
                    <Text as="div" size="2" weight="medium">
                      Tanggal Mulai <span className="text-red-600">*</span>
                    </Text>
                  </div>
                  <TextField.Root
                    type="date"
                    value={formData.tanggal_mulai}
                    onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                    style={{ borderRadius: 0 }}
                    required
                  />
                  <Text size="1" className="text-slate-500 mt-1">
                    Tanggal mulai mengikuti peminatan
                  </Text>
                </label>

                {/* Tanggal Selesai */}
                <label>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="h-3.5 w-3.5 text-red-500" />
                    <Text as="div" size="2" weight="medium">
                      Tanggal Selesai
                    </Text>
                  </div>
                  <TextField.Root
                    type="date"
                    value={formData.tanggal_selesai}
                    onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                    style={{ borderRadius: 0 }}
                  />
                  <Text size="1" className="text-slate-500 mt-1">
                    Kosongkan jika masih berlangsung
                  </Text>
                </label>

                {/* Catatan */}
                <label>
                  <div className="flex items-center gap-1.5 mb-1">
                    <FileText className="h-3.5 w-3.5 text-orange-500" />
                    <Text as="div" size="2" weight="medium">
                      Catatan
                    </Text>
                  </div>
                  <TextArea
                    placeholder="Catatan tambahan (opsional)"
                    value={formData.catatan}
                    onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                    style={{ borderRadius: 0, minHeight: '120px' }}
                  />
                  <Text size="1" className="text-slate-500 mt-1">
                    Catatan atau informasi tambahan
                  </Text>
                </label>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 mt-4">
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
