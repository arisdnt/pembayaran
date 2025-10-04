export function validateForm(formData) {
  if (!formData.nama_lengkap) {
    return 'Nama lengkap wajib diisi'
  }

  // Validasi email jika diisi
  if (formData.email && !formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    return 'Format email tidak valid'
  }

  return null
}
