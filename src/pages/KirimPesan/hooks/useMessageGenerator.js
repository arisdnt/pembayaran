import { useState } from 'react'
import { db } from '../../../offline/db'
import { normalizePhone } from '../../../services/whatsappApi'
import { formatCurrencyIDR } from '../utils/formatters'

export function useMessageGenerator(
  selectedTA,
  selectedTingkat,
  selectedKelas,
  tahunAjaranList,
  kelasList,
  filteredKelas
) {
  const [loading, setLoading] = useState(false)

  const generatePreview = async () => {
    if (!selectedTA) return []
    setLoading(true)
    try {
      let rks = await db.riwayat_kelas_siswa.where('id_tahun_ajaran').equals(selectedTA).toArray()
      console.log('Total RKS ditemukan:', rks.length)
      
      if (selectedTingkat && selectedTingkat !== '_all') {
        const kelasIds = new Set(filteredKelas.map(k => k.id))
        rks = rks.filter(x => kelasIds.has(x.id_kelas))
        console.log('Setelah filter tingkat:', rks.length)
      }
      if (selectedKelas && selectedKelas !== '_all') {
        rks = rks.filter(x => x.id_kelas === selectedKelas)
        console.log('Setelah filter kelas:', rks.length)
      }

      const siswaMap = new Map()
      ;(await db.siswa.toArray()).forEach(s => siswaMap.set(s.id, s))
      const kelasMap = new Map()
      kelasList.forEach(k => kelasMap.set(k.id, k))
      
      const tagihanAll = await db.tagihan.toArray()
      const tagihanByRks = new Map()
      tagihanAll.forEach(t => {
        const arr = tagihanByRks.get(t.id_riwayat_kelas_siswa) || []
        arr.push(t)
        tagihanByRks.set(t.id_riwayat_kelas_siswa, arr)
      })
      
      const rincianAll = await db.rincian_tagihan.toArray()
      const rincianByTagihan = new Map()
      rincianAll.forEach(r => {
        const arr = rincianByTagihan.get(r.id_tagihan) || []
        arr.push(r)
        rincianByTagihan.set(r.id_tagihan, arr)
      })
      
      const pembayaranAll = await db.pembayaran.toArray()
      const pembayaranByTagihan = new Map()
      pembayaranAll.forEach(p => {
        const arr = pembayaranByTagihan.get(p.id_tagihan) || []
        arr.push(p)
        pembayaranByTagihan.set(p.id_tagihan, arr)
      })
      
      const rincianBayarAll = await db.rincian_pembayaran.toArray()
      const rincianBayarByPembayaran = new Map()
      rincianBayarAll.forEach(rp => {
        const arr = rincianBayarByPembayaran.get(rp.id_pembayaran) || []
        arr.push(rp)
        rincianBayarByPembayaran.set(rp.id_pembayaran, arr)
      })

      const baseUrl = import.meta.env.VITE_PUBLIC_BASE_URL || 'http://namadomain'
      const taName = (tahunAjaranList.find(x => x.id === selectedTA)?.nama) || ''

      const rows = []
      let skippedNoSiswa = 0
      let skippedNoKelas = 0
      let skippedNoWhatsApp = 0
      
      for (const rec of rks) {
        const s = siswaMap.get(rec.id_siswa)
        const k = kelasMap.get(rec.id_kelas)
        if (!s) {
          skippedNoSiswa++
          continue
        }
        if (!k) {
          skippedNoKelas++
          continue
        }
        const nomor = s.nomor_whatsapp_wali || ''
        if (!nomor) {
          skippedNoWhatsApp++
          continue
        }

        const tgs = tagihanByRks.get(rec.id) || []
        const totalTagihan = tgs.reduce((acc, t) => {
          const rinci = rincianByTagihan.get(t.id) || []
          const sum = rinci.reduce((a, r) => a + Number(r.jumlah || 0), 0)
          return acc + sum
        }, 0)
        
        const totalPembayaran = tgs.reduce((acc, t) => {
          const pays = pembayaranByTagihan.get(t.id) || []
          const sumPay = pays.reduce((a, p) => {
            const rinci = rincianBayarByPembayaran.get(p.id) || []
            const sum = rinci.reduce((x, y) => x + Number(y.jumlah_dibayar || 0), 0)
            return a + sum
          }, 0)
          return acc + sumPay
        }, 0)
        const tunggakan = Math.max(0, totalTagihan - totalPembayaran)

        const link = `${baseUrl}/nisn/${s.nisn}`
        const pesan = [
          `Yth. ${s.nama_wali_siswa || 'Wali Murid'},`,
          `Informasi Tagihan Siswa:`,
          `Nama: ${s.nama_lengkap}`,
          `NISN: ${s.nisn}`,
          `Tahun Ajaran: ${taName}`,
          `Kelas: ${k.tingkat} - ${k.nama_sub_kelas}`,
          `Total Tagihan: ${formatCurrencyIDR(totalTagihan)}`,
          `Total Pembayaran: ${formatCurrencyIDR(totalPembayaran)}`,
          `Total Tunggakan: ${formatCurrencyIDR(tunggakan)}`,
          `Rincian lengkap: ${link}`,
          '',
          'Terima kasih.'
        ].join('\n')

        rows.push({
          nomor_whatsapp: normalizePhone(nomor),
          isi_pesan: pesan,
          status: 'pending',
          tahun_ajaran: taName,
          tingkat_kelas: String(k.tingkat),
          kelas_spesifik: `${k.tingkat} - ${k.nama_sub_kelas}`,
        })
      }
      
      console.log('Generate preview selesai:')
      console.log('- Total rows berhasil:', rows.length)
      console.log('- Skipped (siswa tidak ditemukan):', skippedNoSiswa)
      console.log('- Skipped (kelas tidak ditemukan):', skippedNoKelas)
      console.log('- Skipped (nomor WA kosong):', skippedNoWhatsApp)
      
      return rows
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    generatePreview
  }
}
