import { Dialog } from '@radix-ui/themes'
import { User, Hash, Calendar, MapPin, Phone, ToggleLeft } from 'lucide-react'
import { useFormState } from '../../hooks/useFormState'
import { FormTextField } from './components/FormTextField'
import { FormSelectField } from './components/FormSelectField'
import { FormDateField } from './components/FormDateField'
import { FormStatusSwitch } from './components/FormStatusSwitch'
import { FormError } from './components/FormError'
import { FormDialogHeader } from './components/FormDialogHeader'
import { FormDialogFooter } from './components/FormDialogFooter'

function SiswaFormDialog({ open, onOpenChange, onSubmit, initialData, isEdit }) {
  const {
    formData,
    setFormData,
    submitting,
    error,
    handleSubmit,
  } = useFormState(initialData)

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value })
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
        <FormDialogHeader isEdit={isEdit} onClose={() => onOpenChange(false)} />

        <form 
          onSubmit={(e) => handleSubmit(e, onSubmit, onOpenChange, isEdit)} 
          className="overflow-auto bg-white" 
          style={{ maxHeight: 'calc(90vh - 140px)' }}
        >
          <div className="p-6">
            {/* Row 1: Nama Lengkap & Jenis Kelamin */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormTextField
                label="Nama Lengkap"
                icon={User}
                iconColor="text-indigo-500"
                placeholder="Masukkan nama lengkap siswa"
                value={formData.nama_lengkap}
                onChange={(e) => updateField('nama_lengkap', e.target.value)}
                required
              />

              <FormSelectField
                label="Jenis Kelamin"
                icon={User}
                iconColor="text-indigo-500"
                placeholder="Pilih jenis kelamin"
                value={formData.jenis_kelamin}
                onChange={(value) => updateField('jenis_kelamin', value)}
                options={[
                  { value: 'Laki-laki', label: 'Laki-laki' },
                  { value: 'Perempuan', label: 'Perempuan' },
                ]}
              />
            </div>

            {/* Row 2: NISN & Tanggal Lahir */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormTextField
                label="NISN"
                icon={Hash}
                iconColor="text-blue-500"
                placeholder="Nomor Induk Siswa Nasional"
                value={formData.nisn}
                onChange={(e) => updateField('nisn', e.target.value)}
                helpText="Opsional - Nomor identitas siswa"
              />

              <FormDateField
                label="Tanggal Lahir"
                icon={Calendar}
                iconColor="text-purple-500"
                value={formData.tanggal_lahir}
                onChange={(e) => updateField('tanggal_lahir', e.target.value)}
              />
            </div>

            {/* Row 3: Nama Wali & Nomor WhatsApp */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormTextField
                label="Nama Wali Siswa"
                icon={User}
                iconColor="text-orange-500"
                placeholder="Nama lengkap wali/orang tua"
                value={formData.nama_wali_siswa}
                onChange={(e) => updateField('nama_wali_siswa', e.target.value)}
              />

              <FormTextField
                label="Nomor WhatsApp Wali"
                icon={Phone}
                iconColor="text-green-500"
                placeholder="Contoh: 08123456789"
                value={formData.nomor_whatsapp_wali}
                onChange={(e) => updateField('nomor_whatsapp_wali', e.target.value)}
              />
            </div>

            {/* Row 4: Alamat */}
            <div className="mb-4">
              <FormTextField
                label="Alamat"
                icon={MapPin}
                iconColor="text-red-500"
                placeholder="Alamat lengkap siswa"
                value={formData.alamat}
                onChange={(e) => updateField('alamat', e.target.value)}
              />
            </div>

            {/* Row 5: Status Aktif */}
            <FormStatusSwitch
              label="Status Aktif"
              icon={ToggleLeft}
              checked={formData.status_aktif}
              onChange={(checked) => updateField('status_aktif', checked)}
            />

            <FormError error={error} />
          </div>
        </form>

        <FormDialogFooter
          isEdit={isEdit}
          submitting={submitting}
          onCancel={() => onOpenChange(false)}
          onSubmit={(e) => handleSubmit(e, onSubmit, onOpenChange, isEdit)}
        />
      </Dialog.Content>

      <style>{`
        button[role="switch"],
        button[role="switch"]:focus,
        button[role="switch"]:focus-visible,
        button[role="switch"]:active {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
        
        .rt-SwitchRoot:focus,
        .rt-SwitchRoot:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </Dialog.Root>
  )
}

export default SiswaFormDialog
