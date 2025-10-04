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
    case 'selesai': return 'blue'
    case 'diganti': return 'orange'
    default: return 'gray'
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case 'aktif': return '✓ Aktif'
    case 'selesai': return '○ Selesai'
    case 'diganti': return '🔄 Diganti'
    default: return status
  }
}
