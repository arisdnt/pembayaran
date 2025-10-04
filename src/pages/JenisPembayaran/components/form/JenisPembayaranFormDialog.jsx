import { Dialog } from '@radix-ui/themes'
import { useTahunAjaran } from '../../hooks/useTahunAjaran'
import { useKelas } from '../../hooks/useKelas'
import { useJenisPembayaranForm } from '../../hooks/useJenisPembayaranForm'
import { DialogHeader } from './DialogHeader'
import { DialogFooter } from './DialogFooter'
import { ErrorAlert } from './ErrorAlert'
import { JenisPembayaranFormFields } from './JenisPembayaranFormFields'

export function JenisPembayaranFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit 
}) {
  const { tahunAjaranList } = useTahunAjaran()
  const { tingkatList } = useKelas()

  const {
    formData,
    setFormData,
    submitting,
    error,
    filteredKelasList,
    filteredPeminatanList,
    handleSubmit,
  } = useJenisPembayaranForm(initialData, isEdit, onSubmit, onOpenChange)

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{
          maxWidth: '800px',
          width: '95vw',
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        <DialogHeader isEdit={isEdit} onClose={onOpenChange} />

        <form onSubmit={handleSubmit} className="overflow-auto bg-white" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6">
            <ErrorAlert error={error} />
            <JenisPembayaranFormFields
              formData={formData}
              setFormData={setFormData}
              tahunAjaranList={tahunAjaranList}
              tingkatList={tingkatList}
              filteredKelasList={filteredKelasList}
              filteredPeminatanList={filteredPeminatanList}
            />
          </div>
        </form>

        <DialogFooter 
          isEdit={isEdit} 
          submitting={submitting} 
          onClose={onOpenChange} 
          onSubmit={handleSubmit} 
        />
      </Dialog.Content>
    </Dialog.Root>
  )
}
