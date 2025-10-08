import { useEffect, useState, useCallback, useRef } from 'react'
import { useAppRefresh } from '../../../hooks/useAppRefresh'
import { useIndexedTable } from '../../../offline/useIndexedTable'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'

let cachedWaliKelas = null

export function useWaliKelas() {
  const { status } = useOffline()
  const { data = [], loading } = useIndexedTable('wali_kelas', { orderBy: 'nama_lengkap' })
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')
  const isMountedRef = useRef(true)

  const refreshData = useCallback(async () => {
    // Data flows from background sync; nothing to do here, keep API compatible
    setIsRefreshing(true)
    setTimeout(() => isMountedRef.current && setIsRefreshing(false), 300)
    return data
  }, [data])

  const handleAppRefresh = useCallback(() => refreshData(), [refreshData])
  useAppRefresh(handleAppRefresh)

  useEffect(() => {
    isMountedRef.current = true
    return () => { isMountedRef.current = false }
  }, [])

  const toggleStatus = async (item) => {
    try {
      await enqueueUpdate('wali_kelas', item.id, { status_aktif: !item.status_aktif })
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteItem = async (id) => {
    try {
      // Preflight: cek relasi pada riwayat_wali_kelas
      const { db } = await import('../../../offline/db')
      const rwkCount = await db.riwayat_wali_kelas.where('id_wali_kelas').equals(id).count()
      if (rwkCount > 0) {
        const msg = `Wali kelas tidak dapat dihapus karena masih memiliki ${rwkCount} riwayat penugasan. ` +
          `Hapus atau pindahkan riwayat penugasan terlebih dahulu.`
        setError(msg)
        throw new Error(msg)
      }
      await enqueueDelete('wali_kelas', id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      if (isEdit) {
        await enqueueUpdate('wali_kelas', formData.id, {
          nama_lengkap: formData.nama_lengkap,
          nip: formData.nip || null,
          nomor_telepon: formData.nomor_telepon || null,
          email: formData.email || null,
          status_aktif: formData.status_aktif,
        })
      } else {
        await enqueueInsert('wali_kelas', {
          nama_lengkap: formData.nama_lengkap,
          nip: formData.nip || null,
          nomor_telepon: formData.nomor_telepon || null,
          email: formData.email || null,
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
