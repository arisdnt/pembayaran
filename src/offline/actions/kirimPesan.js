import { db } from '../db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../outbox'

/**
 * Generate dan bulk insert pesan ke database
 * @param {Array} messages Array of message objects
 * @returns {Promise<void>}
 */
export async function bulkInsertKirimPesan(messages) {
  // Clear existing messages first
  const existingMessages = await db.kirim_pesan.toArray()
  for (const msg of existingMessages) {
    await enqueueDelete('kirim_pesan', msg.id)
  }

  // Insert new messages
  for (const message of messages) {
    await enqueueInsert('kirim_pesan', {
      nomor_whatsapp: message.nomor_whatsapp,
      isi_pesan: message.isi_pesan,
      status: message.status || 'pending',
      tahun_ajaran: message.tahun_ajaran,
      tingkat_kelas: message.tingkat_kelas,
      kelas_spesifik: message.kelas_spesifik,
      tanggal_dibuat: new Date().toISOString(),
      tanggal_terkirim: null,
    })
  }
}

/**
 * Delete a single message
 * @param {string} id Message ID
 * @returns {Promise<void>}
 */
export async function deleteKirimPesan(id) {
  await enqueueDelete('kirim_pesan', id)
}

/**
 * Delete message by nomor_whatsapp and isi_pesan (for matching)
 * @param {string} nomor_whatsapp
 * @param {string} isi_pesan
 * @returns {Promise<void>}
 */
export async function deleteKirimPesanByContent(nomor_whatsapp, isi_pesan) {
  const messages = await db.kirim_pesan
    .where('nomor_whatsapp').equals(nomor_whatsapp)
    .toArray()
  
  const match = messages.find(m => m.isi_pesan === isi_pesan)
  if (match) {
    await enqueueDelete('kirim_pesan', match.id)
  }
}

/**
 * Update message status
 * @param {string} id Message ID
 * @param {string} status New status
 * @returns {Promise<void>}
 */
export async function updateKirimPesanStatus(id, status) {
  console.log('[kirimPesan] updateKirimPesanStatus called:', { id, status })
  
  const payload = {
    status,
    tanggal_terkirim: status === 'sent' ? new Date().toISOString() : null,
  }
  
  console.log('[kirimPesan] Payload to update:', payload)
  
  // Verify record exists before update
  const existing = await db.kirim_pesan.get(id)
  if (!existing) {
    console.error('[kirimPesan] ERROR: Message not found in DB:', id)
    return
  }
  
  console.log('[kirimPesan] Existing record before update:', {
    id: existing.id,
    nomor: existing.nomor_whatsapp,
    status_before: existing.status
  })
  
  await enqueueUpdate('kirim_pesan', id, payload)
  
  // Verify update was applied
  const updated = await db.kirim_pesan.get(id)
  console.log('[kirimPesan] Record after enqueueUpdate:', {
    id: updated.id,
    status_after: updated.status,
    tanggal_terkirim: updated.tanggal_terkirim
  })
}

/**
 * Update message status by nomor_whatsapp and isi_pesan (for matching during send)
 * @param {string} nomor_whatsapp
 * @param {string} isi_pesan
 * @param {string} status
 * @returns {Promise<void>}
 */
export async function updateKirimPesanStatusByContent(nomor_whatsapp, isi_pesan, status) {
  console.log('[kirimPesan] Attempting to update status:', { nomor_whatsapp, status })
  
  // Get all messages for this number
  const messages = await db.kirim_pesan
    .where('nomor_whatsapp').equals(nomor_whatsapp)
    .toArray()
  
  console.log('[kirimPesan] Found messages for number:', messages.length)
  if (messages.length === 0) {
    console.warn('[kirimPesan] No messages found for nomor:', nomor_whatsapp)
    console.log('[kirimPesan] Checking all messages in database...')
    const allMessages = await db.kirim_pesan.toArray()
    console.log('[kirimPesan] All messages:', allMessages.map(m => ({
      id: m.id,
      nomor: m.nomor_whatsapp,
      status: m.status,
      preview: m.isi_pesan.substring(0, 50) + '...'
    })))
    return
  }
  
  // Log details of found messages
  messages.forEach((m, idx) => {
    console.log(`[kirimPesan] Message ${idx + 1}:`, {
      id: m.id,
      status: m.status,
      pesan_match: m.isi_pesan === isi_pesan,
      pesan_length_db: m.isi_pesan.length,
      pesan_length_param: isi_pesan.length
    })
  })
  
  // Find message with exact match first (prefer pending/failed)
  let match = messages.find(m => m.isi_pesan === isi_pesan && (m.status === 'pending' || m.status === 'failed'))
  
  if (!match) {
    console.warn('[kirimPesan] No exact match with pending/failed status')
    // Fallback: try to find by isi_pesan only (ignore status filter)
    match = messages.find(m => m.isi_pesan === isi_pesan)
    
    if (match) {
      console.log('[kirimPesan] Found match ignoring status filter:', {
        id: match.id,
        current_status: match.status,
        new_status: status
      })
    }
  }
  
  if (!match) {
    console.warn('[kirimPesan] No match found for isi_pesan')
    console.log('[kirimPesan] Trying first message for this number as fallback...')
    // Ultimate fallback: use the first pending/failed message for this number
    match = messages.find(m => m.status === 'pending' || m.status === 'failed')
    
    if (match) {
      console.log('[kirimPesan] Using first pending/failed message as fallback:', match.id)
    }
  }
  
  if (match) {
    console.log('[kirimPesan] Updating message:', {
      id: match.id,
      from_status: match.status,
      to_status: status
    })
    await updateKirimPesanStatus(match.id, status)
    console.log('[kirimPesan] Status updated successfully')
  } else {
    console.error('[kirimPesan] FAILED to update: No matching message found')
  }
}

/**
 * Get all messages
 * @returns {Promise<Array>}
 */
export async function getAllKirimPesan() {
  return db.kirim_pesan.orderBy('tanggal_dibuat').toArray()
}

/**
 * Get pending messages
 * @returns {Promise<Array>}
 */
export async function getPendingKirimPesan() {
  return db.kirim_pesan.where('status').equals('pending').sortBy('tanggal_dibuat')
}
