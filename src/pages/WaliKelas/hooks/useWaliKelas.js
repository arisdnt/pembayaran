import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAppRefresh } from '../../../hooks/useAppRefresh'

let cachedWaliKelas = null

export function useWaliKelas() {
  const [data, setData] = useState(() => cachedWaliKelas ?? [])
  const [loading, setLoading] = useState(() => !cachedWaliKelas)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const [error, setError] = useState('')
  const isMountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('wali_kelas')
      .select('*')
      .order('nama_lengkap', { ascending: true })

    if (queryError) {
      setError('Gagal memuat data wali kelas: ' + queryError.message)
      return []
    }
    
    return result ?? []
  }, [])

  const applyData = useCallback((result) => {
    const next = Array.isArray(result) ? result : []
    cachedWaliKelas = next
    setData(next)
  }, [])

  const refreshData = useCallback(async ({ withSpinner = true } = {}) => {
    const showInitialSpinner = !cachedWaliKelas
    const showRefreshIndicator = cachedWaliKelas && withSpinner

    if (showInitialSpinner) {
      setLoading(true)
    }
    if (showRefreshIndicator) {
      setIsRefreshing(true)
    }

    if (withSpinner) {
      setError('')
    }

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
        .channel('realtime-wali-kelas')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'wali_kelas',
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

  const toggleStatus = async (item) => {
    try {
      const { error: updateError } = await supabase
        .from('wali_kelas')
        .update({
          status_aktif: !item.status_aktif,
          diperbarui_pada: new Date().toISOString(),
        })
        .eq('id', item.id)

      if (updateError) throw updateError

      await refreshData()
    } catch (err) {
      setError(err.message)
    }
  }

  const deleteItem = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('wali_kelas')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      await refreshData()
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      if (isEdit) {
        const { error: updateError } = await supabase
          .from('wali_kelas')
          .update({
            nama_lengkap: formData.nama_lengkap,
            nip: formData.nip || null,
            nomor_telepon: formData.nomor_telepon || null,
            email: formData.email || null,
            status_aktif: formData.status_aktif,
            diperbarui_pada: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('wali_kelas')
          .insert({
            nama_lengkap: formData.nama_lengkap,
            nip: formData.nip || null,
            nomor_telepon: formData.nomor_telepon || null,
            email: formData.email || null,
            status_aktif: formData.status_aktif,
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
    toggleStatus,
    deleteItem,
    saveItem,
    refreshData,
  }
}
