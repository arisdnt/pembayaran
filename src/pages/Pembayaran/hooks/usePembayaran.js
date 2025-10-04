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
    // Sort in JavaScript since 'tanggal_dibuat' is not indexed
    data.sort((a, b) => {
      const dateA = new Date(a.tanggal_dibuat || 0)
      const dateB = new Date(b.tanggal_dibuat || 0)
      return dateB - dateA  // Descending order (newest first)
    })
    return data
  }, [], undefined)
  const rincianPembayaran = useLiveQuery(async () => db.rincian_pembayaran.toArray(), [], undefined)
  const tagihan = useLiveQuery(async () => db.tagihan.toArray(), [], undefined)
  const rks = useLiveQuery(async () => db.riwayat_kelas_siswa.toArray(), [], undefined)
  const siswa = useLiveQuery(async () => db.siswa.toArray(), [], undefined)

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
    const tagihanMap = new Map((tagihan || []).map(t => [t.id, t]))
    const rksMap = new Map((rks || []).map(r => [r.id, r]))
    const siswaMap = new Map((siswa || []).map(s => [s.id, s]))
    return (pembayaran || []).map(p => {
      const rp = rincianByPembayaran.get(p.id) || []
      const total_dibayar = rp.reduce((sum, it) => sum + Number(it.jumlah_dibayar || 0), 0)
      const t = tagihanMap.get(p.id_tagihan) || null
      const r = t ? rksMap.get(t.id_riwayat_kelas_siswa) || null : null
      const s = r ? siswaMap.get(r.id_siswa) || null : null
      return {
        ...p,
        rincian_pembayaran: rp,
        total_dibayar,
        tagihan: t && {
          id: t.id,
          nomor_tagihan: t.nomor_tagihan,
          judul: t.judul,
          riwayat_kelas_siswa: r && {
            siswa: s && { nama_lengkap: s.nama_lengkap, nisn: s.nisn },
          },
        },
      }
    })
  }, [pembayaran, rincianPembayaran, tagihan, rks, siswa])

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
