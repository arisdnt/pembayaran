import Dexie from 'dexie'

// Centralized Dexie database definition
export class ArtapayDB extends Dexie {
  constructor() {
    super('ArtapayDB')

    // Table schemas: keep indexes minimal and pragmatic
    this.version(2).stores({
      // Master data
      wali_kelas: 'id, diperbarui_pada, nama_lengkap, status_aktif',
      kelas: 'id, diperbarui_pada, tingkat, nama_sub_kelas',
      siswa: 'id, diperbarui_pada, nisn, nama_lengkap, status_aktif',
      tahun_ajaran: 'id, diperbarui_pada, nama, tanggal_mulai',
      peminatan: 'id, kode, aktif',
      peminatan_siswa: 'id, id_siswa, id_peminatan, id_tahun_ajaran, tanggal_mulai',

      // Relational/history
      riwayat_kelas_siswa: 'id, diperbarui_pada, id_siswa, id_kelas, id_tahun_ajaran, status, tanggal_masuk',
      riwayat_wali_kelas: 'id, diperbarui_pada, id_wali_kelas, id_kelas, id_tahun_ajaran, status, tanggal_mulai',

      // Billing/payment
      jenis_pembayaran: 'id, diperbarui_pada, kode, status_aktif, tingkat',
      tagihan: 'id, tanggal_diperbarui, id_riwayat_kelas_siswa, tanggal_tagihan, tanggal_jatuh_tempo',
      rincian_tagihan: 'id, id_tagihan, id_jenis_pembayaran, urutan',
      pembayaran: 'id, diperbarui_pada, id_tagihan, nomor_pembayaran',
      rincian_pembayaran: 'id, diperbarui_pada, id_pembayaran, nomor_transaksi, cicilan_ke',

      // Sync housekeeping
      sync_state: 'table', // { table, last_full_load, last_incremental_at }
      outbox: 'id, table, pk, status, updated_at, created_at', // custom id is fine (uuid)
    })

    // Version 3: Add optimized indexes for better query performance
    this.version(3).stores({
      // Master data
      wali_kelas: 'id, diperbarui_pada, nama_lengkap, status_aktif',
      kelas: 'id, diperbarui_pada, tingkat, nama_sub_kelas',
      siswa: 'id, diperbarui_pada, nisn, nama_lengkap, status_aktif',
      tahun_ajaran: 'id, diperbarui_pada, nama, tanggal_mulai, status_aktif',
      peminatan: 'id, kode, aktif',
      peminatan_siswa: 'id, id_siswa, id_peminatan, id_tahun_ajaran, tanggal_mulai',

      // Relational/history - OPTIMIZED with better indexes
      riwayat_kelas_siswa: 'id, diperbarui_pada, id_siswa, id_kelas, id_tahun_ajaran, status, tanggal_masuk',
      riwayat_wali_kelas: 'id, diperbarui_pada, id_wali_kelas, id_kelas, id_tahun_ajaran, status, tanggal_mulai',

      // Billing/payment - OPTIMIZED with better indexes
      jenis_pembayaran: 'id, diperbarui_pada, kode, status_aktif, tingkat',
      tagihan: 'id, tanggal_diperbarui, id_riwayat_kelas_siswa, tanggal_tagihan, tanggal_jatuh_tempo',
      rincian_tagihan: 'id, id_tagihan, id_jenis_pembayaran, urutan',
      pembayaran: 'id, diperbarui_pada, id_tagihan, nomor_pembayaran',
      rincian_pembayaran: 'id, diperbarui_pada, id_pembayaran, nomor_transaksi, cicilan_ke, status',

      // Sync housekeeping
      sync_state: 'table',
      outbox: 'id, table, pk, status, updated_at, created_at',
    }).upgrade(tx => {
      console.log('[DB] Upgrading to v3 with optimized indexes for better performance')
    })

    // Version 4: Add kirim_pesan table
    this.version(4).stores({
      // Master data
      wali_kelas: 'id, diperbarui_pada, nama_lengkap, status_aktif',
      kelas: 'id, diperbarui_pada, tingkat, nama_sub_kelas',
      siswa: 'id, diperbarui_pada, nisn, nama_lengkap, status_aktif',
      tahun_ajaran: 'id, diperbarui_pada, nama, tanggal_mulai, status_aktif',
      peminatan: 'id, kode, aktif',
      peminatan_siswa: 'id, id_siswa, id_peminatan, id_tahun_ajaran, tanggal_mulai',

      // Relational/history
      riwayat_kelas_siswa: 'id, diperbarui_pada, id_siswa, id_kelas, id_tahun_ajaran, status, tanggal_masuk',
      riwayat_wali_kelas: 'id, diperbarui_pada, id_wali_kelas, id_kelas, id_tahun_ajaran, status, tanggal_mulai',

      // Billing/payment
      jenis_pembayaran: 'id, diperbarui_pada, kode, status_aktif, tingkat',
      tagihan: 'id, tanggal_diperbarui, id_riwayat_kelas_siswa, tanggal_tagihan, tanggal_jatuh_tempo',
      rincian_tagihan: 'id, id_tagihan, id_jenis_pembayaran, urutan',
      pembayaran: 'id, diperbarui_pada, id_tagihan, nomor_pembayaran',
      rincian_pembayaran: 'id, diperbarui_pada, id_pembayaran, nomor_transaksi, cicilan_ke, status',

      // WhatsApp messaging
      kirim_pesan: 'id, tanggal_dibuat, nomor_whatsapp, status, tanggal_terkirim',

      // Sync housekeeping
      sync_state: 'table',
      outbox: 'id, table, pk, status, updated_at, created_at',
    }).upgrade(tx => {
      console.log('[DB] Upgrading to v4 with kirim_pesan table')
    })
  }
}

export const db = new ArtapayDB()

// Registry of tables and how they sync
export const syncRegistry = {
  // table: { primaryKey, updatedAtColumn, fullLoadOnly }
  wali_kelas: { pk: 'id', updatedAt: 'diperbarui_pada' },
  kelas: { pk: 'id', updatedAt: 'diperbarui_pada' },
  siswa: { pk: 'id', updatedAt: 'diperbarui_pada' },
  tahun_ajaran: { pk: 'id', updatedAt: 'diperbarui_pada' },
  riwayat_kelas_siswa: { pk: 'id', updatedAt: 'diperbarui_pada' },
  riwayat_wali_kelas: { pk: 'id', updatedAt: 'diperbarui_pada' },
  jenis_pembayaran: { pk: 'id', updatedAt: 'diperbarui_pada' },
  tagihan: { pk: 'id', updatedAt: 'tanggal_diperbarui' },
  pembayaran: { pk: 'id', updatedAt: 'diperbarui_pada' },
  rincian_pembayaran: { pk: 'id', updatedAt: 'diperbarui_pada' },
  kirim_pesan: { pk: 'id', updatedAt: 'tanggal_dibuat' },

  // Tables without explicit updated timestamp: do full-load + realtime
  rincian_tagihan: { pk: 'id', fullLoadOnly: true },
  peminatan: { pk: 'id', fullLoadOnly: true },
  peminatan_siswa: { pk: 'id', fullLoadOnly: true },
}

export function getUpdatedAtColumn(table) {
  const def = syncRegistry[table]
  return def?.updatedAt || null
}

export function isFullLoadOnly(table) {
  const def = syncRegistry[table]
  return !!def?.fullLoadOnly
}

