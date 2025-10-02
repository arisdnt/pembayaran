import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAppRefresh } from '../../../hooks/useAppRefresh'

export function usePeminatanSiswa() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const [error, setError] = useState('')
  const [siswaList, setSiswaList] = useState([])
  const [peminatanList, setPeminatanList] = useState([])
  const [tahunAjaranList, setTahunAjaranList] = useState([])

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('peminatan_siswa')
      .select(`
        *,
        siswa:id_siswa(id, nama_lengkap, nisn),
        peminatan:id_peminatan(id, kode, nama),
        tahun_ajaran:id_tahun_ajaran(id, nama)
      `)
      .order('tanggal_mulai', { ascending: false })

    if (queryError) {
      setError('Gagal memuat data peminatan siswa: ' + queryError.message)
      return []
    }
    
    return result ?? []
  }, [])

  const fetchLookupData = useCallback(async () => {
    const [siswaRes, peminatanRes, tahunAjaranRes] = await Promise.all([
      supabase.from('siswa').select('id, nama_lengkap, nisn').eq('status_aktif', true).order('nama_lengkap'),
      supabase.from('peminatan').select('id, kode, nama, tingkat_min, tingkat_max').eq('aktif', true).order('nama'),
      supabase.from('tahun_ajaran').select('id, nama').order('nama', { ascending: false })
    ])

    if (!siswaRes.error) setSiswaList(siswaRes.data ?? [])
    if (!peminatanRes.error) setPeminatanList(peminatanRes.data ?? [])
    if (!tahunAjaranRes.error) setTahunAjaranList(tahunAjaranRes.data ?? [])
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
        .channel('realtime-peminatan-siswa')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'peminatan_siswa',
          },
          async (payload) => {
            console.log('Realtime event received:', payload.eventType)
            
            const { data: refreshedData } = await supabase
              .from('peminatan_siswa')
              .select(`
                *,
                siswa:id_siswa(id, nama_lengkap, nisn),
                peminatan:id_peminatan(id, kode, nama),
                tahun_ajaran:id_tahun_ajaran(id, nama)
              `)
              .order('tanggal_mulai', { ascending: false })

            if (!ignore && refreshedData) {
              setData(refreshedData)
            }
          }
        )
        .subscribe((status) => {
          console.log('Realtime status:', status)
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
        .from('peminatan_siswa')
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
          .from('peminatan_siswa')
          .update({
            id_siswa: formData.id_siswa,
            id_peminatan: formData.id_peminatan,
            id_tahun_ajaran: formData.id_tahun_ajaran,
            tingkat: formData.tingkat,
            tanggal_mulai: formData.tanggal_mulai,
            tanggal_selesai: formData.tanggal_selesai || null,
            catatan: formData.catatan || null,
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('peminatan_siswa')
          .insert({
            id_siswa: formData.id_siswa,
            id_peminatan: formData.id_peminatan,
            id_tahun_ajaran: formData.id_tahun_ajaran,
            tingkat: formData.tingkat,
            tanggal_mulai: formData.tanggal_mulai,
            tanggal_selesai: formData.tanggal_selesai || null,
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
    siswaList,
    peminatanList,
    tahunAjaranList,
  }
}
