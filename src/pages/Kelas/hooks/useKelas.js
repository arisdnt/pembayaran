import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../offline/db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'

export function useKelas() {
  const { status } = useOffline()
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')
  const isMountedRef = useRef(true)
  const [selectedYearId, setSelectedYearId] = useState(null)

  const rows = useLiveQuery(async () => db.kelas.toArray(), [], undefined)
  const years = useLiveQuery(
    async () => db.tahun_ajaran.orderBy('tanggal_mulai').reverse().toArray(),
    [],
    undefined
  )
  const riwayatKelas = useLiveQuery(async () => db.riwayat_kelas_siswa.toArray(), [], undefined)
  const riwayatWaliKelas = useLiveQuery(async () => db.riwayat_wali_kelas.toArray(), [], undefined)

  useEffect(() => {
    if (!years || years.length === 0) {
      return
    }
    if (selectedYearId && years.some((item) => item.id === selectedYearId)) {
      return
    }

    const aktif = years.find((item) => item.status_aktif)
    setSelectedYearId((aktif || years[0]).id)
  }, [years, selectedYearId])

  const tahunAjaranOptions = useMemo(() => {
    if (!years) return []
    return years.map((item) => ({
      id: item.id,
      nama: item.nama,
      status_aktif: item.status_aktif,
    }))
  }, [years])

  const enrollmentMap = useMemo(() => {
    if (!riwayatKelas || !selectedYearId) {
      return new Map()
    }
    return riwayatKelas
      .filter(
        (row) =>
          row.id_tahun_ajaran === selectedYearId &&
          (row.status || '').toLowerCase() === 'aktif'
      )
      .reduce((map, row) => {
        const current = map.get(row.id_kelas) || 0
        map.set(row.id_kelas, current + 1)
        return map
      }, new Map())
  }, [riwayatKelas, selectedYearId])

  const data = useMemo(() => {
    const list = rows || []
    const relasiSet = new Set(
      [
        ...(riwayatKelas || []).map(r => r.id_kelas),
        ...(riwayatWaliKelas || []).map(r => r.id_kelas),
      ].filter(Boolean)
    )

    return [...list].map((item) => {
      const hasTotal = enrollmentMap.has(item.id)
      return {
        ...item,
        total_siswa: hasTotal ? enrollmentMap.get(item.id) : null,
        has_relasi: relasiSet.has(item.id),
      }
    }).sort((a, b) => {
      const t = String(a.tingkat || '').localeCompare(String(b.tingkat || ''), undefined, { numeric: true })
      if (t !== 0) return t
      return String(a.nama_sub_kelas || '').localeCompare(String(b.nama_sub_kelas || ''))
    })
  }, [rows, enrollmentMap, riwayatKelas, riwayatWaliKelas])

  const loading = rows === undefined

  const refreshData = useCallback(async () => {
    setIsRefreshing(true)
    setTimeout(() => isMountedRef.current && setIsRefreshing(false), 300)
    return data
  }, [data])

  useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])

  const deleteItem = async (id) => {
    try {
      // Preflight: prevent enqueue if still referenced locally
      const [rksCount, rwkCount] = await Promise.all([
        db.riwayat_kelas_siswa.where('id_kelas').equals(id).count(),
        db.riwayat_wali_kelas?.where ? db.riwayat_wali_kelas.where('id_kelas').equals(id).count() : Promise.resolve(0)
      ])

      if ((rksCount || 0) > 0 || (rwkCount || 0) > 0) {
        const parts = []
        if (rksCount > 0) parts.push(`${rksCount} riwayat kelas siswa`)
        if (rwkCount > 0) parts.push(`${rwkCount} riwayat wali kelas`)
        const refs = parts.join(' dan ')

        const msg = `Kelas tidak dapat dihapus karena masih memiliki relasi: ${refs}. ` +
          `Pindahkan atau hapus data terkait terlebih dahulu (mis. riwayat siswa/wali kelas) sebelum menghapus kelas.`
        setError(msg)
        throw new Error(msg)
      }

      await enqueueDelete('kelas', id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      if (isEdit) {
        await enqueueUpdate('kelas', formData.id, {
          tingkat: formData.tingkat,
          nama_sub_kelas: formData.nama_sub_kelas,
          kapasitas_maksimal: formData.kapasitas_maksimal || null,
        })
      } else {
        await enqueueInsert('kelas', {
          tingkat: formData.tingkat,
          nama_sub_kelas: formData.nama_sub_kelas,
          kapasitas_maksimal: formData.kapasitas_maksimal || null,
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
    deleteItem,
    saveItem,
    refreshData,
    tahunAjaranOptions,
    selectedYearId,
    setSelectedYearId,
  }
}
