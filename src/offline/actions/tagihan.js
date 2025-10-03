import { db } from '../db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../outbox'

// Create tagihan header + rincian in one flow
export async function createTagihanWithRincian(header, rincianItems) {
  const headerRow = await enqueueInsert('tagihan', header)
  const idTagihan = headerRow.id
  for (const item of rincianItems) {
    await enqueueInsert('rincian_tagihan', {
      id_tagihan: idTagihan,
      id_jenis_pembayaran: item.id_jenis_pembayaran,
      deskripsi: item.deskripsi || null,
      jumlah: item.jumlah,
      urutan: item.urutan || 1,
    })
  }
  return idTagihan
}

// Update tagihan header + replace rincian set (delete all then insert fresh)
export async function updateTagihanWithRincian(id, headerPatch, rincianItems) {
  await enqueueUpdate('tagihan', id, headerPatch)
  const existing = await db.rincian_tagihan.where('id_tagihan').equals(id).toArray()
  for (const row of existing) {
    await enqueueDelete('rincian_tagihan', row.id)
  }
  for (const item of rincianItems) {
    await enqueueInsert('rincian_tagihan', {
      id_tagihan: id,
      id_jenis_pembayaran: item.id_jenis_pembayaran,
      deskripsi: item.deskripsi || null,
      jumlah: item.jumlah,
      urutan: item.urutan || 1,
    })
  }
}

