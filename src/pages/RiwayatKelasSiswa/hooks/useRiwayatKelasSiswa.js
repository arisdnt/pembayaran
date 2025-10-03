import { useEffect, useState, useCallback } from 'react'
import { useAppRefresh } from '../../../hooks/useAppRefresh'
import { db } from '../../../offline/db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'

export function useRiwayatKelasSiswa() {
  const { status } = useOffline()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [siswaList, setSiswaList] = useState([])
  const [kelasList, setKelasList] = useState([])
  const [tahunAjaranList, setTahunAjaranList] = useState([])

  const refreshData = useCallback(async () => {
    const [rows, siswa, kelas, tahun, rwl] = await Promise.all([
      db.riwayat_kelas_siswa.orderBy('tanggal_masuk').reverse().toArray(),
      db.siswa.toArray(),
      db.kelas.toArray(),
      db.tahun_ajaran.toArray(),
      db.riwayat_wali_kelas.toArray(),
    ])
    const siswaMap = new Map(siswa.map(s => [s.id, s]))
    const kelasMap = new Map(kelas.map(k => [k.id, k]))
    const tahunMap = new Map(tahun.map(t => [t.id, t]))
    const rwlByKelas = new Map()
    rwl.forEach(x => {
      const arr = rwlByKelas.get(x.id_kelas) || []
      arr.push(x)
      rwlByKelas.set(x.id_kelas, arr)
    })
    const list = rows.map(r => ({
      ...r,
      siswa: siswaMap.get(r.id_siswa) ? { id: r.id_siswa, nama_lengkap: siswaMap.get(r.id_siswa).nama_lengkap, nisn: siswaMap.get(r.id_siswa).nisn } : null,
      kelas: (() => {
        const k = kelasMap.get(r.id_kelas)
        if (!k) return null
        return {
          id: k.id,
          tingkat: k.tingkat,
          nama_sub_kelas: k.nama_sub_kelas,
          riwayat_wali_kelas: (rwlByKelas.get(k.id) || []).filter(x => x.id_tahun_ajaran === r.id_tahun_ajaran),
        }
      })(),
      tahun_ajaran: tahunMap.get(r.id_tahun_ajaran) ? { id: r.id_tahun_ajaran, nama: tahunMap.get(r.id_tahun_ajaran).nama } : null,
    }))
    setData(list)
    setSiswaList(siswa.filter(s => s.status_aktif))
    setKelasList(kelas)
    setTahunAjaranList(tahun)
    setLoading(false)
    return list
  }, [])

  const handleAppRefresh = useCallback(() => refreshData(), [refreshData])
  useAppRefresh(handleAppRefresh)
  useEffect(() => { refreshData() }, [refreshData])

  const deleteItem = async (id) => {
    try { await enqueueDelete('riwayat_kelas_siswa', id) } catch (err) { setError(err.message); throw err }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      const payload = {
        id_siswa: formData.id_siswa,
        id_kelas: formData.id_kelas,
        id_tahun_ajaran: formData.id_tahun_ajaran,
        tanggal_masuk: formData.tanggal_masuk,
        tanggal_keluar: formData.tanggal_keluar || null,
        status: formData.status,
        catatan: formData.catatan || null,
      }
      if (isEdit) await enqueueUpdate('riwayat_kelas_siswa', formData.id, payload)
      else await enqueueInsert('riwayat_kelas_siswa', payload)
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
    siswaList,
    kelasList,
    tahunAjaranList,
  }
}
