export function validatePembayaranForm(formData, rincianItems) {
  const errors = {}

  if (!formData.nomor_pembayaran || !formData.nomor_pembayaran.trim()) {
    errors.nomor_pembayaran = 'Nomor pembayaran wajib diisi'
  }

  if (rincianItems.length === 0) {
    errors.rincian = 'Minimal harus ada 1 transaksi pembayaran'
  }

  for (let i = 0; i < rincianItems.length; i += 1) {
    const item = rincianItems[i]
    if (!item.nomor_transaksi || !item.nomor_transaksi.trim()) {
      errors.rincian = `Transaksi #${i + 1}: Nomor transaksi wajib diisi`
      break
    }
    if (!item.jumlah_dibayar || Number(item.jumlah_dibayar) <= 0) {
      errors.rincian = `Transaksi #${i + 1}: Jumlah dibayar harus lebih dari 0`
      break
    }
    if (!item.tanggal_bayar) {
      errors.rincian = `Transaksi #${i + 1}: Tanggal bayar wajib dipilih`
      break
    }
    if (!item.metode_pembayaran) {
      errors.rincian = `Transaksi #${i + 1}: Metode pembayaran wajib dipilih`
      break
    }
  }

  return errors
}

export function preparePayloadItems(rincianItems) {
  return rincianItems.map((item, idx) => ({
    nomor_transaksi: item.nomor_transaksi.trim(),
    jumlah_dibayar: Number(item.jumlah_dibayar),
    tanggal_bayar: item.tanggal_bayar,
    metode_pembayaran: item.metode_pembayaran || 'transfer',
    referensi_pembayaran: item.referensi_pembayaran
      ? item.referensi_pembayaran.trim()
      : null,
    catatan: item.catatan ? item.catatan.trim() : null,
    cicilan_ke: item.cicilan_ke || idx + 1,
  }))
}
