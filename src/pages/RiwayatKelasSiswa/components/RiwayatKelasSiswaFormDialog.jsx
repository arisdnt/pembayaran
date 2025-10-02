import { Dialog, Text } from '@radix-ui/themes'
import { BookOpen, Edit3, X } from 'lucide-react'
import { useRiwayatKelasSiswaForm } from '../hooks/useRiwayatKelasSiswaForm'
import { PrimaryInfoSection } from './PrimaryInfoSection'
import { TimelineSection } from './TimelineSection'
import { FormError } from './FormError'
import { FormActions } from './FormActions'

function RiwayatKelasSiswaFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isEdit,
  siswaList,
  kelasList,
  tahunAjaranList
}) {
  const {
    formData,
    setFormData,
    submitting,
    error,
    handleSubmit,
  } = useRiwayatKelasSiswaForm(initialData, isEdit, onSubmit, onOpenChange)

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
        {/* Header - Excel style */}
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
                {isEdit ? 'Edit Riwayat Kelas' : 'Tambah Riwayat Kelas'}
              </Text>
              <Text size="1" className="text-slate-600">
                {isEdit ? 'Perbarui data riwayat kelas siswa' : 'Tambahkan riwayat kelas siswa baru'}
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
              <PrimaryInfoSection
                formData={formData}
                setFormData={setFormData}
                siswaList={siswaList}
                kelasList={kelasList}
                tahunAjaranList={tahunAjaranList}
              />

              <TimelineSection
                formData={formData}
                setFormData={setFormData}
              />
            </div>

            <FormError error={error} />
          </div>

          {/* Footer - Excel style */}
          <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
            <FormActions
              submitting={submitting}
              isEdit={isEdit}
              onCancel={() => onOpenChange(false)}
            />
          </div>
        </form>
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default RiwayatKelasSiswaFormDialog
