import { useEffect } from 'react'
import { Dialog, Text } from '@radix-ui/themes'
import { BookOpen, Edit3, X } from 'lucide-react'
import { useRiwayatKelasSiswaForm } from '../../hooks/useRiwayatKelasSiswaForm'
import { useMultipleSiswaSelection } from '../../hooks/useMultipleSiswaSelection'
import { SingleSiswaEditForm } from './SingleSiswaEditForm'
import { MultipleSiswaForm } from './MultipleSiswaForm'
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
    handleSubmit: handleSingleSubmit,
  } = useRiwayatKelasSiswaForm(initialData, isEdit, onSubmit, onOpenChange)

  const {
    selectedSiswaList,
    searchQuery,
    setSearchQuery,
    isAutocompleteOpen,
    setIsAutocompleteOpen,
    searchedSiswaList,
    handleAddSiswa,
    handleRemoveSiswa,
    resetSelection,
    autocompleteRef,
    inputRef
  } = useMultipleSiswaSelection(siswaList)

  useEffect(() => {
    if (open && !isEdit) {
      resetSelection()
      setFormData({
        id: '',
        id_siswa: undefined,
        id_kelas: undefined,
        id_tahun_ajaran: undefined,
        tanggal_masuk: '',
        tanggal_keluar: '',
        status: 'aktif',
        catatan: '',
      })
    }
  }, [open, isEdit, resetSelection, setFormData])

  const handleMultipleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.id_tahun_ajaran || !formData.id_kelas || selectedSiswaList.length === 0) {
      return
    }

    const selectedTahun = tahunAjaranList.find(ta => ta.id === formData.id_tahun_ajaran)
    const tanggalMasuk = formData.tanggal_masuk || selectedTahun?.tanggal_mulai || new Date().toISOString().split('T')[0]
    const tanggalKeluar = formData.tanggal_keluar || selectedTahun?.tanggal_selesai || null

    const submitData = {
      siswa_ids: selectedSiswaList.map(s => s.id),
      id_kelas: formData.id_kelas,
      id_tahun_ajaran: formData.id_tahun_ajaran,
      status: formData.status || 'aktif',
      catatan: formData.catatan || '',
      tanggal_masuk: tanggalMasuk,
      tanggal_keluar: tanggalKeluar,
    }

    try {
      await onSubmit(submitData, false)
      onOpenChange(false)
      resetSelection()
    } catch (err) {
      console.error(err)
    }
  }

  const handleSubmit = isEdit ? handleSingleSubmit : handleMultipleSubmit

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        key={initialData?.id || 'new'}
        style={{
          maxWidth: isEdit ? '900px' : '1200px',
          width: '95vw',
          height: isEdit ? 'auto' : '680px',
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4 flex-shrink-0">
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

        <form onSubmit={handleSubmit} className="bg-white flex flex-col flex-1" style={{ minHeight: 0 }}>
          {isEdit ? (
            <SingleSiswaEditForm
              formData={formData}
              setFormData={setFormData}
              siswaList={siswaList}
              kelasList={kelasList}
              tahunAjaranList={tahunAjaranList}
              error={error}
            />
          ) : (
            <MultipleSiswaForm
              formData={formData}
              setFormData={setFormData}
              kelasList={kelasList}
              tahunAjaranList={tahunAjaranList}
              error={error}
              selectedSiswaList={selectedSiswaList}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isAutocompleteOpen={isAutocompleteOpen}
              setIsAutocompleteOpen={setIsAutocompleteOpen}
              searchedSiswaList={searchedSiswaList}
              handleAddSiswa={handleAddSiswa}
              handleRemoveSiswa={handleRemoveSiswa}
              autocompleteRef={autocompleteRef}
              inputRef={inputRef}
            />
          )}

          <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3 flex-shrink-0">
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
