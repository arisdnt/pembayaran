import { db } from '../db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../outbox'
import { handleFileUpload, getFileById } from '../../lib/fileUploadHelper'

export async function createPembayaranWithRincian(header, rincianItems) {
  const pembayaranRow = await enqueueInsert('pembayaran', header)
  const idPembayaran = pembayaranRow.id
  let index = 1
  for (const item of rincianItems) {
    // Handle file upload if bukti_file is provided
    let buktiUrl = item.bukti_pembayaran_url || null
    let fileId = item.file_id || null
    
    if (item.bukti_file) {
      console.log('[Pembayaran] File detected, uploading:', item.bukti_file.name, 'for', item.nomor_transaksi)
      
      const uploadResult = await handleFileUpload(
        item.bukti_file,
        'rincian_pembayaran',
        item.nomor_transaksi // Use nomor_transaksi as reference since we don't have ID yet
      )
      
      if (uploadResult.success) {
        fileId = uploadResult.fileId
        buktiUrl = uploadResult.publicUrl || null // Will be null if offline
        
        if (uploadResult.offline) {
          console.log('[Pembayaran] File stored offline, will upload when online. FileID:', fileId)
        } else {
          console.log('[Pembayaran] File uploaded successfully. URL:', buktiUrl)
        }
      } else {
        console.error('[Pembayaran] File upload failed:', uploadResult.error)
      }
    } else {
      console.log('[Pembayaran] No file provided for', item.nomor_transaksi)
    }
    
    await enqueueInsert('rincian_pembayaran', {
      id_pembayaran: idPembayaran,
      nomor_transaksi: item.nomor_transaksi,
      jumlah_dibayar: item.jumlah_dibayar,
      tanggal_bayar: item.tanggal_bayar,
      metode_pembayaran: item.metode_pembayaran,
      referensi_pembayaran: item.referensi_pembayaran || null,
      bukti_pembayaran_url: buktiUrl,
      catatan: item.catatan || null,
      cicilan_ke: item.cicilan_ke || index,
    })
    index++
  }
  return idPembayaran
}

export async function updatePembayaranWithRincian(id, headerPatch, rincianItems) {
  await enqueueUpdate('pembayaran', id, headerPatch)
  const existing = await db.rincian_pembayaran.where('id_pembayaran').equals(id).toArray()
  for (const row of existing) {
    await enqueueDelete('rincian_pembayaran', row.id)
  }
  let index = 1
  for (const item of rincianItems) {
    // Handle file upload if bukti_file is provided
    let buktiUrl = item.bukti_pembayaran_url || null
    let fileId = item.file_id || null
    
    if (item.bukti_file) {
      console.log('[Pembayaran] File detected for update, uploading:', item.bukti_file.name, 'for', item.nomor_transaksi)
      
      const uploadResult = await handleFileUpload(
        item.bukti_file,
        'rincian_pembayaran',
        item.nomor_transaksi
      )
      
      if (uploadResult.success) {
        fileId = uploadResult.fileId
        buktiUrl = uploadResult.publicUrl || null
        
        if (uploadResult.offline) {
          console.log('[Pembayaran] File stored offline (update), will upload when online. FileID:', fileId)
        } else {
          console.log('[Pembayaran] File uploaded successfully (update). URL:', buktiUrl)
        }
      } else {
        console.error('[Pembayaran] File upload failed (update):', uploadResult.error)
      }
    }
    
    await enqueueInsert('rincian_pembayaran', {
      id_pembayaran: id,
      nomor_transaksi: item.nomor_transaksi,
      jumlah_dibayar: item.jumlah_dibayar,
      tanggal_bayar: item.tanggal_bayar,
      metode_pembayaran: item.metode_pembayaran,
      referensi_pembayaran: item.referensi_pembayaran || null,
      bukti_pembayaran_url: buktiUrl,
      catatan: item.catatan || null,
      cicilan_ke: item.cicilan_ke || index,
    })
    index++
  }
}

