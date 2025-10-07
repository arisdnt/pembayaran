import { useEffect } from 'react'
import { Dialog, Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { usePeminatanData } from './hooks/usePeminatanData'
import { useNestedSelections } from './hooks/useNestedSelections'
import { useBulkSelection } from './hooks/useBulkSelection'
import { usePeminatanFormData } from './hooks/usePeminatanFormData'
import { useEditFormHandlers, useCreateFormHandlers } from './hooks/useFormHandlers'
import { validateEditForm, validateCreateForm } from './utils/validation'
import { DialogHeader } from './components/DialogHeader'
import { DialogFooter } from './components/DialogFooter'
import { EditForm } from './components/EditForm'
import { CreateForm } from './components/CreateForm'

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
  const { riwayatKelasSiswa, kelasList, existingPeminatanSiswa } = usePeminatanData()
  const selections = useNestedSelections({
    initialData, isEdit, riwayatKelasSiswa, kelasList, siswaList, existingPeminatanSiswa,
  })
  const { formData, submitting, error, setSubmitting, setError, updateFormData, resetForm } = 
    usePeminatanFormData({ initialData, tahunAjaranList, selectedTahunAjaran: selections.selectedTahunAjaran })
  const bulkSelection = useBulkSelection(selections.filteredSiswaList)
  const editHandlers = useEditFormHandlers(selections, updateFormData)
  const createHandlers = useCreateFormHandlers(selections, updateFormData, bulkSelection)

  useEffect(() => {
    if (open && !isEdit) {
      selections.resetSelections()
      bulkSelection.resetSelection()
    }
  }, [open, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    const validationError = isEdit 
      ? validateEditForm(formData) 
      : validateCreateForm(formData, bulkSelection.selectedSiswaIds)
    
    if (validationError) {
      setError(validationError)
      setSubmitting(false)
      return
    }

    try {
      const submitData = isEdit ? formData : {
        siswa_ids: bulkSelection.selectedSiswaIds,
        id_peminatan: formData.id_peminatan,
        id_tahun_ajaran: formData.id_tahun_ajaran,
        tingkat: formData.tingkat,
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_selesai: formData.tanggal_selesai || null,
        catatan: formData.catatan || null,
      }
      await onSubmit(submitData, isEdit)
      onOpenChange(false)
      resetForm()
      if (!isEdit) bulkSelection.resetSelection()
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
          maxWidth: isEdit ? '900px' : '1400px',
          width: '95vw',
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        <DialogHeader isEdit={isEdit} onClose={() => onOpenChange(false)} />

        <form onSubmit={handleSubmit} className="overflow-auto bg-white" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6">
            {isEdit ? (
              <EditForm
                formData={formData}
                tahunAjaranList={tahunAjaranList}
                peminatanList={peminatanList}
                selectedTahunAjaran={selections.selectedTahunAjaran}
                selectedTingkat={selections.selectedTingkat}
                selectedKelas={selections.selectedKelas}
                tingkatOptions={selections.tingkatOptions}
                kelasOptions={selections.kelasOptions}
                filteredSiswaList={selections.filteredSiswaList}
                onTahunAjaranChange={editHandlers.handleTahunAjaranChange}
                onTingkatChange={editHandlers.handleTingkatChange}
                onKelasChange={editHandlers.handleKelasChange}
                onFormDataChange={updateFormData}
              />
            ) : (
              <CreateForm
                formData={formData}
                tahunAjaranList={tahunAjaranList}
                peminatanList={peminatanList}
                selectedTahunAjaran={selections.selectedTahunAjaran}
                selectedTingkat={selections.selectedTingkat}
                selectedKelas={selections.selectedKelas}
                tingkatOptions={selections.tingkatOptions}
                kelasOptions={selections.kelasOptions}
                filteredSiswaList={selections.filteredSiswaList}
                searchedSiswaList={bulkSelection.searchedSiswaList}
                selectedSiswaIds={bulkSelection.selectedSiswaIds}
                searchSiswa={bulkSelection.searchSiswa}
                siswaWithPeminatan={selections.siswaWithPeminatan}
                onTahunAjaranChange={createHandlers.handleTahunAjaranChange}
                onTingkatChange={createHandlers.handleTingkatChange}
                onKelasChange={createHandlers.handleKelasChange}
                onFormDataChange={updateFormData}
                onSearchChange={bulkSelection.setSearchSiswa}
                onToggleSiswa={bulkSelection.handleToggleSiswa}
                onSelectAll={bulkSelection.handleSelectAll}
              />
            )}

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 mt-4">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <Text size="2" className="text-red-800 font-medium">{error}</Text>
              </div>
            )}
          </div>
        </form>

        <DialogFooter isEdit={isEdit} submitting={submitting} onCancel={() => onOpenChange(false)} onSubmit={handleSubmit} />
      </Dialog.Content>
    </Dialog.Root>
  )
}
