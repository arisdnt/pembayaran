import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAppRefresh } from '../../../hooks/useAppRefresh'

let cachedKelas = null

export function useKelas() {
  const [data, setData] = useState(() => cachedKelas ?? [])
  const [loading, setLoading] = useState(() => !cachedKelas)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const [error, setError] = useState('')
  const isMountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('kelas')
      .select('*')
      .order('tingkat', { ascending: true })
      .order('nama_sub_kelas', { ascending: true })

    if (queryError) {
      setError('Gagal memuat data kelas: ' + queryError.message)
      return []
    }
    
    return result ?? []
  }, [])

  const applyData = useCallback((result) => {
    const next = Array.isArray(result) ? result : []
    cachedKelas = next
    setData(next)
  }, [])

  const refreshData = useCallback(async ({ withSpinner = true } = {}) => {
    const showInitialSpinner = !cachedKelas
    const showRefreshIndicator = cachedKelas && withSpinner

    if (showInitialSpinner) {
      setLoading(true)
    }
    if (showRefreshIndicator) {
      setIsRefreshing(true)
    }

    setError('')

    try {
      const result = await fetchData()
      if (isMountedRef.current) {
        applyData(result)
      }
      return result
    } finally {
      if (isMountedRef.current) {
        if (showInitialSpinner) {
          setLoading(false)
        }
        if (showRefreshIndicator) {
          setIsRefreshing(false)
        }
      }
    }
  }, [fetchData, applyData])

  const handleAppRefresh = useCallback(() => refreshData(), [refreshData])
  useAppRefresh(handleAppRefresh)

  useEffect(() => {
    isMountedRef.current = true
    let ignore = false
    let channel

    async function initializeData() {
      await refreshData()

      channel = supabase
        .channel('realtime-kelas')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'kelas',
          },
          async (payload) => {
            console.log('Realtime event received:', payload.eventType)
            if (ignore) return
            await refreshData({ withSpinner: false })
          }
        )
        .subscribe((status) => {
          console.log('Realtime status:', status)
          if (!isMountedRef.current) return
          if (status === 'SUBSCRIBED') {
            setRealtimeStatus('connected')
          }
          if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') {
            setRealtimeStatus('disconnected')
          }
        })
    }

    initializeData()

    return () => {
      ignore = true
      isMountedRef.current = false
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [refreshData])

  const deleteItem = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('kelas')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      await refreshData()
    } catch (err) {
      // Deteksi error foreign key constraint
      const errorMessage = err.message || ''
      
      if (errorMessage.includes('violates foreign key constraint')) {
        // Parse nama tabel dari error message
        const tableMatch = errorMessage.match(/on table "([^"]+)"/)
        const tableName = tableMatch ? tableMatch[1] : 'tabel terkait'
        
        // Mapping nama tabel ke nama yang lebih user-friendly
        const tableNameMap = {
          'riwayat_kelas_siswa': 'Riwayat Kelas Siswa',
          'tagihan': 'Tagihan',
          'transaksi': 'Transaksi',
          'pembayaran': 'Pembayaran'
        }
        
        const friendlyTableName = tableNameMap[tableName] || tableName
        
        setError(`Kelas tidak dapat dihapus karena masih memiliki data di tabel "${friendlyTableName}". Hapus data di tabel tersebut terlebih dahulu.`)
      } else {
        setError(err.message)
      }
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      if (isEdit) {
        const { error: updateError } = await supabase
          .from('kelas')
          .update({
            tingkat: formData.tingkat,
            nama_sub_kelas: formData.nama_sub_kelas,
            kapasitas_maksimal: formData.kapasitas_maksimal || null,
            diperbarui_pada: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('kelas')
          .insert({
            tingkat: formData.tingkat,
            nama_sub_kelas: formData.nama_sub_kelas,
            kapasitas_maksimal: formData.kapasitas_maksimal || null,
          })

        if (insertError) throw insertError
      }

      await refreshData()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    data,
    loading,
    isRefreshing,
    realtimeStatus,
    error,
    setError,
    deleteItem,
    saveItem,
    refreshData,
  }
}
