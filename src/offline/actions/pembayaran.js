import { db } from '../db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../outbox'

export async function createPembayaranWithRincian(header, rincianItems) {
  const pembayaranRow = await enqueueInsert('pembayaran', header)
  const idPembayaran = pembayaranRow.id
  let index = 1
  for (const item of rincianItems) {
    await enqueueInsert('rincian_pembayaran', {
      id_pembayaran: idPembayaran,
      nomor_transaksi: item.nomor_transaksi,
      jumlah_dibayar: item.jumlah_dibayar,
      tanggal_bayar: item.tanggal_bayar,
      metode_pembayaran: item.metode_pembayaran,
      referensi_pembayaran: item.referensi_pembayaran || null,
      bukti_pembayaran_url: item.bukti_pembayaran_url || null,
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
    await enqueueInsert('rincian_pembayaran', {
      id_pembayaran: id,
      nomor_transaksi: item.nomor_transaksi,
      jumlah_dibayar: item.jumlah_dibayar,
      tanggal_bayar: item.tanggal_bayar,
      metode_pembayaran: item.metode_pembayaran,
      referensi_pembayaran: item.referensi_pembayaran || null,
      bukti_pembayaran_url: item.bukti_pembayaran_url || null,
      catatan: item.catatan || null,
      cicilan_ke: item.cicilan_ke || index,
    })
    index++
  }
}

