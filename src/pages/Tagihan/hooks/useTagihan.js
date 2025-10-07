import { useMemo, useState, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../offline/db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'

export function useTagihan() {
  const { status } = useOffline()
  const [error, setError] = useState('')

  const tagihan = useLiveQuery(async () => db.tagihan.orderBy('tanggal_tagihan').reverse().toArray(), [], undefined)
  const rks = useLiveQuery(async () => db.riwayat_kelas_siswa.toArray(), [], undefined)
  const kelas = useLiveQuery(async () => db.kelas.toArray(), [], undefined)
  const tahun = useLiveQuery(async () => db.tahun_ajaran.toArray(), [], undefined)
  const siswa = useLiveQuery(async () => db.siswa.toArray(), [], undefined)
  const rincianTagihan = useLiveQuery(async () => db.rincian_tagihan.toArray(), [], undefined)
  const pembayaran = useLiveQuery(async () => db.pembayaran.toArray(), [], undefined)
  const rincianPembayaran = useLiveQuery(async () => db.rincian_pembayaran.toArray(), [], undefined)

  const rksList = useMemo(() => {
    const sMap = new Map((siswa || []).map(s => [s.id, s]))
    const kMap = new Map((kelas || []).map(k => [k.id, k]))
    const tMap = new Map((tahun || []).map(t => [t.id, t]))
    return (rks || []).map(r => ({
      id: r.id,
      id_siswa: r.id_siswa,
      tanggal_masuk: r.tanggal_masuk,
      tanggal_keluar: r.tanggal_keluar,
      siswa: sMap.get(r.id_siswa) ? { id: r.id_siswa, nama_lengkap: sMap.get(r.id_siswa).nama_lengkap, nisn: sMap.get(r.id_siswa).nisn } : null,
      kelas: kMap.get(r.id_kelas) ? { id: r.id_kelas, tingkat: kMap.get(r.id_kelas).tingkat, nama_sub_kelas: kMap.get(r.id_kelas).nama_sub_kelas } : null,
      tahun_ajaran: tMap.get(r.id_tahun_ajaran) ? { id: r.id_tahun_ajaran, nama: tMap.get(r.id_tahun_ajaran).nama } : null,
    }))
  }, [rks, siswa, kelas, tahun])

  const data = useMemo(() => {
    const rksMap = new Map(rksList.map(x => [x.id, x]))
    const rincianByTagihan = new Map((rincianTagihan || []).reduce((acc, r) => {
      const arr = acc.get(r.id_tagihan) || []
      arr.push(r)
      acc.set(r.id_tagihan, arr)
      return acc
    }, new Map()))
    const pembayaranByTagihan = new Map((pembayaran || []).reduce((acc, p) => {
      const arr = acc.get(p.id_tagihan) || []
      arr.push(p)
      acc.set(p.id_tagihan, arr)
      return acc
    }, new Map()))
    const rincianPembayaranByPembayaran = new Map((rincianPembayaran || []).reduce((acc, rp) => {
      const arr = acc.get(rp.id_pembayaran) || []
      arr.push(rp)
      acc.set(rp.id_pembayaran, arr)
      return acc
    }, new Map()))

    return (tagihan || []).map(t => {
      const metaRks = rksMap.get(t.id_riwayat_kelas_siswa) || null
      const rList = rincianByTagihan.get(t.id) || []
      const total_tagihan = rList.reduce((sum, it) => sum + Number(it.jumlah || 0), 0)
      const pList = pembayaranByTagihan.get(t.id) || []
      let total_dibayar = 0
      for (const p of pList) {
        const rp = rincianPembayaranByPembayaran.get(p.id) || []
        total_dibayar += rp.reduce((sum, it) => sum + Number(it.jumlah_dibayar || 0), 0)
      }
      const kekurangan = total_tagihan - total_dibayar
      return {
        ...t,
        riwayat_kelas_siswa: metaRks,
        total_tagihan,
        total_dibayar,
        kekurangan,
      }
    })
  }, [tagihan, rksList, rincianTagihan, pembayaran, rincianPembayaran])

  const tingkatList = useMemo(() => {
    return Array.from(new Set((kelas || []).map(k => k.tingkat).filter(Boolean))).sort()
  }, [kelas])
  const kelasList = useMemo(() => (kelas || []).map(k => ({ id: k.id, tingkat: k.tingkat, nama_sub_kelas: k.nama_sub_kelas })), [kelas])
  const tahunAjaranList = useMemo(() => (tahun || []).map(t => ({ id: t.id, nama: t.nama })), [tahun])

  const refreshData = useCallback(async () => data, [data])

  const deleteItem = async (id) => {
    try {
      await enqueueDelete('tagihan', id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      if (isEdit) {
        await enqueueUpdate('tagihan', formData.id, {
          id_riwayat_kelas_siswa: formData.id_riwayat_kelas_siswa,
          nomor_tagihan: formData.nomor_tagihan,
          judul: formData.judul,
          deskripsi: formData.deskripsi || null,
          tanggal_tagihan: formData.tanggal_tagihan,
          tanggal_jatuh_tempo: formData.tanggal_jatuh_tempo,
        })
      } else {
        await enqueueInsert('tagihan', {
          id_riwayat_kelas_siswa: formData.id_riwayat_kelas_siswa,
          nomor_tagihan: formData.nomor_tagihan,
          judul: formData.judul,
          deskripsi: formData.deskripsi || null,
          tanggal_tagihan: formData.tanggal_tagihan,
          tanggal_jatuh_tempo: formData.tanggal_jatuh_tempo,
        })
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    data,
    loading: tagihan === undefined,
    realtimeStatus: status.realtime,
    error,
    setError,
    deleteItem,
    saveItem,
    refreshData,
    riwayatKelasSiswaList: rksList,
    tingkatList,
    kelasList,
    tahunAjaranList,
  }
}
