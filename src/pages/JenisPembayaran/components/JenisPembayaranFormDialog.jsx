import { useState, useEffect } from 'react'
import { Dialog, TextField, Text, Button, Select, Switch, TextArea } from '@radix-ui/themes'
import { AlertCircle, DollarSign, Edit3, FileText, Hash, Tag, Calendar, GraduationCap, X } from 'lucide-react'
import { useTahunAjaran } from '../hooks/useTahunAjaran'
import { useKelas } from '../hooks/useKelas'

export function JenisPembayaranFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit 
}) {
  const { tahunAjaranList } = useTahunAjaran()
  const { tingkatList } = useKelas()
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      kode: '',
      nama: '',
      deskripsi: '',
      jumlah_default: '',
      tipe_pembayaran: '',
      id_tahun_ajaran: '',
      tingkat: '',
      wajib: true,
      status_aktif: true,
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Update form when initialData changes
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        tingkat: initialData.tingkat || '',
        wajib: initialData.wajib ?? true,
        status_aktif: initialData.status_aktif ?? true,
      })
    } else {
      setFormData({
        id: '',
        kode: '',
        nama: '',
        deskripsi: '',
        jumlah_default: '',
        tipe_pembayaran: '',
        id_tahun_ajaran: '',
        tingkat: '',
        wajib: true,
        status_aktif: true,
      })
    }
  }, [initialData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    // Validasi field wajib
    if (!formData.kode || !formData.nama) {
      setError('Kode dan Nama wajib diisi')
      setSubmitting(false)
      return
    }

    if (!formData.id_tahun_ajaran) {
      setError('Tahun Ajaran wajib dipilih')
      setSubmitting(false)
      return
    }

    if (!formData.tingkat) {
      setError('Tingkat Kelas wajib dipilih')
      setSubmitting(false)
      return
    }

    if (!formData.tipe_pembayaran) {
      setError('Tipe Pembayaran wajib dipilih')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
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
              {isEdit ? <Edit3 className="h-5 w-5 text-white" /> : <DollarSign className="h-5 w-5 text-white" />}
            </div>
            <div>
              <Dialog.Title asChild>
                <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                  {isEdit ? 'Edit Jenis Pembayaran' : 'Tambah Jenis Pembayaran'}
                </Text>
              </Dialog.Title>
              <Dialog.Description asChild>
                <Text size="1" className="text-slate-600">
                  {isEdit ? 'Perbarui informasi jenis pembayaran' : 'Tambahkan jenis pembayaran baru'}
                </Text>
              </Dialog.Description>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
            type="button"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-red-600" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-auto bg-white" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6">
            {error && (
              <div className="mb-4 flex items-start gap-3 bg-red-50 border-2 border-red-300 p-4">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <Text size="2" weight="medium" className="text-red-900">Kesalahan</Text>
                  <Text size="2" className="text-red-700">{error}</Text>
                </div>
              </div>
            )}

            {/* Row 1: Kode & Nama */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Hash className="h-3.5 w-3.5 text-blue-500" />
                  <Text size="2" weight="medium">Kode <span className="text-red-600">*</span></Text>
                </div>
                <TextField.Root
                  placeholder="Contoh: SPP, SERAGAM"
                  value={formData.kode}
                  onChange={(e) => setFormData({ ...formData, kode: e.target.value.toUpperCase() })}
                  style={{ borderRadius: 0 }}
                  required
                />
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Tag className="h-3.5 w-3.5 text-indigo-500" />
                  <Text size="2" weight="medium">Nama <span className="text-red-600">*</span></Text>
                </div>
                <TextField.Root
                  placeholder="Nama jenis pembayaran"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  style={{ borderRadius: 0 }}
                  required
                />
              </label>
            </div>

            {/* Row 2: Deskripsi */}
            <div className="mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <FileText className="h-3.5 w-3.5 text-slate-500" />
                  <Text size="2" weight="medium">Deskripsi</Text>
                </div>
                <TextArea
                  placeholder="Keterangan tambahan..."
                  value={formData.deskripsi}
                  onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
                  style={{ borderRadius: 0, minHeight: '80px' }}
                />
              </label>
            </div>

            {/* Row 3: Jumlah & Tipe */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <DollarSign className="h-3.5 w-3.5 text-green-500" />
                  <Text size="2" weight="medium">Jumlah Default</Text>
                </div>
                <TextField.Root
                  type="number"
                  placeholder="0"
                  value={formData.jumlah_default}
                  onChange={(e) => setFormData({ ...formData, jumlah_default: e.target.value })}
                  style={{ borderRadius: 0 }}
                />
                <Text size="1" className="text-slate-500 mt-1">Jumlah dalam Rupiah</Text>
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-purple-500" />
                  <Text size="2" weight="medium">Tipe Pembayaran <span className="text-red-600">*</span></Text>
                </div>
                <Select.Root 
                  value={formData.tipe_pembayaran} 
                  onValueChange={(value) => setFormData({ ...formData, tipe_pembayaran: value })}
                  required
                >
                  <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tipe" />
                  <Select.Content style={{ borderRadius: 0 }}>
                    <Select.Item value="bulanan">Bulanan</Select.Item>
                    <Select.Item value="tahunan">Tahunan</Select.Item>
                    <Select.Item value="sekali">Sekali (One-time)</Select.Item>
                  </Select.Content>
                </Select.Root>
              </label>
            </div>

            {/* Row 4: Tahun Ajaran & Tingkat Kelas */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-blue-500" />
                  <Text size="2" weight="medium">Tahun Ajaran <span className="text-red-600">*</span></Text>
                </div>
                <Select.Root 
                  value={formData.id_tahun_ajaran} 
                  onValueChange={(value) => setFormData({ ...formData, id_tahun_ajaran: value })}
                  required
                >
                  <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tahun ajaran" />
                  <Select.Content style={{ borderRadius: 0 }}>
                    {tahunAjaranList.map((tahun) => (
                      <Select.Item key={tahun.id} value={tahun.id}>
                        {tahun.nama} {tahun.status_aktif && '(Aktif)'}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Text size="1" className="text-slate-500 mt-1">Wajib dipilih untuk isolasi data per tahun ajaran</Text>
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
                  <Text size="2" weight="medium">Tingkat Kelas <span className="text-red-600">*</span></Text>
                </div>
                <Select.Root 
                  value={formData.tingkat} 
                  onValueChange={(value) => setFormData({ ...formData, tingkat: value })}
                  required
                >
                  <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tingkat" />
                  <Select.Content style={{ borderRadius: 0 }}>
                    {tingkatList.map((tingkat) => (
                      <Select.Item key={tingkat} value={tingkat}>
                        Kelas {tingkat}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
                <Text size="1" className="text-slate-500 mt-1">Berlaku untuk semua kelas di tingkat ini</Text>
              </label>
            </div>

            {/* Row 6: Status Switches */}
            <div className="border-t-2 border-slate-200 pt-4 space-y-3">
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-300 p-3">
                <Switch
                  checked={formData.wajib}
                  onCheckedChange={(checked) => setFormData({ ...formData, wajib: checked })}
                  size="2"
                />
                <div className="flex-1">
                  <Text size="2" weight="medium" className="text-slate-900">
                    {formData.wajib ? 'Pembayaran Wajib' : 'Pembayaran Opsional'}
                  </Text>
                  <Text size="1" className="text-slate-500">
                    {formData.wajib ? 'Harus dibayar oleh siswa' : 'Bersifat opsional'}
                  </Text>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 border border-slate-300 p-3">
                <Switch
                  checked={formData.status_aktif}
                  onCheckedChange={(checked) => setFormData({ ...formData, status_aktif: checked })}
                  size="2"
                />
                <div className="flex-1">
                  <Text size="2" weight="medium" className="text-slate-900">
                    {formData.status_aktif ? 'Status Aktif' : 'Status Nonaktif'}
                  </Text>
                  <Text size="1" className="text-slate-500">
                    {formData.status_aktif ? 'Dapat digunakan untuk tagihan' : 'Tidak dapat digunakan'}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <Button
            type="button"
            variant="soft"
            color="gray"
            disabled={submitting}
            onClick={() => onOpenChange(false)}
            style={{ borderRadius: 0 }}
            className="cursor-pointer border border-slate-300"
          >
            <X className="h-3.5 w-3.5" />
            Batal
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            style={{
              borderRadius: 0,
              backgroundColor: isEdit ? '#d97706' : '#16a34a',
              border: isEdit ? '1px solid #b45309' : '1px solid #15803d'
            }}
            className="cursor-pointer text-white"
          >
            {isEdit ? <Edit3 className="h-3.5 w-3.5" /> : <DollarSign className="h-3.5 w-3.5" />}
            {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
