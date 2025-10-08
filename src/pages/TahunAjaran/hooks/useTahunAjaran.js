import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../offline/db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'

export function useTahunAjaran() {
  const { status } = useOffline()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')
  const isMountedRef = useRef(true)

  const tahunAjaran = useLiveQuery(
    async () => {
      return db.tahun_ajaran.orderBy('tanggal_mulai').reverse().toArray()
    },
    [],
    undefined
  )

  const rks = useLiveQuery(async () => db.riwayat_kelas_siswa.toArray(), [], undefined)
  const rwk = useLiveQuery(async () => db.riwayat_wali_kelas.toArray(), [], undefined)
  const jp = useLiveQuery(async () => db.jenis_pembayaran.toArray(), [], undefined)
  const pem = useLiveQuery(async () => db.peminatan_siswa.toArray(), [], undefined)

  const data = useMemo(() => {
    const list = tahunAjaran || []
    const rksByTA = new Map()
    const rwkByTA = new Map()
    const jpByTA = new Map()
    const pemByTA = new Map()

    ;(rks || []).forEach((x) => {
      const key = x.id_tahun_ajaran
      rksByTA.set(key, (rksByTA.get(key) || 0) + 1)
    })
    ;(rwk || []).forEach((x) => {
      const key = x.id_tahun_ajaran
      rwkByTA.set(key, (rwkByTA.get(key) || 0) + 1)
    })
    ;(jp || []).forEach((x) => {
      const key = x.id_tahun_ajaran
      if (key) jpByTA.set(key, (jpByTA.get(key) || 0) + 1)
    })
    ;(pem || []).forEach((x) => {
      const key = x.id_tahun_ajaran
      if (key) pemByTA.set(key, (pemByTA.get(key) || 0) + 1)
    })

    return list.map((it) => {
      const cRks = rksByTA.get(it.id) || 0
      const cRwk = rwkByTA.get(it.id) || 0
      const cJp = jpByTA.get(it.id) || 0
      const cPem = pemByTA.get(it.id) || 0
      return {
        ...it,
        total_siswa: cRks,
        has_relasi: (cRks + cRwk + cJp + cPem) > 0,
        _relasi_counts: { rks: cRks, rwk: cRwk, jp: cJp, pem: cPem },
      }
    })
  }, [tahunAjaran, rks, rwk, jp, pem])

  const loading = tahunAjaran === undefined

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
      if (!item.status_aktif) {
        // Matikan semua TA aktif lain secara lokal & outbox
        // Fetch all and filter in JavaScript (boolean cannot be indexed in IndexedDB)
        const all = await db.tahun_ajaran.toArray()
        const others = all.filter((x) => x.status_aktif === true && x.id !== item.id)
        for (const row of others) {
          await enqueueUpdate('tahun_ajaran', row.id, { status_aktif: false })
        }
      }
      await enqueueUpdate('tahun_ajaran', item.id, { status_aktif: !item.status_aktif })
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteItem = async (id) => {
    try {
      const [cRks, cRwk, cJp, cPem] = await Promise.all([
        db.riwayat_kelas_siswa.where('id_tahun_ajaran').equals(id).count(),
        db.riwayat_wali_kelas.where('id_tahun_ajaran').equals(id).count(),
        db.jenis_pembayaran.where('id_tahun_ajaran').equals(id).count(),
        db.peminatan_siswa.where('id_tahun_ajaran').equals(id).count(),
      ])

      if (cRks + cRwk + cJp + cPem > 0) {
        const parts = []
        if (cRks) parts.push(`${cRks} riwayat kelas siswa`)
        if (cRwk) parts.push(`${cRwk} riwayat wali kelas`)
        if (cJp) parts.push(`${cJp} jenis pembayaran`)
        if (cPem) parts.push(`${cPem} peminatan siswa`)
        const refs = parts.join(' dan ')
        const msg = `Tahun ajaran tidak dapat dihapus karena masih memiliki relasi: ${refs}. ` +
          `Pindahkan atau hapus data terkait terlebih dahulu sebelum menghapus tahun ajaran.`
        setError(msg)
        throw new Error(msg)
      }

      await enqueueDelete('tahun_ajaran', id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      if (formData.status_aktif) {
        // Fetch all and filter in JavaScript (boolean cannot be indexed in IndexedDB)
        const all = await db.tahun_ajaran.toArray()
        const others = all.filter((x) => x.status_aktif === true && x.id !== (formData.id || ''))
        for (const row of others) {
          await enqueueUpdate('tahun_ajaran', row.id, { status_aktif: false })
        }
      }
      if (isEdit) {
        await enqueueUpdate('tahun_ajaran', formData.id, {
          nama: formData.nama,
          tanggal_mulai: formData.tanggal_mulai,
          tanggal_selesai: formData.tanggal_selesai,
          status_aktif: formData.status_aktif,
        })
      } else {
        await enqueueInsert('tahun_ajaran', {
          nama: formData.nama,
          tanggal_mulai: formData.tanggal_mulai,
          tanggal_selesai: formData.tanggal_selesai,
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
