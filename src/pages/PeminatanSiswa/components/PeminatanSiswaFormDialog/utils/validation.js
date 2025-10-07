export function validateEditForm(formData) {
  if (!formData.id_siswa || !formData.id_peminatan || !formData.id_tahun_ajaran) {
    return 'Siswa, Peminatan, dan Tahun Ajaran wajib dipilih'
  }
  if (!formData.tingkat) {
    return 'Tingkat wajib diisi'
  }
  return null
}

export function validateCreateForm(formData, selectedSiswaIds) {
  if (selectedSiswaIds.length === 0) {
    return 'Pilih minimal 1 siswa'
  }
  if (!formData.id_peminatan || !formData.id_tahun_ajaran) {
    return 'Peminatan dan Tahun Ajaran wajib dipilih'
  }
  if (!formData.tingkat) {
    return 'Tingkat wajib diisi'
  }
  return null
}
