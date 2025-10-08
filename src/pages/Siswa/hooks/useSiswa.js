import { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../offline/db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'

export function useSiswa() {
  const { status } = useOffline()
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const isMountedRef = useRef(true)

  // Load base tables
  const siswa = useLiveQuery(
    async () => db.siswa.orderBy('diperbarui_pada').reverse().toArray(),
    [],
    undefined
  )
  const rks = useLiveQuery(async () => db.riwayat_kelas_siswa.toArray(), [], undefined)
  const kelas = useLiveQuery(async () => db.kelas.toArray(), [], undefined)
  const tahun = useLiveQuery(async () => db.tahun_ajaran.toArray(), [], undefined)
  const peminatan = useLiveQuery(async () => db.peminatan.toArray(), [], undefined)
  const peminatanSiswa = useLiveQuery(async () => db.peminatan_siswa.toArray(), [], undefined)
  const tagihan = useLiveQuery(async () => db.tagihan.toArray(), [], undefined)
  const rincianTagihan = useLiveQuery(async () => db.rincian_tagihan.toArray(), [], undefined)
  const pembayaran = useLiveQuery(async () => db.pembayaran.toArray(), [], undefined)
  const rincianPembayaran = useLiveQuery(async () => db.rincian_pembayaran.toArray(), [], undefined)

  const data = useMemo(() => {
    const siswaList = siswa || []
    const kelasMap = new Map((kelas || []).map(k => [k.id, k]))
    const tahunMap = new Map((tahun || []).map(t => [t.id, t]))
    const peminatanMap = new Map((peminatan || []).map(p => [p.id, p]))

    const rksBySiswa = new Map()
    ;(rks || []).forEach(row => {
      const arr = rksBySiswa.get(row.id_siswa) || []
      arr.push(row)
      rksBySiswa.set(row.id_siswa, arr)
    })

    const tagihanByRks = new Map()
    ;(tagihan || []).forEach(t => {
      const arr = tagihanByRks.get(t.id_riwayat_kelas_siswa) || []
      arr.push(t)
      tagihanByRks.set(t.id_riwayat_kelas_siswa, arr)
    })

    const rincianByTagihan = new Map()
    ;(rincianTagihan || []).forEach(r => {
      const arr = rincianByTagihan.get(r.id_tagihan) || []
      arr.push(r)
      rincianByTagihan.set(r.id_tagihan, arr)
    })

    const pembayaranByTagihan = new Map()
    ;(pembayaran || []).forEach(p => {
      const arr = pembayaranByTagihan.get(p.id_tagihan) || []
      arr.push(p)
      pembayaranByTagihan.set(p.id_tagihan, arr)
    })

    const rincianPembayaranByPembayaran = new Map()
    ;(rincianPembayaran || []).forEach(rp => {
      const arr = rincianPembayaranByPembayaran.get(rp.id_pembayaran) || []
      arr.push(rp)
      rincianPembayaranByPembayaran.set(rp.id_pembayaran, arr)
    })

    const peminatanBySiswa = new Map()
    ;(peminatanSiswa || []).forEach(ps => {
      const arr = peminatanBySiswa.get(ps.id_siswa) || []
      arr.push(ps)
      peminatanBySiswa.set(ps.id_siswa, arr)
    })

    return siswaList.map(s => {
      const rRows = (rksBySiswa.get(s.id) || [])
        .filter(r => (r.status || '').toLowerCase() === 'aktif')
        .sort((a, b) => new Date(b.tanggal_masuk || 0) - new Date(a.tanggal_masuk || 0))
      const latest = rRows[0]
      const kelasTerbaru = latest ? kelasMap.get(latest.id_kelas) || null : null
      const tahunTerbaru = latest ? tahunMap.get(latest.id_tahun_ajaran) || null : null

      // peminatan terbaru berdasarkan tanggal_mulai
      const psList = (peminatanBySiswa.get(s.id) || []).sort((a, b) => new Date(b.tanggal_mulai || 0) - new Date(a.tanggal_mulai || 0))
      const peminatanTerbaru = psList[0] ? (peminatanMap.get(psList[0].id_peminatan) || null) : null

      // Aggregasi finansial dari seluruh tagihan terkait semua RKS siswa
      const rksIds = (rksBySiswa.get(s.id) || []).map(r => r.id)
      let totalTagihan = 0
      let totalDibayar = 0
      for (const rksId of rksIds) {
        const tagihanRows = tagihanByRks.get(rksId) || []
        for (const t of tagihanRows) {
          const rincian = rincianByTagihan.get(t.id) || []
          totalTagihan += rincian.reduce((sum, it) => sum + Number(it.jumlah || 0), 0)
          const pembayaranRows = pembayaranByTagihan.get(t.id) || []
          for (const p of pembayaranRows) {
            const rp = rincianPembayaranByPembayaran.get(p.id) || []
            totalDibayar += rp.reduce((sum, it) => sum + Number(it.jumlah_dibayar || 0), 0)
          }
        }
      }
      const totalTunggakan = Math.max(totalTagihan - totalDibayar, 0)

      const relRks = (rksBySiswa.get(s.id) || [])
      const relPem = (peminatanBySiswa.get(s.id) || [])
      const relTagihanCount = rksIds.reduce((acc, rksId) => acc + (tagihanByRks.get(rksId)?.length || 0), 0)

      return {
        ...s,
        kelas_terbaru: kelasTerbaru,
        tahun_ajaran_terbaru: tahunTerbaru,
        peminatan_terbaru: peminatanTerbaru,
        total_tagihan: totalTagihan,
        total_dibayar: totalDibayar,
        total_tunggakan: totalTunggakan,
        has_relasi: (relRks.length + relPem.length + relTagihanCount) > 0,
        _relasi_counts: { riwayat_kelas: relRks.length, peminatan: relPem.length, tagihan: relTagihanCount },
      }
    })
  }, [siswa, rks, kelas, tahun, peminatan, peminatanSiswa, tagihan, rincianTagihan, pembayaran, rincianPembayaran])

  const loading = siswa === undefined

  const refreshData = useCallback(async () => {
    setIsRefreshing(true)
    setTimeout(() => isMountedRef.current && setIsRefreshing(false), 300)
    return data
  }, [data])

  useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])

  const toggleStatus = async (item) => {
    try {
      await enqueueUpdate('siswa', item.id, { status_aktif: !item.status_aktif })
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteItem = async (id) => {
    try {
      const [rksCount, pemCount] = await Promise.all([
        db.riwayat_kelas_siswa.where('id_siswa').equals(id).count(),
        db.peminatan_siswa.where('id_siswa').equals(id).count(),
      ])
      // Tagihan via RKS
      let tagihanCount = 0
      if (rksCount > 0) {
        const rksRows = await db.riwayat_kelas_siswa.where('id_siswa').equals(id).toArray()
        const rksIds = rksRows.map(r => r.id)
        // Dexie lacks where-in easily without compound; fallback to filter in JS
        const allTagihan = await db.tagihan.toArray()
        tagihanCount = allTagihan.filter(t => rksIds.includes(t.id_riwayat_kelas_siswa)).length
      }
      if (rksCount + pemCount + tagihanCount > 0) {
        const parts = []
        if (rksCount) parts.push(`${rksCount} riwayat kelas`)
        if (tagihanCount) parts.push(`${tagihanCount} tagihan`)
        if (pemCount) parts.push(`${pemCount} peminatan siswa`)
        const refs = parts.join(' dan ')
        const msg = `Siswa tidak dapat dihapus karena masih memiliki relasi: ${refs}. ` +
          `Pindahkan atau hapus data terkait terlebih dahulu.`
        setError(msg)
        throw new Error(msg)
      }
      await enqueueDelete('siswa', id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      const token_akses_unik = formData.token_akses_unik || `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
      if (isEdit) {
        await enqueueUpdate('siswa', formData.id, {
          nama_lengkap: formData.nama_lengkap,
          nisn: formData.nisn || null,
          tanggal_lahir: formData.tanggal_lahir || null,
          jenis_kelamin: formData.jenis_kelamin || null,
          alamat: formData.alamat || null,
          nama_wali_siswa: formData.nama_wali_siswa || null,
          nomor_whatsapp_wali: formData.nomor_whatsapp_wali || null,
          status_aktif: formData.status_aktif,
        })
      } else {
        await enqueueInsert('siswa', {
          nama_lengkap: formData.nama_lengkap,
          nisn: formData.nisn || null,
          tanggal_lahir: formData.tanggal_lahir || null,
          jenis_kelamin: formData.jenis_kelamin || null,
          alamat: formData.alamat || null,
          nama_wali_siswa: formData.nama_wali_siswa || null,
          nomor_whatsapp_wali: formData.nomor_whatsapp_wali || null,
          token_akses_unik,
          status_aktif: formData.status_aktif,
        })
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    data,
    loading,
    isRefreshing,
    realtimeStatus: status.realtime,
    error,
    setError,
    toggleStatus,
    deleteItem,
    saveItem,
    refreshData,
  }
}
