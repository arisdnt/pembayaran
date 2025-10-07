import { db } from '../../../offline/db'

function formatDatePart(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}${month}${day}`
}

function getNisnSuffix(nisn) {
  if (!nisn) return 'XXXX'
  const digitsOnly = String(nisn).replace(/\D/g, '')
  if (!digitsOnly) return 'XXXX'
  return digitsOnly.slice(-4).padStart(4, '0')
}

async function getNextSequence(prefix, table, fieldName) {
  const existing = await table
    .filter((item) => item[fieldName] && item[fieldName].startsWith(prefix))
    .toArray()

  const currentMax = existing.reduce((max, item) => {
    const parts = item[fieldName].split('-')
    const candidate = parts[parts.length - 1]
    const numeric = parseInt(candidate, 10)
    if (Number.isNaN(numeric)) return max
    return Math.max(max, numeric)
  }, 0)

  return currentMax + 1
}

export async function generateNomorPembayaran({ siswa, timestamp = new Date(), sequenceOffset = 0 }) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  const datePart = formatDatePart(date)
  const nisnPart = getNisnSuffix(siswa?.nisn)
  const prefix = `PAY-${datePart}-${nisnPart}`

  const baseSequence = await getNextSequence(prefix, db.pembayaran, 'nomor_pembayaran')
  const sequence = baseSequence + sequenceOffset
  const formattedSequence = String(sequence).padStart(3, '0')

  return `${prefix}-${formattedSequence}`
}

export async function generateNomorTransaksi({ siswa, pembayaran, timestamp = new Date(), sequenceOffset = 0 }) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp)
  const datePart = formatDatePart(date)
  const nisnPart = getNisnSuffix(siswa?.nisn)
  const paymentSegment = pembayaran ? pembayaran.split('-').slice(-1)[0] : '000'
  const prefix = `TRX-${datePart}-${nisnPart}-${paymentSegment}`

  const baseSequence = await getNextSequence(prefix, db.rincian_pembayaran, 'nomor_transaksi')
  const sequence = baseSequence + sequenceOffset
  const formattedSequence = String(sequence).padStart(3, '0')

  return `${prefix}-${formattedSequence}`
}
