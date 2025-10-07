export function formatDate(dateStr, options = { day: '2-digit', month: 'short', year: 'numeric' }) {
  if (!dateStr) return ''
  try {
    const date = new Date(dateStr)
    if (Number.isNaN(date.getTime())) return ''
    return date.toLocaleDateString('id-ID', options)
  } catch {
    return ''
  }
}
