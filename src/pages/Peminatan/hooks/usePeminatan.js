import { useEffect, useState, useCallback, useMemo } from 'react'
import { useAppRefresh } from '../../../hooks/useAppRefresh'
import { db } from '../../../offline/db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'
import { generateKodePeminatan } from '../../../offline/actions/peminatan'

export function usePeminatan() {
  const { status } = useOffline()
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [loading, setLoading] = useState(true)

  const [peminatanRows, setPeminatanRows] = useState([])
  const [psRows, setPsRows] = useState([])

  const refreshData = useCallback(async ({ withSpinner = true } = {}) => {
    if (withSpinner) setIsRefreshing(true)
    try {
      const [peminatan, peminatanSiswa] = await Promise.all([
        db.peminatan.toArray(),
        db.peminatan_siswa.toArray(),
      ])
      
      // Sort in JavaScript since 'nama' is not indexed
      peminatan.sort((a, b) => (a.nama || '').localeCompare(b.nama || ''))
      
      setPeminatanRows(peminatan)
      setPsRows(peminatanSiswa)
      setLoading(false)
      return peminatan
    } finally {
      if (withSpinner) setIsRefreshing(false)
    }
  }, [])

  const handleAppRefresh = useCallback(() => refreshData(), [refreshData])
  useAppRefresh(handleAppRefresh)

  useEffect(() => { refreshData({ withSpinner: false }) }, [refreshData])

  const data = useMemo(() => {
    const countMap = new Map()
    psRows.forEach(ps => {
      countMap.set(ps.id_peminatan, (countMap.get(ps.id_peminatan) || 0) + 1)
    })
    return (peminatanRows || []).map(item => ({
      ...item,
      total_siswa: countMap.get(item.id) || 0,
    }))
  }, [peminatanRows, psRows])

  const saveItem = async (formData, isEdit) => {
    // Validasi tingkat min dan max
    const tingkatMin = formData.tingkat_min ? Number(formData.tingkat_min) : null
    const tingkatMax = formData.tingkat_max ? Number(formData.tingkat_max) : null
    
    if (tingkatMin && tingkatMax && tingkatMin > tingkatMax) {
      throw new Error('Tingkat minimum tidak boleh lebih besar dari tingkat maksimum')
    }

    // Generate kode otomatis berdasarkan nama dan tingkat
    let kode = formData.kode
    
    // Generate kode untuk data baru atau jika kode kosong
    if (!isEdit || !kode) {
      kode = await generateKodePeminatan(formData.nama, tingkatMin, tingkatMax)
    }

    const payload = {
      kode: kode,
      nama: formData.nama,
      keterangan: formData.keterangan || null,
      tingkat_min: tingkatMin,
      tingkat_max: tingkatMax,
      aktif: formData.aktif,
    }

    try {
      if (isEdit) {
        await enqueueUpdate('peminatan', formData.id, payload)
      } else {
        await enqueueInsert('peminatan', payload)
      }
      await refreshData({ withSpinner: false })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const deleteItem = async (id) => {
    try {
      await enqueueDelete('peminatan', id)
      await refreshData({ withSpinner: false })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const toggleAktif = async (item) => {
    try {
      await enqueueUpdate('peminatan', item.id, { aktif: !item.aktif })
      await refreshData({ withSpinner: false })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    data,
    loading,
    isRefreshing,
    error,
    setError,
    refreshData,
    saveItem,
    deleteItem,
    toggleAktif,
    realtimeStatus: status.realtime,
  }
}
