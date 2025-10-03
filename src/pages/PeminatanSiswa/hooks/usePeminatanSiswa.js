import { useEffect, useState, useCallback } from 'react'
import { useAppRefresh } from '../../../hooks/useAppRefresh'
import { db } from '../../../offline/db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'

export function usePeminatanSiswa() {
  const { status } = useOffline()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [siswaList, setSiswaList] = useState([])
  const [peminatanList, setPeminatanList] = useState([])
  const [tahunAjaranList, setTahunAjaranList] = useState([])

  const refreshData = useCallback(async () => {
    const [rows, siswa, peminatan, tahun] = await Promise.all([
      db.peminatan_siswa.orderBy('tanggal_mulai').reverse().toArray(),
      db.siswa.toArray(),
      db.peminatan.toArray(),
      db.tahun_ajaran.toArray(),
    ])
    const siswaMap = new Map(siswa.map(s => [s.id, s]))
    const pemMap = new Map(peminatan.map(p => [p.id, p]))
    const tahunMap = new Map(tahun.map(t => [t.id, t]))
    const list = rows.map(r => ({
      ...r,
      siswa: siswaMap.get(r.id_siswa) ? { id: r.id_siswa, nama_lengkap: siswaMap.get(r.id_siswa).nama_lengkap, nisn: siswaMap.get(r.id_siswa).nisn } : null,
      peminatan: pemMap.get(r.id_peminatan) ? { id: r.id_peminatan, kode: pemMap.get(r.id_peminatan).kode, nama: pemMap.get(r.id_peminatan).nama } : null,
      tahun_ajaran: tahunMap.get(r.id_tahun_ajaran) ? { id: r.id_tahun_ajaran, nama: tahunMap.get(r.id_tahun_ajaran).nama } : null,
    }))
    setData(list)
    setSiswaList(siswa.filter(s => s.status_aktif))
    setPeminatanList(peminatan.filter(p => p.aktif))
    setTahunAjaranList(tahun)
    setLoading(false)
    return list
  }, [])

  const handleAppRefresh = useCallback(() => refreshData(), [refreshData])
  useAppRefresh(handleAppRefresh)

  useEffect(() => { refreshData() }, [refreshData])

  const deleteItem = async (id) => {
    try {
      await enqueueDelete('peminatan_siswa', id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      const payload = {
        id_siswa: formData.id_siswa,
        id_peminatan: formData.id_peminatan,
        id_tahun_ajaran: formData.id_tahun_ajaran,
        tingkat: formData.tingkat,
        tanggal_mulai: formData.tanggal_mulai,
        tanggal_selesai: formData.tanggal_selesai || null,
        catatan: formData.catatan || null,
      }
      if (isEdit) {
        await enqueueUpdate('peminatan_siswa', formData.id, payload)
      } else {
        await enqueueInsert('peminatan_siswa', payload)
      }
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
    refreshData,
    siswaList,
    peminatanList,
    tahunAjaranList,
  }
}
