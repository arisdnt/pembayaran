import { Clock, RefreshCw, CheckCircle, XCircle } from 'lucide-react'

export const STATUS_ORDER = ['pending', 'syncing', 'applied', 'error']

export const statusBadgeConfig = {
  pending: { color: 'amber', icon: Clock, label: 'Pending' },
  syncing: { color: 'blue', icon: RefreshCw, label: 'Syncing' },
  applied: { color: 'green', icon: CheckCircle, label: 'Applied' },
  error: { color: 'red', icon: XCircle, label: 'Error' },
}

export function formatDateTime(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
  } catch (err) {
    console.warn('Invalid date value provided to formatDateTime', value, err)
    return value
  }
}

export function getPayloadSummary(payload) {
  if (!payload) return 'Tidak ada payload'
  const keys = Object.keys(payload || {})
  if (!keys.length) return 'Payload kosong'
  const sample = keys.slice(0, 3).join(', ')
  return keys.length > 3 ? `${sample} +${keys.length - 3}` : sample
}
