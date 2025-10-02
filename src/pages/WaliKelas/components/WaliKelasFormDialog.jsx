import { useState } from 'react'
import { Dialog, TextField, Text, Button, Switch } from '@radix-ui/themes'
import { AlertCircle, UserPlus, Edit3, User, Key, Phone, Mail, X, ToggleLeft } from 'lucide-react'

function WaliKelasFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit 
}) {
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
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.nama_lengkap) {
      setError('Nama lengkap wajib diisi')
      setSubmitting(false)
      return
    }

    // Validasi email jika diisi
    if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setError('Format email tidak valid')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      setFormData({
        id: '',
        nama_lengkap: '',
        nip: '',
        nomor_telepon: '',
        email: '',
        status_aktif: true,
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
                <UserPlus className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                {isEdit ? 'Edit Wali Kelas' : 'Tambah Wali Kelas'}
              </Text>
              <Text size="1" className="text-slate-600">
                {isEdit ? 'Perbarui informasi wali kelas' : 'Tambahkan wali kelas baru ke sistem'}
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
            {/* Error Message */}
            {error && (
              <div className="mb-4 flex items-start gap-3 bg-red-50 border-2 border-red-300 p-4 shadow-sm">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <Text size="2" weight="medium" className="text-red-900 mb-1">
                    Kesalahan
                  </Text>
                  <Text size="2" className="text-red-700">
                    {error}
                  </Text>
                </div>
              </div>
            )}

            {/* Row 1: Nama Lengkap - Full Width */}
            <div className="mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <User className="h-3.5 w-3.5 text-indigo-500" />
                  <Text as="div" size="2" weight="medium">
                    Nama Lengkap <span className="text-red-600">*</span>
                  </Text>
                </div>
                <TextField.Root
                  placeholder="Masukkan nama lengkap wali kelas"
                  value={formData.nama_lengkap}
                  onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                  style={{ borderRadius: 0 }}
                  required
                />
              </label>
            </div>

            {/* Row 2: NIP & Nomor Telepon - 2 Columns */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Key className="h-3.5 w-3.5 text-purple-500" />
                  <Text as="div" size="2" weight="medium">
                    NIP
                  </Text>
                </div>
                <TextField.Root
                  placeholder="Nomor Induk Pegawai"
                  value={formData.nip}
                  onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                  style={{ borderRadius: 0 }}
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Opsional - Nomor identitas pegawai
                </Text>
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Phone className="h-3.5 w-3.5 text-green-500" />
                  <Text as="div" size="2" weight="medium">
                    Nomor Telepon
                  </Text>
                </div>
                <TextField.Root
                  placeholder="Contoh: 08123456789"
                  value={formData.nomor_telepon}
                  onChange={(e) => setFormData({ ...formData, nomor_telepon: e.target.value })}
                  style={{ borderRadius: 0 }}
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Nomor kontak wali kelas
                </Text>
              </label>
            </div>

            {/* Row 3: Email - Full Width */}
            <div className="mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Mail className="h-3.5 w-3.5 text-amber-500" />
                  <Text as="div" size="2" weight="medium">
                    Email
                  </Text>
                </div>
                <TextField.Root
                  type="email"
                  placeholder="Contoh: nama@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{ borderRadius: 0 }}
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Opsional - Untuk komunikasi resmi
                </Text>
              </label>
            </div>

            {/* Row 4: Status Aktif */}
            <div className="border-t-2 border-slate-200 pt-4">
              <label>
                <div className="flex items-center gap-1.5 mb-2">
                  <ToggleLeft className="h-3.5 w-3.5 text-slate-500" />
                  <Text as="div" size="2" weight="medium">
                    Status Kepegawaian
                  </Text>
                </div>
                <div className="flex items-center gap-3 bg-slate-50 border border-slate-300 p-3 shadow-sm">
                  <Switch
                    checked={formData.status_aktif}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, status_aktif: checked })
                    }
                    size="2"
                  />
                  <div className="flex-1">
                    <Text size="2" weight="medium" className="text-slate-900 block">
                      {formData.status_aktif ? 'Status Aktif' : 'Status Nonaktif'}
                    </Text>
                    <Text size="1" className="text-slate-500">
                      {formData.status_aktif 
                        ? 'Wali kelas dapat ditugaskan untuk mengajar' 
                        : 'Wali kelas tidak dapat ditugaskan'}
                    </Text>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </form>

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
            className="cursor-pointer text-white shadow-sm hover:shadow"
          >
            {isEdit ? <Edit3 className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
            {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default WaliKelasFormDialog
