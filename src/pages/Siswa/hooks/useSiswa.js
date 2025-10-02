import { useEffect, useState, useCallback, useRef } from 'react'
import { supabase } from '../../../lib/supabaseClient'
import { useAppRefresh } from '../../../hooks/useAppRefresh'

let cachedSiswa = null

function calculateTagihanSummary(tagihanList = []) {
  return tagihanList.reduce(
    (acc, tagihan) => {
      const totalTagihan = tagihan.rincian_tagihan?.reduce((sum, item) => sum + Number(item.jumlah || 0), 0) || 0

      const totalDibayar = tagihan.pembayaran?.reduce((sumPembayaran, pembayaran) => {
        const paid = pembayaran.rincian_pembayaran?.reduce(
          (subTotal, rincian) => subTotal + Number(rincian.jumlah_dibayar || 0),
          0,
        ) || 0
        return sumPembayaran + paid
      }, 0) || 0

      const kekurangan = Math.max(totalTagihan - totalDibayar, 0)

      return {
        totalTagihan: acc.totalTagihan + totalTagihan,
        totalDibayar: acc.totalDibayar + totalDibayar,
        totalTunggakan: acc.totalTunggakan + kekurangan,
      }
    },
    { totalTagihan: 0, totalDibayar: 0, totalTunggakan: 0 },
  )
}

export function useSiswa() {
  const [data, setData] = useState(() => cachedSiswa ?? [])
  const [loading, setLoading] = useState(() => !cachedSiswa)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const [error, setError] = useState('')
  const isMountedRef = useRef(true)

  const fetchData = useCallback(async () => {
    const { data: result, error: queryError } = await supabase
      .from('siswa')
      .select(`
        *,
        riwayat_kelas_siswa(
          id,
          status,
          id_tahun_ajaran,
          id_kelas,
          tanggal_masuk,
          kelas:id_kelas(
            id,
            tingkat,
            nama_sub_kelas
          ),
          tahun_ajaran:id_tahun_ajaran(
            id,
            nama
          ),
          tagihan(
            id,
            nomor_tagihan,
            tanggal_tagihan,
            rincian_tagihan(jumlah),
            pembayaran(
              id,
              rincian_pembayaran(jumlah_dibayar)
            )
          )
        )
      `)
      .order('nama_lengkap', { ascending: true })

    if (queryError) {
      setError('Gagal memuat data siswa: ' + queryError.message)
      return []
    }

    const dataWithLatest = (result ?? []).map(siswa => {
      const riwayatAktif = siswa.riwayat_kelas_siswa
        ?.filter(r => r.status === 'aktif')
        .sort((a, b) => new Date(b.tanggal_masuk) - new Date(a.tanggal_masuk))

      const latestRiwayat = riwayatAktif?.[0]

      // Calculate total tagihan, pembayaran, dan tunggakan dari semua riwayat
      const allTagihan = siswa.riwayat_kelas_siswa?.flatMap(r => r.tagihan || []) || []
      const { totalTagihan, totalDibayar, totalTunggakan } = calculateTagihanSummary(allTagihan)

      return {
        ...siswa,
        kelas_terbaru: latestRiwayat?.kelas,
        tahun_ajaran_terbaru: latestRiwayat?.tahun_ajaran,
        total_tagihan: totalTagihan,
        total_dibayar: totalDibayar,
        total_tunggakan: totalTunggakan
      }
    })

    return dataWithLatest
  }, [])

  const applyData = useCallback((result) => {
    const next = Array.isArray(result) ? result : []
    cachedSiswa = next
    setData(next)
  }, [])

  const refreshData = useCallback(
    async ({ withSpinner = true } = {}) => {
      const showInitialSpinner = !cachedSiswa
      const showRefreshIndicator = cachedSiswa && withSpinner

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
    },
    [fetchData, applyData],
  )

  const handleAppRefresh = useCallback(() => refreshData(), [refreshData])
  useAppRefresh(handleAppRefresh)

  useEffect(() => {
    isMountedRef.current = true
    let ignore = false
    let channel

    async function initializeData() {
      await refreshData()

      channel = supabase
        .channel('realtime-siswa')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'siswa',
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
        .from('siswa')
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
        .from('siswa')
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
          'transaksi': 'Transaksi',
          'pembayaran': 'Pembayaran',
          'tagihan': 'Tagihan'
        }
        
        const friendlyTableName = tableNameMap[tableName] || tableName
        
        setError(`Siswa tidak dapat dihapus karena masih memiliki data di tabel "${friendlyTableName}". Hapus data di tabel tersebut terlebih dahulu.`)
      } else {
        setError(err.message)
      }
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      // Generate token akses unik jika tidak ada (untuk siswa baru)
      const tokenAksesUnik = formData.token_akses_unik || 
        `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`

      if (isEdit) {
        const { error: updateError } = await supabase
          .from('siswa')
          .update({
            nama_lengkap: formData.nama_lengkap,
            nisn: formData.nisn || null,
            tanggal_lahir: formData.tanggal_lahir || null,
            jenis_kelamin: formData.jenis_kelamin || null,
            alamat: formData.alamat || null,
            nomor_whatsapp_wali: formData.nomor_whatsapp_wali || null,
            status_aktif: formData.status_aktif,
            diperbarui_pada: new Date().toISOString(),
          })
          .eq('id', formData.id)

        if (updateError) throw updateError
      } else {
        const { error: insertError } = await supabase
          .from('siswa')
          .insert({
            nama_lengkap: formData.nama_lengkap,
            nisn: formData.nisn || null,
            tanggal_lahir: formData.tanggal_lahir || null,
            jenis_kelamin: formData.jenis_kelamin || null,
            alamat: formData.alamat || null,
            nomor_whatsapp_wali: formData.nomor_whatsapp_wali || null,
            token_akses_unik: tokenAksesUnik,
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
