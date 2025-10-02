import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAppRefresh } from '../../../hooks/useAppRefresh'

export function useJenisPembayaran() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('jenis_pembayaran')
      .select(`
        id, kode, nama, deskripsi, jumlah_default, tipe_pembayaran, wajib,
        status_aktif, dibuat_pada, diperbarui_pada, id_tahun_ajaran, tingkat,
        tahun_ajaran:id_tahun_ajaran(id, nama)
      `)
      .order('kode')

    if (queryError) {
      setError('Gagal memuat data: ' + queryError.message)
      return []
    }
    
    return result ?? []
  }, [])

  const refreshData = useCallback(async () => {
    const result = await fetchData()
    setData(result)
  }, [fetchData])

  const handleAppRefresh = useCallback(() => refreshData(), [refreshData])
  useAppRefresh(handleAppRefresh)

  useEffect(() => {
    let ignore = false
    let channel

    async function initializeData() {
      setLoading(true)
      setError('')

      const result = await fetchData()
      
      if (!ignore) {
        setData(result)
        setLoading(false)
      }

      channel = supabase
        .channel('realtime-jenis-pembayaran')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'jenis_pembayaran',
          },
          async () => {
            const { data: refreshedData } = await supabase
              .from('jenis_pembayaran')
              .select(`
                id, kode, nama, deskripsi, jumlah_default, tipe_pembayaran, wajib,
                status_aktif, dibuat_pada, diperbarui_pada, id_tahun_ajaran, tingkat,
                tahun_ajaran:id_tahun_ajaran(id, nama)
              `)
              .order('kode')

            if (!ignore && refreshedData) {
              setData(refreshedData)
            }
          }
        )
        .subscribe((status) => {
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
      if (channel) {
        supabase.removeChannel(channel)
      }
    }
  }, [fetchData])

  const deleteItem = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('jenis_pembayaran')
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
      // Validasi field wajib
      if (!formData.id_tahun_ajaran) {
        throw new Error('Tahun Ajaran wajib dipilih')
      }
      if (!formData.tingkat) {
        throw new Error('Tingkat Kelas wajib dipilih')
      }
      if (!formData.tipe_pembayaran) {
        throw new Error('Tipe Pembayaran wajib dipilih')
      }

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('jenis_pembayaran')
          .update({
            kode: formData.kode,
            nama: formData.nama,
            deskripsi: formData.deskripsi || null,
            jumlah_default: formData.jumlah_default || null,
            tipe_pembayaran: formData.tipe_pembayaran,
            wajib: formData.wajib,
            status_aktif: formData.status_aktif,
            id_tahun_ajaran: formData.id_tahun_ajaran,
            tingkat: formData.tingkat,
            diperbarui_pada: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('jenis_pembayaran')
          .insert({
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
    realtimeStatus,
    error,
    setError,
    deleteItem,
    saveItem,
    refreshData,
  }
}
