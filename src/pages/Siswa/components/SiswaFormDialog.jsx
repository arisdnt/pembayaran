import { useState } from 'react'
import { Dialog, TextField, Flex, Text, Button, Select, Switch, TextArea } from '@radix-ui/themes'
import { AlertCircle, UserPlus, Edit3, User, Hash, Calendar, MapPin, Phone, X, ToggleLeft } from 'lucide-react'

function SiswaFormDialog({ 
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
      nisn: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      alamat: '',
      nomor_whatsapp_wali: '',
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

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      setFormData({
        id: '',
        nama_lengkap: '',
        nisn: '',
        tanggal_lahir: '',
        jenis_kelamin: '',
        alamat: '',
        nomor_whatsapp_wali: '',
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
                {isEdit ? 'Edit Siswa' : 'Tambah Siswa'}
              </Text>
              <Text size="1" className="text-slate-600">
                {isEdit ? 'Perbarui informasi siswa' : 'Tambahkan siswa baru ke sistem'}
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
                  placeholder="Masukkan nama lengkap siswa"
                  value={formData.nama_lengkap}
                  onChange={(e) => setFormData({ ...formData, nama_lengkap: e.target.value })}
                  style={{ borderRadius: 0 }}
                  required
                />
              </label>
            </div>

            {/* Row 2: NISN & Tanggal Lahir - 2 Columns */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Hash className="h-3.5 w-3.5 text-blue-500" />
                  <Text as="div" size="2" weight="medium">
                    NISN
                  </Text>
                </div>
                <TextField.Root
                  placeholder="Nomor Induk Siswa Nasional"
                  value={formData.nisn}
                  onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                  style={{ borderRadius: 0 }}
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Opsional - Nomor identitas siswa
                </Text>
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Calendar className="h-3.5 w-3.5 text-purple-500" />
                  <Text as="div" size="2" weight="medium">
                    Tanggal Lahir
                  </Text>
                </div>
                <input
                  type="date"
                  value={formData.tanggal_lahir}
                  onChange={(e) => setFormData({ ...formData, tanggal_lahir: e.target.value })}
                  className="w-full px-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
                  style={{ 
                    borderRadius: 0,
                    height: '36px',
                    fontSize: '14px',
                    lineHeight: '20px'
                  }}
                />
              </label>
            </div>

            {/* Row 3: Jenis Kelamin & Nomor WhatsApp - 2 Columns */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <User className="h-3.5 w-3.5 text-indigo-500" />
                  <Text as="div" size="2" weight="medium">
                    Jenis Kelamin
                  </Text>
                </div>
                <Select.Root 
                  value={formData.jenis_kelamin} 
                  onValueChange={(value) => setFormData({ ...formData, jenis_kelamin: value })}
                >
                  <Select.Trigger 
                    style={{ borderRadius: 0, width: '100%', height: '36px' }}
                    placeholder="Pilih jenis kelamin"
                    className="cursor-pointer"
                  />
                  <Select.Content 
                    position="popper"
                    side="bottom"
                    align="start"
                    sideOffset={4}
                    style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)' }}
                    className="border-2 border-slate-300 shadow-lg bg-white z-50"
                  >
                    <Select.Item 
                      value="Laki-laki"
                      className="hover:bg-blue-50 cursor-pointer px-3 py-2 focus:bg-blue-100"
                      style={{ borderRadius: 0 }}
                    >
                      Laki-laki
                    </Select.Item>
                    <Select.Item 
                      value="Perempuan"
                      className="hover:bg-blue-50 cursor-pointer px-3 py-2 focus:bg-blue-100"
                      style={{ borderRadius: 0 }}
                    >
                      Perempuan
                    </Select.Item>
                  </Select.Content>
                </Select.Root>
              </label>

              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <Phone className="h-3.5 w-3.5 text-green-500" />
                  <Text as="div" size="2" weight="medium">
                    Nomor WhatsApp Wali
                  </Text>
                </div>
                <TextField.Root
                  placeholder="Contoh: 08123456789"
                  value={formData.nomor_whatsapp_wali}
                  onChange={(e) => setFormData({ ...formData, nomor_whatsapp_wali: e.target.value })}
                  style={{ borderRadius: 0 }}
                />
                <Text size="1" className="text-slate-500 mt-1">
                  Untuk notifikasi tagihan ke orang tua/wali
                </Text>
              </label>
            </div>

            {/* Row 4: Alamat - Full Width */}
            <div className="mb-4">
              <label>
                <div className="flex items-center gap-1.5 mb-1">
                  <MapPin className="h-3.5 w-3.5 text-red-500" />
                  <Text as="div" size="2" weight="medium">
                    Alamat
                  </Text>
                </div>
                <TextArea
                  placeholder="Alamat lengkap siswa"
                  value={formData.alamat}
                  onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
                  style={{ borderRadius: 0 }}
                  rows={3}
                />
              </label>
            </div>

            {/* Row 5: Status Aktif - Full Width */}
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-1">
                <ToggleLeft className="h-3.5 w-3.5 text-teal-500" />
                <Text as="div" size="2" weight="medium">
                  Status Aktif
                </Text>
              </div>
              <div className="border-2 border-slate-300 bg-slate-50 p-4">
                <label className="cursor-pointer">
                  <Flex align="center" gap="3">
                    <Switch
                      checked={formData.status_aktif}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, status_aktif: checked })
                      }
                      size="3"
                      className="cursor-pointer focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      style={{ outline: 'none', boxShadow: 'none' }}
                    />
                    <div>
                      <Text size="2" weight="bold" className={formData.status_aktif ? 'text-green-600' : 'text-slate-500'}>
                        {formData.status_aktif ? 'Status Aktif' : 'Status Nonaktif'}
                      </Text>
                      <Text size="1" className="text-slate-500 mt-0.5 block">
                        {formData.status_aktif 
                          ? 'Siswa dapat menerima tagihan dan mengakses sistem' 
                          : 'Siswa tidak dapat menerima tagihan'}
                      </Text>
                    </div>
                  </Flex>
                </label>
              </div>
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
                {isEdit ? <Edit3 className="h-4 w-4" /> : <UserPlus className="h-4 w-4" />}
                {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
              </span>
            </button>
          </div>
        </div>
      </Dialog.Content>

      {/* Switch styling - Remove focus outline */}
      <style>{`
        /* Remove focus outline from Switch */
        button[role="switch"],
        button[role="switch"]:focus,
        button[role="switch"]:focus-visible,
        button[role="switch"]:active,
        button[role="switch"][data-state="checked"],
        button[role="switch"][data-state="unchecked"] {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
        
        /* Remove Radix UI default focus styles */
        .rt-SwitchRoot,
        .rt-SwitchRoot:focus,
        .rt-SwitchRoot:focus-visible,
        .rt-SwitchRoot[data-state="checked"],
        .rt-SwitchRoot[data-state="unchecked"] {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
        
        /* Remove ring/glow effect */
        .rt-SwitchRoot::before,
        .rt-SwitchRoot::after {
          box-shadow: none !important;
        }
      `}</style>
    </Dialog.Root>
  )
}

export default SiswaFormDialog
