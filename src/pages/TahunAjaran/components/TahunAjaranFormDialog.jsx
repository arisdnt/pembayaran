import { useState } from 'react'
import { Dialog, TextField, Flex, Text, Switch, Button } from '@radix-ui/themes'
import { AlertCircle, Calendar, Edit3, Plus, X } from 'lucide-react'

function TahunAjaranFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEdit
}) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      nama: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      status_aktif: false,
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.nama || !formData.tanggal_mulai || !formData.tanggal_selesai) {
      setError('Semua field wajib diisi')
      setSubmitting(false)
      return
    }

    if (formData.tanggal_selesai <= formData.tanggal_mulai) {
      setError('Tanggal selesai harus setelah tanggal mulai')
      setSubmitting(false)
      return
    }

    if (formData.nama.length > 20) {
      setError('Nama maksimal 20 karakter')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      setFormData({
        id: '',
        nama: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        status_aktif: false,
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
          maxWidth: '600px',
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
                <Plus className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                {isEdit ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'}
              </Text>
              <Text size="1" className="text-slate-600">
                {isEdit ? 'Perbarui informasi tahun ajaran' : 'Tambahkan periode tahun ajaran baru'}
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
            {/* Nama Tahun Ajaran */}
            <div className="mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-indigo-500" />
                  <Text as="div" size="2" weight="medium">
                    Nama Tahun Ajaran <span className="text-red-600">*</span>
                  </Text>
                </div>
                <TextField.Root
                  placeholder="Contoh: 2024/2025"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  maxLength={20}
                  required
                  style={{ borderRadius: 0 }}
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Maksimal 20 karakter
                </Text>
              </label>
            </div>

            {/* Tanggal Mulai & Selesai - 2 Columns */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-green-500" />
                  <Text as="div" size="2" weight="medium">
                    Tanggal Mulai <span className="text-red-600">*</span>
                  </Text>
                </div>
                <input
                  type="date"
                  value={formData.tanggal_mulai}
                  onChange={(e) => setFormData({ ...formData, tanggal_mulai: e.target.value })}
                  className="w-full px-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
                  style={{
                    borderRadius: 0,
                    height: '36px',
                  }}
                  required
                />
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-red-500" />
                  <Text as="div" size="2" weight="medium">
                    Tanggal Selesai <span className="text-red-600">*</span>
                  </Text>
                </div>
                <input
                  type="date"
                  value={formData.tanggal_selesai}
                  onChange={(e) => setFormData({ ...formData, tanggal_selesai: e.target.value })}
                  className="w-full px-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
                  style={{
                    borderRadius: 0,
                    height: '36px',
                  }}
                  required
                />
              </label>
            </div>

            {/* Status Aktif */}
            <div className="mb-4 p-3 bg-slate-50 border border-slate-200">
              <label>
                <Flex align="center" gap="2">
                  <Switch
                    checked={formData.status_aktif}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, status_aktif: checked })
                    }
                    className="focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                    style={{ outline: 'none', boxShadow: 'none' }}
                  />
                  <div>
                    <Text size="2" weight="medium">
                      Aktifkan tahun ajaran ini
                    </Text>
                    <Text size="1" className="text-slate-500 block">
                      Hanya satu tahun ajaran yang bisa aktif
                    </Text>
                  </div>
                </Flex>
              </label>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 mb-4">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
                <div>
                  <Text size="2" weight="medium" className="text-red-700">
                    Terjadi kesalahan
                  </Text>
                  <Text size="2" className="text-red-600">
                    {error}
                  </Text>
                </div>
              </div>
            )}
          </div>

          {/* Footer - Excel style */}
          <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
            <Button
              type="button"
              variant="soft"
              color="gray"
              disabled={submitting}
              onClick={() => onOpenChange(false)}
              style={{ borderRadius: 0 }}
              className="cursor-pointer border border-slate-300 shadow-sm hover:shadow"
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              style={{
                borderRadius: 0,
                backgroundColor: isEdit ? '#d97706' : '#059669',
                border: isEdit ? '1px solid #b45309' : '1px solid #047857'
              }}
              className="cursor-pointer text-white shadow-sm hover:shadow"
            >
              {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
            </Button>
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default TahunAjaranFormDialog
