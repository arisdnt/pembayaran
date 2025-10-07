import { useMemo, useState, useCallback } from 'react'
import { useAppRefresh } from '../../../hooks/useAppRefresh'
import { db } from '../../../offline/db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'
import { useLiveQuery } from 'dexie-react-hooks'

export function useRiwayatWaliKelas() {
  const { status } = useOffline()
  const [error, setError] = useState('')

  const rows = useLiveQuery(
    async () => db.riwayat_wali_kelas.orderBy('tanggal_mulai').reverse().toArray(),
    [],
    undefined
  )
  const wali = useLiveQuery(async () => db.wali_kelas.toArray(), [], undefined)
  const kelas = useLiveQuery(async () => db.kelas.toArray(), [], undefined)
  const tahun = useLiveQuery(async () => db.tahun_ajaran.toArray(), [], undefined)

  const waliMap = useMemo(() => new Map((wali || []).map(w => [w.id, w])), [wali])
  const kelasMap = useMemo(() => new Map((kelas || []).map(k => [k.id, k])), [kelas])
  const tahunMap = useMemo(() => new Map((tahun || []).map(t => [t.id, t])), [tahun])

  const data = useMemo(() => {
    if (!rows) return []
    return rows.map(r => ({
      ...r,
      wali_kelas: waliMap.get(r.id_wali_kelas)
        ? {
            id: r.id_wali_kelas,
            nama_lengkap: waliMap.get(r.id_wali_kelas).nama_lengkap,
            nip: waliMap.get(r.id_wali_kelas).nip,
          }
        : null,
      kelas: kelasMap.get(r.id_kelas)
        ? {
            id: r.id_kelas,
            tingkat: kelasMap.get(r.id_kelas).tingkat,
            nama_sub_kelas: kelasMap.get(r.id_kelas).nama_sub_kelas,
          }
        : null,
      tahun_ajaran: tahunMap.get(r.id_tahun_ajaran)
        ? {
            id: r.id_tahun_ajaran,
            nama: tahunMap.get(r.id_tahun_ajaran).nama,
          }
        : null,
    }))
  }, [rows, waliMap, kelasMap, tahunMap])

  const loading = rows === undefined || wali === undefined || kelas === undefined || tahun === undefined

  const refreshData = useCallback(async () => data, [data])

  const handleAppRefresh = useCallback(() => refreshData(), [refreshData])
  useAppRefresh(handleAppRefresh)
  const deleteItem = async (id) => {
    try {
      await enqueueDelete('riwayat_wali_kelas', id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      const payload = {
        id_wali_kelas: formData.id_wali_kelas,
        id_kelas: formData.id_kelas,
        id_tahun_ajaran: formData.id_tahun_ajaran,
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_selesai: formData.tanggal_selesai || null,
        status: formData.status,
        catatan: formData.catatan || null,
      }
      if (isEdit) await enqueueUpdate('riwayat_wali_kelas', formData.id, payload)
      else await enqueueInsert('riwayat_wali_kelas', payload)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const toggleStatus = async (item) => {
    try {
      const newStatus = item.status === 'aktif' ? 'selesai' : 'aktif'
      await enqueueUpdate('riwayat_wali_kelas', item.id, { status: newStatus })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    data,
    loading,
    realtimeStatus: status.realtime,
    error,
    setError,
    deleteItem,
    saveItem,
    toggleStatus,
    refreshData,
    waliKelasList: wali || [],
    kelasList: kelas || [],
    tahunAjaranList: tahun || [],
  }
}




