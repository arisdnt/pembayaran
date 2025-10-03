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

  const rks = useLiveQuery(
    async () => db.riwayat_kelas_siswa.toArray(),
    [],
    undefined
  )

  const data = useMemo(() => {
    const list = tahunAjaran || []
    const rksByTA = new Map()
    ;(rks || []).forEach((x) => {
      const key = x.id_tahun_ajaran
      rksByTA.set(key, (rksByTA.get(key) || 0) + 1)
    })
    return list.map((it) => ({ ...it, total_siswa: rksByTA.get(it.id) || 0 }))
  }, [tahunAjaran, rks])

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
