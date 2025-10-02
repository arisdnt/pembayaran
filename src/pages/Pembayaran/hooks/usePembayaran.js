import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAppRefresh } from '../../../hooks/useAppRefresh'

export function usePembayaran() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const [error, setError] = useState('')
  const [tagihanList, setTagihanList] = useState([])

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('pembayaran')
      .select(`
        *,
        tagihan:id_tagihan(
          id, 
          nomor_tagihan, 
          judul,
          riwayat_kelas_siswa:id_riwayat_kelas_siswa(
            siswa:id_siswa(nama_lengkap, nisn)
          )
        ),
        rincian_pembayaran(jumlah_dibayar)
      `)
      .order('tanggal_dibuat', { ascending: false })

    if (queryError) {
      setError('Gagal memuat data: ' + queryError.message)
      return []
    }
    
    // Calculate total pembayaran for each item
    const dataWithTotals = (result ?? []).map(item => ({
      ...item,
      total_dibayar: (item.rincian_pembayaran || []).reduce(
        (sum, r) => sum + parseFloat(r.jumlah_dibayar || 0), 
        0
      )
    }))
    
    return dataWithTotals
  }, [])

  const fetchTagihanList = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('tagihan')
      .select(`
        id, 
        nomor_tagihan, 
        judul,
        riwayat_kelas_siswa:id_riwayat_kelas_siswa(
          siswa:id_siswa(nama_lengkap)
        )
      `)
      .order('nomor_tagihan', { ascending: false })

    if (!queryError) {
      setTagihanList(result ?? [])
    }
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

      await fetchTagihanList()
      const result = await fetchData()
      
      if (!ignore) {
        setData(result)
        setLoading(false)
      }

      channel = supabase
        .channel('realtime-pembayaran')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'pembayaran',
          },
          async () => {
            const { data: refreshedData } = await supabase
              .from('pembayaran')
              .select(`
                *,
                tagihan:id_tagihan(
                  id, 
                  nomor_tagihan, 
                  judul,
                  riwayat_kelas_siswa:id_riwayat_kelas_siswa(
                    siswa:id_siswa(nama_lengkap, nisn)
                  )
                )
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
  }, [fetchData, fetchTagihanList])

  const deleteItem = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('pembayaran')
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
          .from('pembayaran')
          .update({
            id_tagihan: formData.id_tagihan,
            nomor_pembayaran: formData.nomor_pembayaran,
            catatan: formData.catatan || null,
            diperbarui_pada: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('pembayaran')
          .insert({
            id_tagihan: formData.id_tagihan,
            nomor_pembayaran: formData.nomor_pembayaran,
            catatan: formData.catatan || null,
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
  }
}
