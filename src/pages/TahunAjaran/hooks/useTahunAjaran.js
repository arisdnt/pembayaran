import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAppRefresh } from '../../../hooks/useAppRefresh'

let cachedTahunAjaran = null

export function useTahunAjaran() {
  const [data, setData] = useState(() => cachedTahunAjaran ?? [])
  const [loading, setLoading] = useState(() => !cachedTahunAjaran)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const [error, setError] = useState('')
  const isMountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('tahun_ajaran')
      .select(`
        *,
        riwayat_kelas_siswa(
          id
        )
      `)
      .order('tanggal_mulai', { ascending: false })

    if (queryError) {
      setError('Gagal memuat data tahun ajaran: ' + queryError.message)
      return []
    }
    
    const dataWithCount = (result ?? []).map(item => ({
      ...item,
      total_siswa: item.riwayat_kelas_siswa?.length || 0
    }))
    
    return dataWithCount
  }, [])

  const applyData = useCallback((result) => {
    const next = Array.isArray(result) ? result : []
    cachedTahunAjaran = next
    setData(next)
  }, [])

  const refreshData = useCallback(async ({ withSpinner = true } = {}) => {
    const showInitialSpinner = !cachedTahunAjaran
    const showRefreshIndicator = cachedTahunAjaran && withSpinner

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
        .channel('realtime-tahun-ajaran')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tahun_ajaran',
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
      if (!item.status_aktif) {
        await supabase
          .from('tahun_ajaran')
          .update({ status_aktif: false })
          .neq('id', item.id)
      }

      const { error: updateError } = await supabase
        .from('tahun_ajaran')
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
        .from('tahun_ajaran')
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
      if (formData.status_aktif) {
        await supabase
          .from('tahun_ajaran')
          .update({ status_aktif: false })
          .neq('id', formData.id || '00000000-0000-0000-0000-000000000000')
      }

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('tahun_ajaran')
          .update({
            nama: formData.nama,
            tanggal_mulai: formData.tanggal_mulai,
            tanggal_selesai: formData.tanggal_selesai,
            status_aktif: formData.status_aktif,
            diperbarui_pada: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('tahun_ajaran')
          .insert({
            nama: formData.nama,
            tanggal_mulai: formData.tanggal_mulai,
            tanggal_selesai: formData.tanggal_selesai,
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
