import { useMemo, useState, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../offline/db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'

export function usePembayaran() {
  const { status } = useOffline()
  const [error, setError] = useState('')

  const pembayaran = useLiveQuery(async () => {
    const data = await db.pembayaran.toArray()
    // Sort in JavaScript since 'diperbarui_pada' is not indexed
    data.sort((a, b) => {
      const dateA = new Date(a.diperbarui_pada || 0)
      const dateB = new Date(b.diperbarui_pada || 0)
      return dateB - dateA  // Descending order (newest first)
    })
    return data
  }, [], undefined)
  const rincianPembayaran = useLiveQuery(async () => db.rincian_pembayaran.toArray(), [], undefined)
  const tagihan = useLiveQuery(async () => db.tagihan.toArray(), [], undefined)
  const rincianTagihan = useLiveQuery(async () => db.rincian_tagihan.toArray(), [], undefined)
  const rks = useLiveQuery(async () => db.riwayat_kelas_siswa.toArray(), [], undefined)
  const siswa = useLiveQuery(async () => db.siswa.toArray(), [], undefined)
  const kelas = useLiveQuery(async () => db.kelas.toArray(), [], undefined)
  const tahunAjaran = useLiveQuery(async () => db.tahun_ajaran.toArray(), [], undefined)

  const tagihanList = useMemo(() => {
    const sMap = new Map((siswa || []).map(s => [s.id, s]))
    const rMap = new Map((rks || []).map(r => [r.id, r]))
    return (tagihan || []).map(t => ({
      id: t.id,
      nomor_tagihan: t.nomor_tagihan,
      judul: t.judul,
      riwayat_kelas_siswa: rMap.get(t.id_riwayat_kelas_siswa) ? {
        siswa: sMap.get(rMap.get(t.id_riwayat_kelas_siswa).id_siswa) ? { nama_lengkap: sMap.get(rMap.get(t.id_riwayat_kelas_siswa).id_siswa).nama_lengkap } : null
      } : null
    }))
  }, [tagihan, rks, siswa])

  const data = useMemo(() => {
    const rincianByPembayaran = new Map((rincianPembayaran || []).reduce((acc, rp) => {
      const arr = acc.get(rp.id_pembayaran) || []
      arr.push(rp)
      acc.set(rp.id_pembayaran, arr)
      return acc
    }, new Map()))
    
    // Map rincian tagihan by tagihan id
    const rincianByTagihan = new Map((rincianTagihan || []).reduce((acc, rt) => {
      const arr = acc.get(rt.id_tagihan) || []
      arr.push(rt)
      acc.set(rt.id_tagihan, arr)
      return acc
    }, new Map()))
    
    const tagihanMap = new Map((tagihan || []).map(t => [t.id, t]))
    const rksMap = new Map((rks || []).map(r => [r.id, r]))
    const siswaMap = new Map((siswa || []).map(s => [s.id, s]))
    const kelasMap = new Map((kelas || []).map(k => [k.id, k]))
    const tahunAjaranMap = new Map((tahunAjaran || []).map(ta => [ta.id, ta]))
    
    // Group pembayaran by tagihan for historical calculation
    const pembayaranByTagihan = new Map()
    ;(pembayaran || []).forEach(p => {
      if (!pembayaranByTagihan.has(p.id_tagihan)) {
        pembayaranByTagihan.set(p.id_tagihan, [])
      }
      pembayaranByTagihan.get(p.id_tagihan).push(p)
    })
    
    // Sort pembayaran by date within each tagihan
    pembayaranByTagihan.forEach(payments => {
      payments.sort((a, b) => {
        const dateA = new Date(a.dibuat_pada || a.diperbarui_pada || 0)
        const dateB = new Date(b.dibuat_pada || b.diperbarui_pada || 0)
        return dateA - dateB  // Ascending (oldest first)
      })
    })
    
    return (pembayaran || []).map(p => {
      const rp = rincianByPembayaran.get(p.id) || []
      const total_dibayar = rp.reduce((sum, it) => sum + Number(it.jumlah_dibayar || 0), 0)
      const t = tagihanMap.get(p.id_tagihan) || null
      const r = t ? rksMap.get(t.id_riwayat_kelas_siswa) || null : null
      const s = r ? siswaMap.get(r.id_siswa) || null : null
      const kelasTagihan = r ? kelasMap.get(r.id_kelas) || null : null
      const tahunAjaranTagihan = r ? tahunAjaranMap.get(r.id_tahun_ajaran) || null : null
      
      // Calculate total tagihan from rincian_tagihan
      const rincianList = rincianByTagihan.get(p.id_tagihan) || []
      const total_tagihan = rincianList.reduce((sum, it) => sum + Number(it.jumlah || 0), 0)
      
      // Calculate historical payment data
      const allPembayaranForTagihan = pembayaranByTagihan.get(p.id_tagihan) || []
      const currentIndex = allPembayaranForTagihan.findIndex(payment => payment.id === p.id)
      
      // Sum all payments BEFORE this one (excluding current)
      let total_dibayar_sebelumnya = 0
      for (let i = 0; i < currentIndex; i++) {
        const prevPayment = allPembayaranForTagihan[i]
        const prevRincian = rincianByPembayaran.get(prevPayment.id) || []
        total_dibayar_sebelumnya += prevRincian.reduce((sum, it) => sum + Number(it.jumlah_dibayar || 0), 0)
      }
      
      // Sum all payments UP TO AND INCLUDING this one
      const total_dibayar_sampai_ini = total_dibayar_sebelumnya + total_dibayar
      
      // Calculate remaining
      const sisa_tagihan = total_tagihan - total_dibayar_sampai_ini
      
      return {
        ...p,
        rincian_pembayaran: rp,
        total_dibayar,
        total_tagihan,
        total_dibayar_sebelumnya,
        total_dibayar_sampai_ini,
        sisa_tagihan,
        tagihan: t && {
          id: t.id,
          nomor_tagihan: t.nomor_tagihan,
          judul: t.judul,
          riwayat_kelas_siswa: r && {
            id: r.id,
            id_kelas: r.id_kelas,
            id_tahun_ajaran: r.id_tahun_ajaran,
            siswa: s && { id: s.id, nama_lengkap: s.nama_lengkap, nisn: s.nisn },
            kelas: kelasTagihan && {
              id: kelasTagihan.id,
              tingkat: kelasTagihan.tingkat,
              nama_sub_kelas: kelasTagihan.nama_sub_kelas,
            },
            tahun_ajaran: tahunAjaranTagihan && {
              id: tahunAjaranTagihan.id,
              nama: tahunAjaranTagihan.nama,
            },
          },
        },
        kelas_tagihan: kelasTagihan && {
          id: kelasTagihan.id,
          tingkat: kelasTagihan.tingkat,
          nama_sub_kelas: kelasTagihan.nama_sub_kelas,
        },
        tahun_ajaran_tagihan: tahunAjaranTagihan && {
          id: tahunAjaranTagihan.id,
          nama: tahunAjaranTagihan.nama,
        },
      }
    })
  }, [pembayaran, rincianPembayaran, rincianTagihan, tagihan, rks, siswa, kelas, tahunAjaran])

  const refreshData = useCallback(async () => data, [data])

  const deleteItem = async (id) => {
    try {
      await enqueueDelete('pembayaran', id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      if (isEdit) {
        await enqueueUpdate('pembayaran', formData.id, {
          id_tagihan: formData.id_tagihan,
          nomor_pembayaran: formData.nomor_pembayaran,
          catatan: formData.catatan || null,
        })
      } else {
        await enqueueInsert('pembayaran', {
          id_tagihan: formData.id_tagihan,
          nomor_pembayaran: formData.nomor_pembayaran,
          catatan: formData.catatan || null,
        })
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    data,
    loading: pembayaran === undefined,
    realtimeStatus: status.realtime,
    error,
    setError,
    deleteItem,
    saveItem,
    refreshData,
    tagihanList,
  }
}
