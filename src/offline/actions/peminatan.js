import { db } from '../db'

/**
 * Generate kode unik untuk peminatan berdasarkan nama dan tingkat min/max
 * Format: PREFIX-TINGKATMIN-TINGKATMAX atau PREFIX (jika tidak ada tingkat)
 * Contoh: IPA-10-12, IPS-10-12, BHS-10-12, STEM
 */
export async function generateKodePeminatan(nama, tingkatMin = null, tingkatMax = null) {
  // Ambil huruf dari nama untuk membuat prefix
  const cleanNama = nama.replace(/[^A-Za-z\s]/g, '').trim()
  const words = cleanNama.split(/\s+/).filter(w => w.length > 0)
  
  let prefix = ''
  if (words.length === 1) {
    // Jika satu kata, ambil 3-4 huruf pertama
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
    prefix = 'PMIN'
  }
  
  // Bangun kode dasar
  let baseCode = prefix
  
  // Tambahkan tingkat jika ada
  if (tingkatMin !== null || tingkatMax !== null) {
    const tMin = tingkatMin || ''
    const tMax = tingkatMax || ''
    
    if (tMin && tMax) {
      baseCode = `${prefix}-${tMin}-${tMax}`
    } else if (tMin) {
      baseCode = `${prefix}-${tMin}`
    } else if (tMax) {
      baseCode = `${prefix}-${tMax}`
    }
  }
  
  // Cek apakah kode sudah ada
  const existing = await db.peminatan
    .where('kode')
    .equalsIgnoreCase(baseCode)
    .first()
  
  // Jika tidak ada duplikasi, return baseCode
  if (!existing) {
    return baseCode
  }
  
  // Jika ada duplikasi, tambahkan suffix angka
  let suffix = 1
  let newCode = `${baseCode}-${suffix}`
  
  while (true) {
    const check = await db.peminatan
      .where('kode')
      .equalsIgnoreCase(newCode)
      .first()
    
    if (!check) {
      return newCode
    }
    
    suffix++
    newCode = `${baseCode}-${suffix}`
    
    // Safety limit
    if (suffix > 999) {
      throw new Error('Tidak dapat menggenerate kode unik. Terlalu banyak duplikasi.')
    }
  }
}
