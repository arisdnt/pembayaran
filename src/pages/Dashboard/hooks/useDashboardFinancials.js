import { useEffect, useState } from 'react'
import { db } from '../../../offline/db'

function monthKey(d) {
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
}

export function useDashboardFinancials(filters) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ tagihanTrend: [], payByTingkat: [], topKelasTunggakan: [], tunggakanByGender: [] })

  useEffect(() => {
    let disposed = false
    async function run() {
      setLoading(true)
      const [kelas, rksAll, tahun, tagihan, rincian, pembayaran, rp, siswa] = await Promise.all([
        db.kelas.toArray(), db.riwayat_kelas_siswa.toArray(), db.tahun_ajaran.toArray(),
        db.tagihan.toArray(), db.rincian_tagihan.toArray(), db.pembayaran.toArray(), db.rincian_pembayaran.toArray(), db.siswa.toArray()
      ])

      const tahunId = filters?.tahunAjaran || null
      const tingkat = filters?.tingkat || null
      const kelasId = filters?.kelas || null

      let rksScope = tahunId ? rksAll.filter(r => r.id_tahun_ajaran === tahunId) : rksAll.filter(r => (r.status||'').toLowerCase()==='aktif')
      if (tingkat) {
        const ks = new Set(kelas.filter(k => k.tingkat === tingkat).map(k => k.id))
        rksScope = rksScope.filter(r => ks.has(r.id_kelas))
      }
      if (kelasId) rksScope = rksScope.filter(r => r.id_kelas === kelasId)
      const rksIds = new Set(rksScope.map(r => r.id))
      const kelasMap = new Map(kelas.map(k => [k.id, k]))
      const siswaMap = new Map(siswa.map(s => [s.id, s]))

      // Tagihan trend (sum rincian per bulan berdasarkan tanggal_tagihan)
      const rincianByTagihan = new Map()
      rincian.forEach(rt => { const arr = rincianByTagihan.get(rt.id_tagihan)||[]; arr.push(rt); rincianByTagihan.set(rt.id_tagihan, arr) })
      const tagihanMap = new Map(tagihan.map(t => [t.id, t]))
      const tt = new Map()
      tagihan.forEach(t => {
        if (!rksIds.has(t.id_riwayat_kelas_siswa)) return
        const total = (rincianByTagihan.get(t.id)||[]).reduce((s, it) => s + Number(it.jumlah||0), 0)
        const k = monthKey(t.tanggal_tagihan || new Date())
        tt.set(k, (tt.get(k)||0) + total)
      })
      const months = Array.from(new Set(Array.from(tt.keys()))).sort()
      const tagihanTrend = months.map(k => ({ key: k, value: tt.get(k)||0 }))

      // Pembayaran per tingkat
      const rpByPembayaran = new Map()
      rp.forEach(x => { const arr = rpByPembayaran.get(x.id_pembayaran)||[]; arr.push(x); rpByPembayaran.set(x.id_pembayaran, arr) })
      const payByTingkatMap = new Map()
      pembayaran.forEach(p => {
        const t = tagihanMap.get(p.id_tagihan); if (!t) return
        if (!rksIds.has(t.id_riwayat_kelas_siswa)) return
        const r = rksScope.find(x => x.id === t.id_riwayat_kelas_siswa); if (!r) return
        const kRow = kelasMap.get(r.id_kelas); if (!kRow) return
        const total = (rpByPembayaran.get(p.id)||[]).reduce((s,it)=>s+Number(it.jumlah_dibayar||0),0)
        payByTingkatMap.set(kRow.tingkat, (payByTingkatMap.get(kRow.tingkat)||0)+total)
      })
      const payByTingkat = Array.from(payByTingkatMap, ([name, value]) => ({ name, value })).sort((a,b)=>b.value-a.value)

      // Top kelas berdasarkan tunggakan (total tagihan - total dibayar)
      const tagihanByRks = new Map()
      tagihan.forEach(t => { if (!rksIds.has(t.id_riwayat_kelas_siswa)) return; const arr = tagihanByRks.get(t.id_riwayat_kelas_siswa)||[]; arr.push(t); tagihanByRks.set(t.id_riwayat_kelas_siswa, arr) })
      const rincianByTag = rincianByTagihan
      const bayarByTag = new Map()
      pembayaran.forEach(p => {
        const sum = (rpByPembayaran.get(p.id)||[]).reduce((s,it)=>s+Number(it.jumlah_dibayar||0),0)
        bayarByTag.set(p.id_tagihan, (bayarByTag.get(p.id_tagihan)||0) + sum)
      })
      const accKelas = new Map()
      rksScope.forEach(r => {
        const list = tagihanByRks.get(r.id) || []
        let totalTag = 0, totalPay = 0
        for (const t of list) {
          totalTag += (rincianByTag.get(t.id)||[]).reduce((s,it)=>s+Number(it.jumlah||0),0)
          totalPay += bayarByTag.get(t.id)||0
        }
        const tunggak = Math.max(totalTag - totalPay, 0)
        if (tunggak > 0) {
          const k = kelasMap.get(r.id_kelas)
          const name = k ? `${k.tingkat} ${k.nama_sub_kelas}` : 'Kelas'
          accKelas.set(name, (accKelas.get(name)||0) + tunggak)
        }
      })
      const topKelasTunggakan = Array.from(accKelas, ([name, value]) => ({ name, value }))
        .sort((a,b)=>b.value-a.value).slice(0, 10)

      // Tunggakan by gender (Laki-laki vs Perempuan)
      let male = 0, female = 0
      rksScope.forEach(r => {
        const list = tagihanByRks.get(r.id) || []
        let totalTag = 0, totalPay = 0
        for (const t of list) {
          totalTag += (rincianByTag.get(t.id)||[]).reduce((s,it)=>s+Number(it.jumlah||0),0)
          totalPay += bayarByTag.get(t.id)||0
        }
        const tunggak = Math.max(totalTag - totalPay, 0)
        if (tunggak > 0) {
          const s = siswaMap.get(r.id_siswa)
          const g = (s?.jenis_kelamin || '').toLowerCase()
          if (g.startsWith('l')) male += tunggak
          else if (g.startsWith('p')) female += tunggak
        }
      })
      const tunggakanByGender = [
        { name: 'Laki-laki', value: male },
        { name: 'Perempuan', value: female }
      ]

      if (!disposed) setData({ tagihanTrend, payByTingkat, topKelasTunggakan, tunggakanByGender })
      if (!disposed) setLoading(false)
    }
    run()
    return () => { disposed = true }
  }, [filters])

  return { loading, data }
}
