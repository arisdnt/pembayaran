import { useEffect, useState, useCallback, useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../offline/db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'

export function useRincianTagihan() {
  const { status } = useOffline()
  const [error, setError] = useState('')

  const rt = useLiveQuery(async () => db.rincian_tagihan.toArray(), [], undefined)
  const tg = useLiveQuery(async () => db.tagihan.toArray(), [], undefined)
  const jp = useLiveQuery(async () => db.jenis_pembayaran.toArray(), [], undefined)

  const data = useMemo(() => {
    const rows = rt || []
    const tagihanMap = new Map((tg || []).map(t => [t.id, t]))
    const jpMap = new Map((jp || []).map(x => [x.id, x]))
    return [...rows]
      .sort((a, b) => new Date(b.tanggal_dibuat || 0) - new Date(a.tanggal_dibuat || 0))
      .map(r => ({
        ...r,
        tagihan: tagihanMap.get(r.id_tagihan) ? { id: r.id_tagihan, nomor_tagihan: tagihanMap.get(r.id_tagihan).nomor_tagihan, judul: tagihanMap.get(r.id_tagihan).judul } : null,
        jenis_pembayaran: jpMap.get(r.id_jenis_pembayaran) ? { id: r.id_jenis_pembayaran, kode: jpMap.get(r.id_jenis_pembayaran).kode, nama: jpMap.get(r.id_jenis_pembayaran).nama } : null,
      }))
  }, [rt, tg, jp])

  const loading = rt === undefined || tg === undefined || jp === undefined
  const realtimeStatus = status.realtime

  const refreshData = useCallback(async () => data, [data])

  const deleteItem = async (id) => {
    try {
      await enqueueDelete('rincian_tagihan', id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      if (isEdit) {
        await enqueueUpdate('rincian_tagihan', formData.id, {
          id_tagihan: formData.id_tagihan,
          id_jenis_pembayaran: formData.id_jenis_pembayaran,
          deskripsi: formData.deskripsi,
          jumlah: formData.jumlah,
          urutan: formData.urutan,
        })
      } else {
        await enqueueInsert('rincian_tagihan', {
          id_tagihan: formData.id_tagihan,
          id_jenis_pembayaran: formData.id_jenis_pembayaran,
          deskripsi: formData.deskripsi,
          jumlah: formData.jumlah,
          urutan: formData.urutan,
        })
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const [tagihanList, setTagihanList] = useState([])
  const [jenisPembayaranList, setJenisPembayaranList] = useState([])

  useEffect(() => {
    ;(async () => {
      const tagihan = await db.tagihan.orderBy('nomor_tagihan').reverse().toArray()
      const jps = await db.jenis_pembayaran.orderBy('kode').toArray()
      setTagihanList(tagihan.map(t => ({ id: t.id, nomor_tagihan: t.nomor_tagihan, judul: t.judul })))
      setJenisPembayaranList(jps.filter(j => j.status_aktif !== false).map(j => ({ id: j.id, kode: j.kode, nama: j.nama, jumlah_default: j.jumlah_default })))
    })()
  }, [])

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
