import { db } from '../../../offline/db'
import { normalizePhone } from '../../KirimPesan/api/whatsapp'
import { formatCurrencyIDR } from '../../KirimPesan/utils/formatters'
import { getSchoolWebsite, getSchoolName } from '../../../config/appInfo'

/**
 * Generate pesan WhatsApp untuk siswa individual
 * Menggunakan format yang sama dengan halaman /kirim-pesan
 * 
 * @param {Object} siswa - Data siswa
 * @param {string} idRiwayatKelasSiswa - ID riwayat kelas siswa yang aktif
 * @returns {Promise<Object|null>} Data pesan atau null jika tidak bisa digenerate
 */
export async function generateSingleMessage(siswa, idRiwayatKelasSiswa) {
  try {
    // Validasi nomor WhatsApp
    const nomor = siswa.nomor_whatsapp_wali || ''
    if (!nomor) {
      throw new Error('Nomor WhatsApp wali tidak tersedia')
    }

    // Get riwayat kelas siswa
    const rks = await db.riwayat_kelas_siswa.get(idRiwayatKelasSiswa)
    if (!rks) {
      throw new Error('Data riwayat kelas tidak ditemukan')
    }

    // Get kelas
    const kelas = await db.kelas.get(rks.id_kelas)
    if (!kelas) {
      throw new Error('Data kelas tidak ditemukan')
    }

    // Get tahun ajaran
    const tahunAjaran = await db.tahun_ajaran.get(rks.id_tahun_ajaran)
    const taName = tahunAjaran?.nama || '-'

    // Get semua tagihan untuk siswa ini (dari riwayat kelas siswa)
    const tagihanAll = await db.tagihan
      .where('id_riwayat_kelas_siswa')
      .equals(idRiwayatKelasSiswa)
      .toArray()

    // Get rincian tagihan
    const rincianAll = await db.rincian_tagihan.toArray()
    const rincianByTagihan = new Map()
    rincianAll.forEach(r => {
      const arr = rincianByTagihan.get(r.id_tagihan) || []
      arr.push(r)
      rincianByTagihan.set(r.id_tagihan, arr)
    })

    // Get pembayaran
    const pembayaranAll = await db.pembayaran.toArray()
    const pembayaranByTagihan = new Map()
    pembayaranAll.forEach(p => {
      const arr = pembayaranByTagihan.get(p.id_tagihan) || []
      arr.push(p)
      pembayaranByTagihan.set(p.id_tagihan, arr)
    })

    // Get rincian pembayaran
    const rincianBayarAll = await db.rincian_pembayaran.toArray()
    const rincianBayarByPembayaran = new Map()
    rincianBayarAll.forEach(rp => {
      const arr = rincianBayarByPembayaran.get(rp.id_pembayaran) || []
      arr.push(rp)
      rincianBayarByPembayaran.set(rp.id_pembayaran, arr)
    })

    // Hitung total tagihan
    const totalTagihan = tagihanAll.reduce((acc, t) => {
      const rinci = rincianByTagihan.get(t.id) || []
      const sum = rinci.reduce((a, r) => a + Number(r.jumlah || 0), 0)
      return acc + sum
    }, 0)

    // Hitung total pembayaran
    const totalPembayaran = tagihanAll.reduce((acc, t) => {
      const pays = pembayaranByTagihan.get(t.id) || []
      const sumPay = pays.reduce((a, p) => {
        const rinci = rincianBayarByPembayaran.get(p.id) || []
        const sum = rinci.reduce((x, y) => x + Number(y.jumlah_dibayar || 0), 0)
        return a + sum
      }, 0)
      return acc + sumPay
    }, 0)

    // Hitung tunggakan
    const tunggakan = Math.max(0, totalTagihan - totalPembayaran)

    // Build base URL untuk link
    const buildBaseUrl = () => {
      const websiteFromConfig = (getSchoolWebsite?.() || '').trim()
      const envBaseUrl = (import.meta.env.VITE_PUBLIC_BASE_URL || '').trim()
      const raw = websiteFromConfig || envBaseUrl
      if (!raw) {
        return 'https://namadomain.com'
      }

      const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
      return withProtocol.replace(/\/+$/, '')
    }

    const baseUrl = buildBaseUrl()
    const schoolName = (getSchoolName?.() || 'Manajemen Sekolah').trim()
    const link = baseUrl ? `${baseUrl}/nisn/${siswa.nisn}` : ''
    
    // Format nama wali untuk salam pembuka
    const waliName = (siswa.nama_wali_siswa || '').trim()
    const salamPembuka = waliName
      ? `Yth. Wali Murid Ibu/Bapak ${waliName},`
      : 'Yth. Wali Murid,'
    
    const nisnValue = siswa.nisn || '-'
    const kelasLabel = `${kelas.tingkat} - ${kelas.nama_sub_kelas}`

    // Generate isi pesan (format sama dengan /kirim-pesan)
    const pesan = [
      `*${salamPembuka}*`,
      '',
      'Mohon izin menyampaikan informasi tagihan berikut:',
      '',
      `Nama: *${siswa.nama_lengkap}*`,
      `NISN: *${nisnValue}*`,
      `Tahun Ajaran: *${taName}*`,
      `Kelas: *${kelasLabel}*`,
      '',
      'Ringkasan Pembayaran:',
      `• Total Tagihan : *${formatCurrencyIDR(totalTagihan)}*`,
      `• Total Pembayaran : *${formatCurrencyIDR(totalPembayaran)}*`,
      `• Total Tunggakan : *${formatCurrencyIDR(tunggakan)}*`,
      '',
      `Rincian lengkap: ${link || '-'}`,
      '',
      'Terima kasih atas perhatian Ibu/Bapak.',
      'Hormat kami,',
      `*${schoolName}*`
    ].join('\n')

    return {
      nomor_whatsapp: normalizePhone(nomor),
      isi_pesan: pesan,
      status: 'pending',
      tahun_ajaran: taName,
      tingkat_kelas: String(kelas.tingkat),
      kelas_spesifik: `${kelas.tingkat} - ${kelas.nama_sub_kelas}`,
    }
  } catch (error) {
    console.error('Error generating message:', error)
    throw error
  }
}
