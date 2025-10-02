import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAppRefresh } from '../../../hooks/useAppRefresh'

let cachedPeminatan = null

export function usePeminatan() {
  const [data, setData] = useState(() => cachedPeminatan ?? [])
  const [loading, setLoading] = useState(() => !cachedPeminatan)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('peminatan')
      .select()
      .order('nama', { ascending: true })

    if (queryError) {
      setError('Gagal memuat data peminatan: ' + queryError.message)
      return []
    }

    return (result ?? []).map((item) => ({
      ...item,
      total_siswa: item.peminatan_siswa?.length || 0,
    }))
  }, [])

  const refreshData = useCallback(async ({ withSpinner = true } = {}) => {
    const showInitialSpinner = !cachedPeminatan
    const showRefreshIndicator = cachedPeminatan && withSpinner

    if (showInitialSpinner) {
      setLoading(true)
    }
    if (showRefreshIndicator) {
      setIsRefreshing(true)
    }

    setError('')

    try {
      const result = await fetchData()
      cachedPeminatan = result
      setData(result)
      return result
    } finally {
      if (showInitialSpinner) {
        setLoading(false)
      }
      if (showRefreshIndicator) {
        setIsRefreshing(false)
      }
    }
  }, [fetchData])

  const handleAppRefresh = useCallback(() => refreshData(), [refreshData])
  useAppRefresh(handleAppRefresh)

  useEffect(() => {
    let ignore = false
    const channels = []

    async function initialize() {
      await refreshData({ withSpinner: false })

      const mainChannel = supabase
        .channel('realtime-peminatan')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'peminatan' },
          async () => {
            if (ignore) return
            await refreshData({ withSpinner: false })
          }
        )
        .subscribe()

      const assignmentChannel = supabase
        .channel('realtime-peminatan-siswa')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'peminatan_siswa' },
          async () => {
            if (ignore) return
            await refreshData({ withSpinner: false })
          }
        )
        .subscribe()

      channels.push(mainChannel, assignmentChannel)
    }

    initialize()

    return () => {
      ignore = true
      channels.forEach((channel) => {
        if (channel) supabase.removeChannel(channel)
      })
    }
  }, [refreshData])

  const saveItem = async (formData, isEdit) => {
    const payload = {
      kode: formData.kode,
      nama: formData.nama,
      keterangan: formData.keterangan || null,
      tingkat_min: formData.tingkat_min ? Number(formData.tingkat_min) : null,
      tingkat_max: formData.tingkat_max ? Number(formData.tingkat_max) : null,
      aktif: formData.aktif,
    }

    if (payload.tingkat_min && payload.tingkat_max && payload.tingkat_min > payload.tingkat_max) {
      throw new Error('Tingkat minimum tidak boleh lebih besar dari tingkat maksimum')
    }

    if (isEdit) {
      const { error: updateError } = await supabase
        .from('peminatan')
        .update(payload)
        .eq('id', formData.id)

      if (updateError) throw updateError
    } else {
      const { error: insertError } = await supabase
        .from('peminatan')
        .insert(payload)

      if (insertError) throw insertError
    }

    await refreshData()
  }

  const deleteItem = async (id) => {
    const { error: deleteError } = await supabase
      .from('peminatan')
      .delete()
      .eq('id', id)

    if (deleteError) throw deleteError

    if (cachedPeminatan) {
      cachedPeminatan = cachedPeminatan.filter((item) => item.id !== id)
    }

    await refreshData({ withSpinner: false })
  }

  const toggleAktif = async (item) => {
    const { error: updateError } = await supabase
      .from('peminatan')
      .update({ aktif: !item.aktif })
      .eq('id', item.id)

    if (updateError) throw updateError

    await refreshData({ withSpinner: false })
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
  }
}