/**
 * Generate timestamp untuk timezone Indonesia (GMT+7 / Asia/Jakarta)
 * @returns {string} ISO string timestamp
 */
export function getCurrentTimestamp() {
  return new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' })
}

/**
 * Format tanggal untuk tampilan
 * @param {string} dateStr - Date string
 * @returns {string} Formatted date string
 */
export function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

/**
 * Format datetime lengkap untuk timestamp
 * @param {string} dateStr - Date string
 * @returns {string} Formatted datetime string
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

/**
 * Calculate duration between two dates
 * @param {string} startDate - Start date string
 * @param {string} endDate - End date string
 * @returns {string} Duration string
 */
export function calculateDuration(startDate, endDate) {
  if (!startDate || !endDate) return '—'
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const months = Math.floor(diffDays / 30)
  const days = diffDays % 30
  return `${months} Bulan ${days} Hari`
}
