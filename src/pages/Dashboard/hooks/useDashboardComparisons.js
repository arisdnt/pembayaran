import { useEffect, useState } from 'react'
import { db } from '../../../offline/db'

function monthKey(d) {
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
}

function addMonths(key, delta) {
  const [y, m] = key.split('-').map(Number)
  const d = new Date(y, m - 1 + delta, 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
}

export function useDashboardComparisons(filters) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState({ siswaTrend: [], siswaTrendCompare: [], bayarTrend: [], bayarTrendCompare: [] })

  useEffect(() => {
    let disposed = false
    async function run() {
      setLoading(true)
      const [kelas, rksAll, tagihan, rp, pembayaran] = await Promise.all([
        db.kelas.toArray(),
        db.riwayat_kelas_siswa.toArray(),
        db.tagihan.toArray(),
        db.rincian_pembayaran.toArray(),
        db.pembayaran.toArray(),
      ])

      const tahunId = filters?.tahunAjaran || null
      const tingkat = filters?.tingkat || null
      const kelasId = filters?.kelas || null

      // Scope without time filter for comparison (yoy)
      let rksScope = tahunId ? rksAll.filter(r => r.id_tahun_ajaran === tahunId) : rksAll.filter(r => (r.status||'').toLowerCase()==='aktif')
      if (tingkat) {
        const ks = new Set(kelas.filter(k => k.tingkat === tingkat).map(k => k.id))
        rksScope = rksScope.filter(r => ks.has(r.id_kelas))
      }
      if (kelasId) rksScope = rksScope.filter(r => r.id_kelas === kelasId)

      // Siswa trend current (last 12 months) and previous year for same months
      const now = new Date()
      const months = Array.from({ length: 12 }, (_, i) => {
        const d = new Date(now.getFullYear(), now.getMonth() - (11 - i), 1)
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
      })
      const siswaCount = new Map()
      rksScope.forEach(r => { if (!r.tanggal_masuk) return; const k = monthKey(r.tanggal_masuk); siswaCount.set(k, (siswaCount.get(k)||0)+1) })
      const siswaTrend = months.map(k => ({ key: k, value: siswaCount.get(k)||0 }))
      const siswaTrendCompare = months.map(k => ({ key: k, value: siswaCount.get(addMonths(k, -12))||0 }))

      // Pembayaran trend current and YOY
      const rpByPembayaran = new Map()
      rp.forEach(x => { const arr = rpByPembayaran.get(x.id_pembayaran)||[]; arr.push(x); rpByPembayaran.set(x.id_pembayaran, arr) })
      const rksIds = new Set(rksScope.map(r => r.id))
      const tagMap = new Map(tagihan.map(t=>[t.id,t]))
      const payMap = new Map()
      pembayaran.forEach(p => {
        const t = tagMap.get(p.id_tagihan); if (!t) return
        if (!rksIds.has(t.id_riwayat_kelas_siswa)) return
        const total = (rpByPembayaran.get(p.id)||[]).reduce((s,it)=>s+Number(it.jumlah_dibayar||0),0)
        const k = monthKey(p.dibuat_pada || p.diperbarui_pada || new Date())
        payMap.set(k, (payMap.get(k)||0) + total)
      })
      const bayarTrend = months.map(k => ({ key: k, value: payMap.get(k)||0 }))
      const bayarTrendCompare = months.map(k => ({ key: k, value: payMap.get(addMonths(k, -12))||0 }))

      if (!disposed) setData({ siswaTrend, siswaTrendCompare, bayarTrend, bayarTrendCompare })
      if (!disposed) setLoading(false)
    }
    run()
    return () => { disposed = true }
  }, [filters])

  return { loading, data }
}

