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
      // EDIT MODE: Single update
      if (isEdit) {
        const payload = {
          id_siswa: formData.id_siswa,
          id_peminatan: formData.id_peminatan,
          id_tahun_ajaran: formData.id_tahun_ajaran,
          tingkat: formData.tingkat,
          tanggal_mulai: formData.tanggal_mulai,
          tanggal_selesai: formData.tanggal_selesai || null,
          catatan: formData.catatan || null,
        }
        await enqueueUpdate('peminatan_siswa', formData.id, payload)
        return
      }

      // CREATE MODE: Bulk insert
      // formData.siswa_ids is an array of siswa IDs
      if (!formData.siswa_ids || formData.siswa_ids.length === 0) {
        throw new Error('Minimal 1 siswa harus dipilih')
      }

      // Cek siswa yang sudah punya peminatan di tahun ajaran & tingkat yang sama
      // Fetch semua dan filter di JavaScript karena tidak ada compound index
      const allPeminatanSiswa = await db.peminatan_siswa.toArray()
      const existingPeminatanSiswa = allPeminatanSiswa.filter(
        ps => ps.id_tahun_ajaran === formData.id_tahun_ajaran && ps.tingkat === formData.tingkat
      )
      
      const existingSiswaIds = new Set(existingPeminatanSiswa.map(ps => ps.id_siswa))
      
      // Filter siswa yang belum punya peminatan
      const newSiswaIds = formData.siswa_ids.filter(id => !existingSiswaIds.has(id))
      const duplicateSiswaIds = formData.siswa_ids.filter(id => existingSiswaIds.has(id))
      
      // Jika ada siswa yang sudah punya peminatan, beri warning
      if (duplicateSiswaIds.length > 0) {
        const siswaList = await db.siswa.toArray()
        const siswaMap = new Map(siswaList.map(s => [s.id, s]))
        const duplicateNames = duplicateSiswaIds
          .map(id => siswaMap.get(id)?.nama_lengkap || id)
          .join(', ')
        
        if (newSiswaIds.length === 0) {
          throw new Error(`Semua siswa yang dipilih sudah memiliki peminatan di tingkat ${formData.tingkat}: ${duplicateNames}`)
        } else {
          // Ada siswa baru yang bisa di-insert, lanjutkan dengan warning
          console.warn(`Siswa berikut dilewati karena sudah punya peminatan: ${duplicateNames}`)
        }
      }

      if (newSiswaIds.length === 0) {
        throw new Error('Tidak ada siswa baru yang bisa ditambahkan')
      }

      // Insert untuk setiap siswa yang belum punya peminatan
      const insertPromises = newSiswaIds.map(id_siswa => {
        const payload = {
          id_siswa: id_siswa,
          id_peminatan: formData.id_peminatan,
          id_tahun_ajaran: formData.id_tahun_ajaran,
          tingkat: formData.tingkat,
          tanggal_mulai: formData.tanggal_mulai,
          tanggal_selesai: formData.tanggal_selesai || null,
          catatan: formData.catatan || null,
        }
        return enqueueInsert('peminatan_siswa', payload)
      })

      await Promise.all(insertPromises)
      
      // Jika ada siswa yang dilewati, throw error dengan info
      if (duplicateSiswaIds.length > 0) {
        const siswaList = await db.siswa.toArray()
        const siswaMap = new Map(siswaList.map(s => [s.id, s]))
        const duplicateNames = duplicateSiswaIds
          .map(id => siswaMap.get(id)?.nama_lengkap || id)
          .join(', ')
        throw new Error(`Berhasil menambahkan ${newSiswaIds.length} siswa. ${duplicateSiswaIds.length} siswa dilewati karena sudah memiliki peminatan: ${duplicateNames}`)
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
