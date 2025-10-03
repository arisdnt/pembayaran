import { useEffect, useState, useCallback } from 'react'
import { useAppRefresh } from '../../../hooks/useAppRefresh'
import { db } from '../../../offline/db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'

export function useRiwayatWaliKelas() {
  const { status } = useOffline()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [waliKelasList, setWaliKelasList] = useState([])
  const [kelasList, setKelasList] = useState([])
  const [tahunAjaranList, setTahunAjaranList] = useState([])

  const refreshData = useCallback(async () => {
    const [rows, wali, kelas, tahun] = await Promise.all([
      db.riwayat_wali_kelas.orderBy('tanggal_mulai').reverse().toArray(),
      db.wali_kelas.toArray(),
      db.kelas.toArray(),
      db.tahun_ajaran.toArray(),
    ])
    const waliMap = new Map(wali.map(w => [w.id, w]))
    const kelasMap = new Map(kelas.map(k => [k.id, k]))
    const tahunMap = new Map(tahun.map(t => [t.id, t]))
    const list = rows.map(r => ({
      ...r,
      wali_kelas: waliMap.get(r.id_wali_kelas) ? { id: r.id_wali_kelas, nama_lengkap: waliMap.get(r.id_wali_kelas).nama_lengkap, nip: waliMap.get(r.id_wali_kelas).nip } : null,
      kelas: kelasMap.get(r.id_kelas) ? { id: r.id_kelas, tingkat: kelasMap.get(r.id_kelas).tingkat, nama_sub_kelas: kelasMap.get(r.id_kelas).nama_sub_kelas } : null,
      tahun_ajaran: tahunMap.get(r.id_tahun_ajaran) ? { id: r.id_tahun_ajaran, nama: tahunMap.get(r.id_tahun_ajaran).nama } : null,
    }))
    setData(list)
    setWaliKelasList(wali)
    setKelasList(kelas)
    setTahunAjaranList(tahun)
    setLoading(false)
    return list
  }, [])

  const handleAppRefresh = useCallback(() => refreshData(), [refreshData])
  useAppRefresh(handleAppRefresh)
  useEffect(() => { refreshData() }, [refreshData])

  const deleteItem = async (id) => {
    try { await enqueueDelete('riwayat_wali_kelas', id) } catch (err) { setError(err.message); throw err }
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
    } catch (err) { setError(err.message); throw err }
  }

  return {
    data,
    loading,
    realtimeStatus: status.realtime,
    error,
    setError,
    deleteItem,
    saveItem,
    refreshData,
    waliKelasList,
    kelasList,
    tahunAjaranList,
  }
}
