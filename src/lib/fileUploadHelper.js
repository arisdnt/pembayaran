/**
 * File Upload Helper with Offline Support
 * 
 * This utility handles file uploads with full offline-first support:
 * - When ONLINE: Upload directly to Supabase Storage
 * - When OFFLINE: Store file locally in IndexedDB, upload later when online
 * 
 * Flow:
 * 1. User uploads file → Store in IndexedDB (file_uploads table)
 * 2. If online → Upload to Supabase immediately
 * 3. If offline → Queue for upload, process when connection restored
 */

import { db } from '../offline/db'
import { supabase } from './supabaseClient'

/**
 * Validate file before upload
 */
export function validateFile(file) {
  const MAX_SIZE = 5 * 1024 * 1024 // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']

  if (!file) {
    return { valid: false, error: 'File tidak ditemukan' }
  }

  if (file.size > MAX_SIZE) {
    return { valid: false, error: 'Ukuran file maksimal 5MB' }
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: 'Format file harus JPG, PNG, WEBP, atau PDF' }
  }

  return { valid: true }
}

/**
 * Generate storage path for file
 * Format: {tahun}/{bulan}/{reference_id}/{timestamp}_{filename}
 */
export function generateStoragePath(referenceTable, referenceId, filename) {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const timestamp = Date.now()
  
  // Sanitize filename
  const sanitized = filename.replace(/[^a-zA-Z0-9._-]/g, '_')
  
  return `${year}/${month}/${referenceId}/${timestamp}_${sanitized}`
}

/**
 * Store file in IndexedDB for offline access
 */
export async function storeFileLocally(file, referenceTable, referenceId) {
  try {
    const fileId = crypto?.randomUUID?.() ? crypto.randomUUID() : `file_${Date.now()}`
    
    // Convert file to ArrayBuffer for storage
    const arrayBuffer = await file.arrayBuffer()
    
    const fileRecord = {
      id: fileId,
      reference_table: referenceTable,
      reference_id: referenceId,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      file_data: arrayBuffer, // Store binary data
      storage_path: null, // Will be set after upload
      public_url: null, // Will be set after upload
      status: 'pending', // pending | uploading | uploaded | error
      error_message: null,
      created_at: new Date().toISOString(),
      uploaded_at: null,
    }

    await db.file_uploads.put(fileRecord)
    
    return {
      success: true,
      fileId,
      localUrl: URL.createObjectURL(file), // For preview
    }
  } catch (error) {
    console.error('[FileUpload] Error storing file locally:', error)
    return {
      success: false,
      error: error.message || 'Gagal menyimpan file'
    }
  }
}

/**
 * Upload file to Supabase Storage
 */
export async function uploadToStorage(file, storagePath) {
  try {
    const { data, error } = await supabase.storage
      .from('bukti-pembayaran')
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) throw error

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('bukti-pembayaran')
      .getPublicUrl(storagePath)

    return {
      success: true,
      path: data.path,
      publicUrl,
    }
  } catch (error) {
    console.error('[FileUpload] Error uploading to storage:', error)
    return {
      success: false,
      error: error.message || 'Gagal mengupload file'
    }
  }
}

/**
 * Main function: Handle file upload with offline support
 */
export async function handleFileUpload(file, referenceTable, referenceId) {
  // 1. Validate file
  const validation = validateFile(file)
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
    }
  }

  // 2. Store file locally first (for offline support)
  const localStore = await storeFileLocally(file, referenceTable, referenceId)
  if (!localStore.success) {
    return localStore
  }

  const { fileId, localUrl } = localStore

  // 3. Try to upload if online
  if (navigator.onLine) {
    const storagePath = generateStoragePath(referenceTable, referenceId, file.name)
    const upload = await uploadToStorage(file, storagePath)

    if (upload.success) {
      // Update local record with upload info
      await db.file_uploads.update(fileId, {
        storage_path: upload.path,
        public_url: upload.publicUrl,
        status: 'uploaded',
        uploaded_at: new Date().toISOString(),
      })

      return {
        success: true,
        fileId,
        publicUrl: upload.publicUrl,
        storagePath: upload.path,
        localUrl, // Keep for immediate preview
      }
    } else {
      // Upload failed, keep as pending for retry
      await db.file_uploads.update(fileId, {
        status: 'error',
        error_message: upload.error,
      })

      return {
        success: false,
        error: upload.error,
        fileId, // Return fileId so it can be retried
        localUrl, // Still provide local preview
      }
    }
  }

  // 4. If offline, return success with local info
  // File will be uploaded when connection is restored
  return {
    success: true,
    fileId,
    publicUrl: null, // Not uploaded yet
    storagePath: null,
    localUrl,
    offline: true, // Indicate it's pending upload
  }
}

/**
 * Get file by ID (from IndexedDB)
 */
export async function getFileById(fileId) {
  try {
    const file = await db.file_uploads.get(fileId)
    return file
  } catch (error) {
    console.error('[FileUpload] Error getting file:', error)
    return null
  }
}

/**
 * Create blob URL from stored file data
 */
export function createBlobUrlFromFile(fileRecord) {
  if (!fileRecord || !fileRecord.file_data) return null
  
  try {
    const blob = new Blob([fileRecord.file_data], { type: fileRecord.file_type })
    return URL.createObjectURL(blob)
  } catch (error) {
    console.error('[FileUpload] Error creating blob URL:', error)
    return null
  }
}

/**
 * Get displayable URL for file (public URL if uploaded, local blob if pending)
 */
export async function getFileUrl(fileId) {
  const fileRecord = await getFileById(fileId)
  if (!fileRecord) return null

  // If uploaded, return public URL
  if (fileRecord.public_url) {
    return fileRecord.public_url
  }

  // If pending, return local blob URL
  return createBlobUrlFromFile(fileRecord)
}

/**
 * Process pending uploads (called by sync engine when online)
 */
export async function processPendingUploads() {
  if (!navigator.onLine) return

  const pending = await db.file_uploads
    .where('status')
    .anyOf(['pending', 'error'])
    .toArray()

  console.log(`[FileUpload] Processing ${pending.length} pending uploads`)

  for (const fileRecord of pending) {
    try {
      // Update status to uploading
      await db.file_uploads.update(fileRecord.id, { status: 'uploading' })

      // Recreate File object from stored data
      const blob = new Blob([fileRecord.file_data], { type: fileRecord.file_type })
      const file = new File([blob], fileRecord.file_name, { type: fileRecord.file_type })

      // Generate storage path
      const storagePath = generateStoragePath(
        fileRecord.reference_table,
        fileRecord.reference_id,
        fileRecord.file_name
      )

      // Upload
      const upload = await uploadToStorage(file, storagePath)

      if (upload.success) {
        await db.file_uploads.update(fileRecord.id, {
          storage_path: upload.path,
          public_url: upload.publicUrl,
          status: 'uploaded',
          uploaded_at: new Date().toISOString(),
          error_message: null,
        })

        console.log(`[FileUpload] Successfully uploaded: ${fileRecord.file_name}`)

        // IMPORTANT: Update rincian_pembayaran with the public URL
        await updateRincianPembayaranUrl(fileRecord.reference_id, upload.publicUrl)
      } else {
        await db.file_uploads.update(fileRecord.id, {
          status: 'error',
          error_message: upload.error,
        })

        console.error(`[FileUpload] Failed to upload: ${fileRecord.file_name}`, upload.error)
      }
    } catch (error) {
      console.error('[FileUpload] Error processing upload:', error)
      await db.file_uploads.update(fileRecord.id, {
        status: 'error',
        error_message: error.message || 'Upload failed',
      })
    }
  }
}

/**
 * Update rincian_pembayaran with bukti URL after successful upload
 */
async function updateRincianPembayaranUrl(nomorTransaksi, publicUrl) {
  try {
    // Import here to avoid circular dependency
    const { enqueueUpdate } = await import('../offline/outbox')
    
    // Find rincian_pembayaran by nomor_transaksi
    const rincian = await db.rincian_pembayaran
      .filter(r => r.nomor_transaksi === nomorTransaksi)
      .first()

    if (rincian) {
      console.log(`[FileUpload] Updating rincian_pembayaran ${rincian.id} with URL: ${publicUrl}`)
      
      // Update local IndexedDB
      await db.rincian_pembayaran.update(rincian.id, {
        bukti_pembayaran_url: publicUrl,
        diperbarui_pada: new Date().toISOString(),
      })

      // Enqueue update to sync to server
      await enqueueUpdate('rincian_pembayaran', rincian.id, {
        bukti_pembayaran_url: publicUrl,
      })

      console.log(`[FileUpload] Successfully updated rincian_pembayaran with bukti URL`)
    } else {
      console.warn(`[FileUpload] Rincian pembayaran not found for nomor_transaksi: ${nomorTransaksi}`)
    }
  } catch (error) {
    console.error('[FileUpload] Error updating rincian_pembayaran URL:', error)
  }
}

/**
 * Delete file (both from storage and IndexedDB)
 */
export async function deleteFile(fileId) {
  try {
    const fileRecord = await getFileById(fileId)
    if (!fileRecord) return { success: false, error: 'File tidak ditemukan' }

    // Delete from storage if uploaded
    if (fileRecord.storage_path && navigator.onLine) {
      const { error } = await supabase.storage
        .from('bukti-pembayaran')
        .remove([fileRecord.storage_path])

      if (error) {
        console.error('[FileUpload] Error deleting from storage:', error)
      }
    }

    // Delete from IndexedDB
    await db.file_uploads.delete(fileId)

    return { success: true }
  } catch (error) {
    console.error('[FileUpload] Error deleting file:', error)
    return {
      success: false,
      error: error.message || 'Gagal menghapus file'
    }
  }
}
