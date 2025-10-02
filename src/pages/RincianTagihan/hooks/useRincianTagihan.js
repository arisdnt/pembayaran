import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAppRefresh } from '../../../hooks/useAppRefresh'

export function useRincianTagihan() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const [error, setError] = useState('')
  const [tagihanList, setTagihanList] = useState([])
  const [jenisPembayaranList, setJenisPembayaranList] = useState([])

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('rincian_tagihan')
      .select(`
        *,
        tagihan:id_tagihan(id, nomor_tagihan, judul),
        jenis_pembayaran:id_jenis_pembayaran(id, kode, nama)
      `)
      .order('tanggal_dibuat', { ascending: false })

    if (queryError) {
      setError('Gagal memuat data: ' + queryError.message)
      return []
    }
    
    return result ?? []
  }, [])

  const fetchLookupData = useCallback(async () => {
    const [tagihanRes, jenisRes] = await Promise.all([
      supabase
        .from('tagihan')
        .select('id, nomor_tagihan, judul')
        .order('nomor_tagihan', { ascending: false }),
      supabase
        .from('jenis_pembayaran')
        .select('id, kode, nama, jumlah_default')
        .eq('status_aktif', true)
        .order('kode')
    ])

    if (!tagihanRes.error) setTagihanList(tagihanRes.data ?? [])
    if (!jenisRes.error) setJenisPembayaranList(jenisRes.data ?? [])
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

      await fetchLookupData()
      const result = await fetchData()
      
      if (!ignore) {
        setData(result)
        setLoading(false)
      }

      channel = supabase
        .channel('realtime-rincian-tagihan')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'rincian_tagihan',
          },
          async () => {
            const { data: refreshedData } = await supabase
              .from('rincian_tagihan')
              .select(`
                *,
                tagihan:id_tagihan(id, nomor_tagihan, judul),
                jenis_pembayaran:id_jenis_pembayaran(id, kode, nama)
              `)
              .order('tanggal_dibuat', { ascending: false })

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
  }, [fetchData, fetchLookupData])

  const deleteItem = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('rincian_tagihan')
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
          .from('rincian_tagihan')
          .update({
            id_tagihan: formData.id_tagihan,
            id_jenis_pembayaran: formData.id_jenis_pembayaran,
            deskripsi: formData.deskripsi,
            jumlah: formData.jumlah,
            urutan: formData.urutan,
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('rincian_tagihan')
          .insert({
            id_tagihan: formData.id_tagihan,
            id_jenis_pembayaran: formData.id_jenis_pembayaran,
            deskripsi: formData.deskripsi,
            jumlah: formData.jumlah,
            urutan: formData.urutan,
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
    tagihanList,
    jenisPembayaranList,
  }
}
