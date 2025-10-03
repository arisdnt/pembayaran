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

  const rows = useLiveQuery(async () => db.kelas.toArray(), [], undefined)

  const data = useMemo(() => {
    const list = rows || []
    return [...list].sort((a, b) => {
      const t = String(a.tingkat || '').localeCompare(String(b.tingkat || ''), undefined, { numeric: true })
      if (t !== 0) return t
      return String(a.nama_sub_kelas || '').localeCompare(String(b.nama_sub_kelas || ''))
    })
  }, [rows])

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
  }
}

