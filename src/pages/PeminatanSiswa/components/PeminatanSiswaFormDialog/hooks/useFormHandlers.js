export function useEditFormHandlers(selections, updateFormData) {
  return {
    handleTahunAjaranChange: (value) => {
      selections.handleTahunAjaranChange(value)
      updateFormData({ id_tahun_ajaran: value, id_siswa: undefined })
    },
    handleTingkatChange: (value) => {
      selections.handleTingkatChange(value)
      updateFormData({ tingkat: value, id_siswa: undefined })
    },
    handleKelasChange: (value) => {
      selections.handleKelasChange(value)
      updateFormData({ id_siswa: undefined })
    },
  }
}

export function useCreateFormHandlers(selections, updateFormData, bulkSelection) {
  return {
    handleTahunAjaranChange: (value) => {
      selections.handleTahunAjaranChange(value)
      updateFormData({ id_tahun_ajaran: value })
      bulkSelection.resetSelection()
    },
    handleTingkatChange: (value) => {
      selections.handleTingkatChange(value)
      updateFormData({ tingkat: value })
      bulkSelection.resetSelection()
    },
    handleKelasChange: (value) => {
      selections.handleKelasChange(value)
      bulkSelection.resetSelection()
    },
  }
}
