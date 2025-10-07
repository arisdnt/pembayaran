import { db } from '../db'

/**
 * Generate kode unik untuk jenis pembayaran berdasarkan nama dan tanggal
 * Format: PREFIX-YYYYMMDD-XXX
 * Contoh: SPP-20240115-001, USAR-20240115-002
 */
export async function generateKodeJenisPembayaran(nama) {
  // Ambil 3-4 huruf pertama dari nama (hanya huruf)
  const cleanNama = nama.replace(/[^A-Za-z\s]/g, '').trim()
  const words = cleanNama.split(/\s+/).filter(w => w.length > 0)
  
  let prefix = ''
  if (words.length === 1) {
    // Jika satu kata, ambil 4 huruf pertama
    prefix = words[0].substring(0, 4).toUpperCase()
  } else {
    // Jika lebih dari satu kata, ambil huruf pertama dari setiap kata (max 4)
    prefix = words.slice(0, 4).map(w => w[0]).join('').toUpperCase()
  }
  
  // Jika prefix kurang dari 3 karakter, pad dengan huruf dari kata pertama
  if (prefix.length < 3 && words.length > 0) {
    const firstWord = words[0].toUpperCase()
    prefix = (prefix + firstWord).substring(0, 4)
  }
  
  // Default jika tidak ada huruf yang bisa diambil
  if (prefix.length === 0) {
    prefix = 'ITEM'
  }
  
  // Format tanggal YYYYMMDD
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const dateStr = `${year}${month}${day}`
  
  // Cari sequence number yang belum dipakai
  const prefixPattern = `${prefix}-${dateStr}`
  
  // Get all jenis_pembayaran dengan prefix yang sama
  const allJenis = await db.jenis_pembayaran.toArray()
  const existingCodes = allJenis
    .filter(j => j.kode && j.kode.startsWith(prefixPattern))
    .map(j => j.kode)
  
  // Find the highest sequence number
  let maxSeq = 0
  existingCodes.forEach(code => {
    const parts = code.split('-')
    if (parts.length === 3) {
      const seq = parseInt(parts[2], 10)
      if (!isNaN(seq) && seq > maxSeq) {
        maxSeq = seq
      }
    }
  })
  
  // Generate next sequence
  const nextSeq = maxSeq + 1
  const seqStr = String(nextSeq).padStart(3, '0')
  
  return `${prefix}-${dateStr}-${seqStr}`
}
