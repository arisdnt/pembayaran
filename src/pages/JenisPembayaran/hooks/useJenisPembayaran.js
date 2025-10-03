import { useEffect, useMemo, useState, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../offline/db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'

export function useJenisPembayaran() {
  const { status } = useOffline()
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const jp = useLiveQuery(async () => db.jenis_pembayaran.orderBy('kode').toArray(), [], undefined)
  const tahun = useLiveQuery(async () => db.tahun_ajaran.toArray(), [], undefined)

  const data = useMemo(() => {
    const list = jp || []
    const tahunMap = new Map((tahun || []).map((t) => [t.id, { id: t.id, nama: t.nama }]))
    return list.map((it) => ({
      ...it,
      tahun_ajaran: tahunMap.get(it.id_tahun_ajaran) || null,
    }))
  }, [jp, tahun])

  const loading = jp === undefined

  const refreshData = useCallback(async () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 300)
  }, [])

  const deleteItem = async (id) => {
    try {
      await enqueueDelete('jenis_pembayaran', id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      if (!formData.id_tahun_ajaran) throw new Error('Tahun Ajaran wajib dipilih')
      if (!formData.tingkat) throw new Error('Tingkat Kelas wajib dipilih')
      if (!formData.tipe_pembayaran) throw new Error('Tipe Pembayaran wajib dipilih')

      if (isEdit) {
        await enqueueUpdate('jenis_pembayaran', formData.id, {
          kode: formData.kode,
          nama: formData.nama,
          deskripsi: formData.deskripsi || null,
          jumlah_default: formData.jumlah_default || null,
          tipe_pembayaran: formData.tipe_pembayaran,
          wajib: formData.wajib,
          status_aktif: formData.status_aktif,
          id_tahun_ajaran: formData.id_tahun_ajaran,
          tingkat: formData.tingkat,
        })
      } else {
        await enqueueInsert('jenis_pembayaran', {
          kode: formData.kode,
          nama: formData.nama,
          deskripsi: formData.deskripsi || null,
          jumlah_default: formData.jumlah_default || null,
          tipe_pembayaran: formData.tipe_pembayaran,
          wajib: formData.wajib,
          status_aktif: formData.status_aktif,
          id_tahun_ajaran: formData.id_tahun_ajaran,
          tingkat: formData.tingkat,
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
  }
}
