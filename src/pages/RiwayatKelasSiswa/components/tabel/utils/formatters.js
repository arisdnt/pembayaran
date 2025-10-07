export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

export function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

export function getStatusBadgeColor(status) {
  switch (status) {
    case 'aktif': return 'green'
    case 'pindah_kelas': return 'blue'
    case 'lulus': return 'purple'
    case 'keluar': return 'gray'
    default: return 'gray'
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case 'aktif': return 'Aktif'
    case 'pindah_kelas': return 'Pindah Kelas'
    case 'lulus': return 'Lulus'
    case 'keluar': return 'Keluar'
    default: return status
  }
}

export function getWaliKelasName(kelas, tahunAjaranId) {
  if (!kelas?.riwayat_wali_kelas || !Array.isArray(kelas.riwayat_wali_kelas)) {
    return '—'
  }
  
  const activeWaliKelas = kelas.riwayat_wali_kelas.find(
    rwk => rwk.id_tahun_ajaran === tahunAjaranId && rwk.status === 'aktif'
  )
  
  return activeWaliKelas?.wali_kelas?.nama_lengkap || '—'
}
