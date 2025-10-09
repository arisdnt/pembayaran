import { useState, useEffect } from 'react'
import { Dialog, TextField, TextArea, Flex, Text, Button, Switch, Select, VisuallyHidden } from '@radix-ui/themes'
import { AlertCircle, BookOpen, Edit3, Hash, FileText, TrendingUp, TrendingDown, Power, X } from 'lucide-react'
import { db } from '../../../offline/db'

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
  const [tingkatOptions, setTingkatOptions] = useState([])

  // Update form data when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)
    } else {
      setFormData({
        id: '',
        kode: '',
        nama: '',
        keterangan: '',
        tingkat_min: '',
        tingkat_max: '',
        aktif: true,
      })
    }
  }, [initialData])

  // Fetch tingkat dari kelas yang tersedia
  useEffect(() => {
    const fetchTingkat = async () => {
      try {
        const kelas = await db.kelas.orderBy('tingkat').toArray()
        const uniqueTingkat = [...new Set(kelas.map(k => k.tingkat))].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }))
        setTingkatOptions(uniqueTingkat)
      } catch (err) {
        console.error('Error fetching tingkat:', err)
      }
    }

    if (open) fetchTingkat()
  }, [open])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.nama) {
      setError('Nama Peminatan wajib diisi')
      setSubmitting(false)
      return
    }

    // Validasi tingkat min dan max
    if (formData.tingkat_min && formData.tingkat_max) {
      if (parseInt(formData.tingkat_max) < parseInt(formData.tingkat_min)) {
        setError('Tingkat Maximum harus sama dengan atau lebih besar dari Tingkat Minimum')
        setSubmitting(false)
        return
      }
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
          maxWidth: '600px',
          width: '95vw',
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <VisuallyHidden>
          <Dialog.Title>{isEdit ? 'Edit Peminatan' : 'Tambah Peminatan'}</Dialog.Title>
          <Dialog.Description>
            {isEdit ? 'Perbarui informasi peminatan' : 'Tambahkan peminatan baru ke sistem'}
          </Dialog.Description>
        </VisuallyHidden>

        {/* Header */}
        <div className="flex items-center border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center border shadow-sm ${
              isEdit ? 'bg-amber-600 border-amber-700' : 'bg-green-600 border-green-700'
            }`}>
              {isEdit ? (
                <Edit3 className="h-4 w-4 text-white" />
              ) : (
                <BookOpen className="h-4 w-4 text-white" />
              )}
            </div>
            <div>
              <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
                {isEdit ? 'Edit Peminatan' : 'Tambah Peminatan'}
              </Text>
            </div>
          </div>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-auto bg-white" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6 space-y-5">
            {/* Row 1: Nama & Keterangan - 2 Columns */}
            <div className="grid grid-cols-2 gap-4">
              <label>
                <div className="flex items-center gap-1.5 mb-2">
                  <BookOpen className="h-4 w-4 text-indigo-500" />
                  <Text as="div" size="2" weight="medium">
                    Nama Peminatan <span className="text-red-600">*</span>
                  </Text>
                </div>
                <TextField.Root
                  placeholder="Contoh: IPA, IPS, Bahasa dan Sastra"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  style={{ borderRadius: 0 }}
                  required
                />
                <Text size="1" className="text-slate-500 mt-1.5">
                  Nama lengkap peminatan
                </Text>
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-2">
                  <FileText className="h-4 w-4 text-purple-500" />
                  <Text as="div" size="2" weight="medium">
                    Keterangan
                  </Text>
                </div>
                <TextField.Root
                  placeholder="Deskripsi atau catatan tentang peminatan ini"
                  value={formData.keterangan}
                  onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
                  style={{ borderRadius: 0 }}
                />
                <Text size="1" className="text-slate-500 mt-1.5">
                  Informasi tambahan (opsional)
                </Text>
              </label>
            </div>

            {/* Row 3: Tingkat Min & Max - 2 Columns */}
            <div className="grid grid-cols-2 gap-4">
              <label>
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingDown className="h-4 w-4 text-green-500" />
                  <Text as="div" size="2" weight="medium">
                    Tingkat Minimum
                  </Text>
                </div>
                <Select.Root
                  value={formData.tingkat_min?.toString() || 'placeholder'}
                  onValueChange={(value) => setFormData({ ...formData, tingkat_min: value === 'placeholder' ? '' : parseInt(value) })}
                >
                  <Select.Trigger
                    placeholder="Pilih tingkat minimum"
                    style={{ borderRadius: 0, width: '100%' }}
                  />
                  <Select.Content style={{ borderRadius: 0 }}>
                    <Select.Item value="placeholder" disabled>-- Pilih Tingkat --</Select.Item>
                    {tingkatOptions.map((tingkat) => (
                      <Select.Item key={tingkat} value={tingkat.toString()}>
                        Tingkat {tingkat}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Text size="1" className="text-slate-500 mt-1.5">
                  Tingkat terendah yang diperbolehkan
                </Text>
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-2">
                  <TrendingUp className="h-4 w-4 text-orange-500" />
                  <Text as="div" size="2" weight="medium">
                    Tingkat Maximum
                  </Text>
                </div>
                <Select.Root
                  value={formData.tingkat_max?.toString() || 'placeholder'}
                  onValueChange={(value) => setFormData({ ...formData, tingkat_max: value === 'placeholder' ? '' : parseInt(value) })}
                >
                  <Select.Trigger
                    placeholder="Pilih tingkat maksimum"
                    style={{ borderRadius: 0, width: '100%' }}
                  />
                  <Select.Content style={{ borderRadius: 0 }}>
                    <Select.Item value="placeholder" disabled>-- Pilih Tingkat --</Select.Item>
                    {tingkatOptions.map((tingkat) => (
                      <Select.Item key={tingkat} value={tingkat.toString()}>
                        Tingkat {tingkat}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Text size="1" className="text-slate-500 mt-1.5">
                  Tingkat tertinggi yang diperbolehkan
                </Text>
              </label>
            </div>

            {/* Row 4: Status Aktif */}
            <div>
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
              <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <Text size="2" className="text-red-800 font-medium">
                  {error}
                </Text>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
          <Button
            size="2"
            type="button"
            variant="soft"
            color="gray"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
            style={{ borderRadius: 0 }}
            className="cursor-pointer border border-slate-300 shadow-sm hover:shadow flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Batal
          </Button>
          <Button
            size="2"
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              borderRadius: 0,
              backgroundColor: isEdit ? '#d97706' : '#16a34a',
              border: isEdit ? '1px solid #b45309' : '1px solid #15803d'
            }}
            className="cursor-pointer text-white shadow-sm hover:shadow flex items-center gap-2"
          >
            {isEdit ? <Edit3 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
            {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
