import { useState } from 'react'
import { Dialog } from '@radix-ui/themes'
import { FormHeader } from './components/FormHeader'
import { ErrorMessage } from './components/ErrorMessage'
import { FormFields } from './components/FormFields'
import { FormFooter } from './components/FormFooter'
import { useFormState } from './components/useFormState'
import { validateForm } from './components/validation'

function WaliKelasFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit 
}) {
  const { formData, setFormData, resetForm } = useFormState(initialData)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    // Validate form
    const validationError = validateForm(formData)
    if (validationError) {
      setError(validationError)
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      resetForm()
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        key={initialData?.id || 'new'}
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
        <FormHeader isEdit={isEdit} onClose={handleCancel} />

        <form onSubmit={handleSubmit} className="overflow-auto bg-white" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6">
            <ErrorMessage error={error} />
            <FormFields formData={formData} setFormData={setFormData} />
          </div>
        </form>

        <FormFooter 
          isEdit={isEdit} 
          submitting={submitting} 
          onCancel={handleCancel}
          onSubmit={handleSubmit}
        />
      </Dialog.Content>
    </Dialog.Root>
  )
}

export default WaliKelasFormDialog
