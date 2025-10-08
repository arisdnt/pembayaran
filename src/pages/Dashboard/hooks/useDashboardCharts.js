import { useEffect, useMemo, useState } from 'react'
import { db } from '../../../offline/db'

function monthKey(d) {
  const dt = new Date(d)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`
}

export function useDashboardCharts(filters) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)

  useEffect(() => {
    let cancelled = false
    async function run() {
      setLoading(true)
      const tahun = await db.tahun_ajaran.toArray()
      const kelas = await db.kelas.toArray()
      const siswa = await db.siswa.toArray()
      const rksAll = await db.riwayat_kelas_siswa.toArray()
      const rwl = await db.riwayat_wali_kelas.toArray()
      const pem = await db.peminatan.toArray()
      const pemSiswa = await db.peminatan_siswa.toArray()
      const tagihan = await db.tagihan.toArray()
      const rp = await db.rincian_pembayaran.toArray()
      const pembayaran = await db.pembayaran.toArray()

      // Filters
      const tahunId = filters?.tahunAjaran || null
      const tingkat = filters?.tingkat || null
      const kelasId = filters?.kelas || null
      const timeRange = filters?.timeRange || 'all'

      // Time window
      let startDate = null
      const now = new Date()
      if (timeRange === 'today') startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      else if (timeRange === 'week') startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      else if (timeRange === 'month') startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 30)
      else if (timeRange === 'quarter') startDate = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate())
      else if (timeRange === 'semester') startDate = new Date(now.getFullYear(), now.getMonth() - 6, now.getDate())
      else if (timeRange === 'year') startDate = new Date(now.getFullYear(), 0, 1)

      let rks = tahunId ? rksAll.filter(r => r.id_tahun_ajaran === tahunId) : rksAll.filter(r => (r.status||'').toLowerCase()==='aktif')
      if (startDate) rks = rks.filter(r => !r.tanggal_masuk || new Date(r.tanggal_masuk) >= startDate)
      if (tingkat) {
        const kSet = new Set(kelas.filter(k => k.tingkat === tingkat).map(k => k.id))
        rks = rks.filter(r => kSet.has(r.id_kelas))
      }
      if (kelasId) rks = rks.filter(r => r.id_kelas === kelasId)
      const rksIds = new Set(rks.map(r => r.id))
      const siswaIds = new Set(rks.map(r => r.id_siswa))

      // Gender
      const male = siswa.filter(s => siswaIds.has(s.id) && (s.jenis_kelamin||'').toLowerCase().startsWith('l')).length
      const female = siswa.filter(s => siswaIds.has(s.id) && (s.jenis_kelamin||'').toLowerCase().startsWith('p')).length

      // Kelas distribusi
      const kelasMap = new Map(kelas.map(k => [k.id, k]))
      const classCount = new Map()
      rks.forEach(r => { const k = kelasMap.get(r.id_kelas); if (!k) return; const name = `${k.tingkat} ${k.nama_sub_kelas}`; classCount.set(name, (classCount.get(name)||0)+1) })
      const classDist = Array.from(classCount, ([name, value]) => ({ name, value })).sort((a,b)=>b.value-a.value)

      // Peminatan distribusi (gunakan peminatan terbaru per siswa)
      const pemBySiswa = new Map()
      pemSiswa.filter(ps => siswaIds.has(ps.id_siswa)).forEach(ps => {
        const prev = pemBySiswa.get(ps.id_siswa)
        if (!prev || new Date(ps.tanggal_mulai||0) > new Date(prev.tanggal_mulai||0)) pemBySiswa.set(ps.id_siswa, ps)
      })
      const pemMap = new Map(pem.map(p => [p.id, p]))
      const pemCount = new Map()
      pemBySiswa.forEach(ps => { const p = pemMap.get(ps.id_peminatan); const name = p?.nama || p?.kode || 'Lainnya'; pemCount.set(name,(pemCount.get(name)||0)+1) })
      const pemDist = Array.from(pemCount, ([name, value]) => ({ name, value })).sort((a,b)=>b.value-a.value)

      // Wali Kelas distribusi (aktif di TA terpilih jika ada)
      let rwlFiltered = rwl
      if (tahunId) rwlFiltered = rwl.filter(x => x.id_tahun_ajaran === tahunId && (x.status||'').toLowerCase()==='aktif')
      const waliCount = new Map()
      rks.forEach(r => {
        const wali = rwlFiltered.find(w => w.id_kelas === r.id_kelas)
        if (!wali) return
        const key = String(wali.id_wali_kelas)
        waliCount.set(key, (waliCount.get(key)||0)+1)
      })
      const waliList = await db.wali_kelas.toArray()
      const waliMap = new Map(waliList.map(w=>[w.id, w]))
      const waliDist = Array.from(waliCount, ([id, value]) => ({ name: waliMap.get(id)?.nama_lengkap || 'Wali Kelas', value }))

      // Trend siswa per bulan (berdasarkan tanggal_masuk)
      const siswaTrendCount = new Map()
      rks.forEach(r => { if (!r.tanggal_masuk) return; const key = monthKey(r.tanggal_masuk); siswaTrendCount.set(key,(siswaTrendCount.get(key)||0)+1) })
      const siswaTrend = Array.from(siswaTrendCount, ([key, value]) => ({ key, value })).sort((a,b)=>a.key.localeCompare(b.key))

      // Trend pembayaran per bulan
      const rpByPembayaran = new Map()
      rp.forEach(x => { const arr = rpByPembayaran.get(x.id_pembayaran)||[]; arr.push(x); rpByPembayaran.set(x.id_pembayaran, arr) })
      const tagMap = new Map(tagihan.map(t=>[t.id,t]))
      const bayarRaw = new Map()
      pembayaran.forEach(p => {
        const t = tagMap.get(p.id_tagihan); if (!t) return
        if (!rksIds.has(t.id_riwayat_kelas_siswa)) return
        const total = (rpByPembayaran.get(p.id)||[]).reduce((s,it)=>s+Number(it.jumlah_dibayar||0),0)
        const d = new Date(p.dibuat_pada || p.diperbarui_pada || new Date())
        if (startDate && d < startDate) return
        const key = monthKey(d)
        bayarRaw.set(key,(bayarRaw.get(key)||0)+total)
      })
      const bayarTrend = Array.from(bayarRaw, ([key,value])=>({ key, value })).sort((a,b)=>a.key.localeCompare(b.key))

      if (!cancelled) setData({ gender: { male, female }, classDist, pemDist, waliDist, siswaTrend, bayarTrend })
      if (!cancelled) setLoading(false)
    }
    run()
    return () => { cancelled = true }
  }, [filters])

  return { loading, data }
}
