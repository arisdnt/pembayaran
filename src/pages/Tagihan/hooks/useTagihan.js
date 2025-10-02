import { useEffect, useState, useCallback } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAppRefresh } from '../../../hooks/useAppRefresh'

export function useTagihan() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const [error, setError] = useState('')
  const [riwayatKelasSiswaList, setRiwayatKelasSiswaList] = useState([])
  const [tingkatList, setTingkatList] = useState([])
  const [kelasList, setKelasList] = useState([])
  const [tahunAjaranList, setTahunAjaranList] = useState([])

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('tagihan')
      .select(`
        *,
        riwayat_kelas_siswa:id_riwayat_kelas_siswa(
          id,
          siswa:id_siswa(id, nama_lengkap, nisn),
          kelas:id_kelas(id, tingkat, nama_sub_kelas),
          tahun_ajaran:id_tahun_ajaran(id, nama)
        ),
        rincian_tagihan(jumlah)
      `)
      .order('tanggal_tagihan', { ascending: false })

    if (queryError) {
      setError('Gagal memuat data: ' + queryError.message)
      return []
    }
    
    // Calculate total, dibayar, and kekurangan for each tagihan
    const dataWithCalculations = await Promise.all((result ?? []).map(async (item) => {
      const total_tagihan = item.rincian_tagihan?.reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0) || 0
      
      // Get all payment data (no status filter - all payments are considered paid)
      const { data: pembayaranData } = await supabase
        .from('pembayaran')
        .select(`
          id,
          rincian_pembayaran(jumlah_dibayar)
        `)
        .eq('id_tagihan', item.id)
      
      // Calculate total dibayar (all payments are counted)
      const total_dibayar = (pembayaranData ?? []).reduce((sum, p) => {
        return sum + (p.rincian_pembayaran?.reduce((subSum, rp) => 
          subSum + parseFloat(rp.jumlah_dibayar || 0), 0) || 0)
      }, 0)
      
      // Kekurangan
      const kekurangan = total_tagihan - total_dibayar
      
      return {
        ...item,
        total_tagihan,
        total_dibayar,
        kekurangan
      }
    }))
    
    return dataWithCalculations
  }, [])

  const fetchRiwayatKelasSiswaList = useCallback(async () => {
    const [riwayatRes, kelasRes, tahunRes] = await Promise.all([
      supabase
        .from('riwayat_kelas_siswa')
        .select(`
          id,
          siswa:id_siswa(id, nama_lengkap, nisn),
          kelas:id_kelas(id, tingkat, nama_sub_kelas),
          tahun_ajaran:id_tahun_ajaran(id, nama)
        `),
      supabase.from('kelas').select('id, tingkat, nama_sub_kelas').order('tingkat'),
      supabase.from('tahun_ajaran').select('id, nama').order('nama', { ascending: false })
    ])

    if (!riwayatRes.error) {
      const data = riwayatRes.data ?? []
      setRiwayatKelasSiswaList(data)
    }
    
    if (!kelasRes.error) {
      const kelasData = kelasRes.data ?? []
      setKelasList(kelasData)
      
      // Extract unique tingkat from kelas table
      const uniqueTingkat = [...new Set(kelasData.map(k => k.tingkat).filter(Boolean))]
      setTingkatList(uniqueTingkat.sort())
    }
    
    if (!tahunRes.error) setTahunAjaranList(tahunRes.data ?? [])
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

      await fetchRiwayatKelasSiswaList()
      const result = await fetchData()
      
      if (!ignore) {
        setData(result)
        setLoading(false)
      }

      channel = supabase
        .channel('realtime-tagihan')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'tagihan',
          },
          async () => {
            const { data: refreshedData } = await supabase
              .from('tagihan')
              .select(`
                *,
                riwayat_kelas_siswa:id_riwayat_kelas_siswa(
                  id,
                  siswa:id_siswa(id, nama_lengkap, nisn),
                  kelas:id_kelas(id, tingkat, nama_sub_kelas),
                  tahun_ajaran:id_tahun_ajaran(id, nama)
                ),
                rincian_tagihan(jumlah)
              `)
              .order('tanggal_tagihan', { ascending: false })

            if (!ignore && refreshedData) {
              const dataWithCalculations = await Promise.all(refreshedData.map(async (item) => {
                const total_tagihan = item.rincian_tagihan?.reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0) || 0
                
                const { data: pembayaranData } = await supabase
                  .from('pembayaran')
                  .select(`
                    id,
                    rincian_pembayaran(jumlah_dibayar)
                  `)
                  .eq('id_tagihan', item.id)
                
                const total_dibayar = (pembayaranData ?? []).reduce((sum, p) => {
                  return sum + (p.rincian_pembayaran?.reduce((subSum, rp) => 
                    subSum + parseFloat(rp.jumlah_dibayar || 0), 0) || 0)
                }, 0)
                
                const kekurangan = total_tagihan - total_dibayar
                
                return {
                  ...item,
                  total_tagihan,
                  total_dibayar,
                  kekurangan
                }
              }))
              setData(dataWithCalculations)
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
  }, [fetchData, fetchRiwayatKelasSiswaList])

  const deleteItem = async (id) => {
    try {
      const { error: deleteError } = await supabase
        .from('tagihan')
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
          .from('tagihan')
          .update({
            id_riwayat_kelas_siswa: formData.id_riwayat_kelas_siswa,
            nomor_tagihan: formData.nomor_tagihan,
            judul: formData.judul,
            deskripsi: formData.deskripsi || null,
            tanggal_tagihan: formData.tanggal_tagihan,
            tanggal_jatuh_tempo: formData.tanggal_jatuh_tempo,
            tanggal_diperbarui: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('tagihan')
          .insert({
            id_riwayat_kelas_siswa: formData.id_riwayat_kelas_siswa,
            nomor_tagihan: formData.nomor_tagihan,
            judul: formData.judul,
            deskripsi: formData.deskripsi || null,
            tanggal_tagihan: formData.tanggal_tagihan,
            tanggal_jatuh_tempo: formData.tanggal_jatuh_tempo,
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
    riwayatKelasSiswaList,
    tingkatList,
    kelasList,
    tahunAjaranList,
  }
}
