import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAppRefresh } from '../../../hooks/useAppRefresh'

export function useRiwayatKelasSiswa() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const [error, setError] = useState('')
  const [siswaList, setSiswaList] = useState([])
  const [kelasList, setKelasList] = useState([])
  const [tahunAjaranList, setTahunAjaranList] = useState([])

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('riwayat_kelas_siswa')
      .select(`
        *,
        siswa:id_siswa(id, nama_lengkap, nisn),
        kelas:id_kelas(
          id, 
          tingkat, 
          nama_sub_kelas,
          riwayat_wali_kelas!riwayat_wali_kelas_id_kelas_fkey(
            id,
            status,
            id_tahun_ajaran,
            wali_kelas:id_wali_kelas(
              id,
              nama_lengkap,
              nip
            )
          )
        ),
        tahun_ajaran:id_tahun_ajaran(id, nama)
      `)
      .order('tanggal_masuk', { ascending: false })

    if (queryError) {
      setError('Gagal memuat data riwayat kelas siswa: ' + queryError.message)
      return []
    }
    
    return result ?? []
  }, [])

  const fetchLookupData = useCallback(async () => {
    const [siswaRes, kelasRes, tahunAjaranRes] = await Promise.all([
      supabase.from('siswa').select('id, nama_lengkap, nisn').eq('status_aktif', true).order('nama_lengkap'),
      supabase.from('kelas').select('id, tingkat, nama_sub_kelas').order('tingkat'),
      supabase.from('tahun_ajaran').select('id, nama').order('nama', { ascending: false })
    ])

    if (!siswaRes.error) setSiswaList(siswaRes.data ?? [])
    if (!kelasRes.error) setKelasList(kelasRes.data ?? [])
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
        .channel('realtime-riwayat-kelas-siswa')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'riwayat_kelas_siswa',
          },
          async (payload) => {
            console.log('Realtime event received:', payload.eventType)
            
            const { data: refreshedData } = await supabase
              .from('riwayat_kelas_siswa')
              .select(`
                *,
                siswa:id_siswa(id, nama_lengkap, nisn),
                kelas:id_kelas(
                  id, 
                  tingkat, 
                  nama_sub_kelas,
                  riwayat_wali_kelas!riwayat_wali_kelas_id_kelas_fkey(
                    id,
                    status,
                    id_tahun_ajaran,
                    wali_kelas:id_wali_kelas(
                      id,
                      nama_lengkap,
                      nip
                    )
                  )
                ),
                tahun_ajaran:id_tahun_ajaran(id, nama)
              `)
              .order('tanggal_masuk', { ascending: false })

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
        .from('riwayat_kelas_siswa')
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
          .from('riwayat_kelas_siswa')
          .update({
            id_siswa: formData.id_siswa,
            id_kelas: formData.id_kelas,
            id_tahun_ajaran: formData.id_tahun_ajaran,
            tanggal_masuk: formData.tanggal_masuk,
            tanggal_keluar: formData.tanggal_keluar || null,
            status: formData.status,
            catatan: formData.catatan || null,
            diperbarui_pada: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('riwayat_kelas_siswa')
          .insert({
            id_siswa: formData.id_siswa,
            id_kelas: formData.id_kelas,
            id_tahun_ajaran: formData.id_tahun_ajaran,
            tanggal_masuk: formData.tanggal_masuk,
            tanggal_keluar: formData.tanggal_keluar || null,
            status: formData.status,
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
    kelasList,
    tahunAjaranList,
  }
}
