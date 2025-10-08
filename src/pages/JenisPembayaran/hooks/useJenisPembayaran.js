import { useEffect, useMemo, useState, useCallback } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../offline/db'
import { enqueueDelete, enqueueInsert, enqueueUpdate } from '../../../offline/outbox'
import { useOffline } from '../../../contexts/OfflineContext'
import { generateKodeJenisPembayaran } from '../../../offline/actions/jenisPembayaran'

export function useJenisPembayaran() {
  const { status } = useOffline()
  const [error, setError] = useState('')
  const [isRefreshing, setIsRefreshing] = useState(false)

  const jp = useLiveQuery(async () => db.jenis_pembayaran.orderBy('kode').toArray(), [], undefined)
  const tahun = useLiveQuery(async () => db.tahun_ajaran.toArray(), [], undefined)
  const rincian = useLiveQuery(async () => db.rincian_tagihan.toArray(), [], undefined)

  const data = useMemo(() => {
    const list = jp || []
    const tahunMap = new Map((tahun || []).map((t) => [t.id, { id: t.id, nama: t.nama }]))
    const rtCount = new Map()
    ;(rincian || []).forEach((r) => {
      const key = r.id_jenis_pembayaran
      if (!key) return
      rtCount.set(key, (rtCount.get(key) || 0) + 1)
    })
    return list.map((it) => ({
      ...it,
      tahun_ajaran: tahunMap.get(it.id_tahun_ajaran) || null,
      has_relasi: (rtCount.get(it.id) || 0) > 0,
      _relasi_counts: { rincian_tagihan: rtCount.get(it.id) || 0 },
    }))
  }, [jp, tahun, rincian])

  const loading = jp === undefined

  const refreshData = useCallback(async () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 300)
  }, [])

  const deleteItem = async (id) => {
    try {
      const rCount = await db.rincian_tagihan.where('id_jenis_pembayaran').equals(id).count()
      if (rCount > 0) {
        const msg = `Jenis pembayaran tidak dapat dihapus karena masih digunakan pada ${rCount} rincian tagihan. ` +
          `Hapus atau ubah rincian tagihan terkait terlebih dahulu.`
        setError(msg)
        throw new Error(msg)
      }
      await enqueueDelete('jenis_pembayaran', id)
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const saveItem = async (formData, isEdit) => {
    try {
      if (!formData.nama) throw new Error('Nama wajib diisi')
      if (!formData.id_tahun_ajaran) throw new Error('Tahun Ajaran wajib dipilih')
      if (!formData.tingkat) throw new Error('Tingkat Kelas wajib dipilih')

      // Generate kode otomatis jika create atau jika kode kosong
      let kode = formData.kode
      if (!isEdit || !kode) {
        kode = await generateKodeJenisPembayaran(formData.nama)
      }

      // Set default value untuk tipe_pembayaran (kolom tetap ada di database untuk backward compatibility)
      const defaultTipePembayaran = 'sekali'

      if (isEdit) {
        await enqueueUpdate('jenis_pembayaran', formData.id, {
          kode: kode,
          nama: formData.nama,
          deskripsi: formData.deskripsi || null,
          jumlah_default: formData.jumlah_default || null,
          tipe_pembayaran: defaultTipePembayaran,
          wajib: formData.wajib,
          status_aktif: formData.status_aktif,
          id_tahun_ajaran: formData.id_tahun_ajaran,
          tingkat: formData.tingkat,
        })
      } else {
        await enqueueInsert('jenis_pembayaran', {
          kode: kode,
          nama: formData.nama,
          deskripsi: formData.deskripsi || null,
          jumlah_default: formData.jumlah_default || null,
          tipe_pembayaran: defaultTipePembayaran,
          wajib: formData.wajib,
          status_aktif: formData.status_aktif,
          id_tahun_ajaran: formData.id_tahun_ajaran,
          tingkat: formData.tingkat,
        })
      }
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  const toggleStatus = async (id, currentStatus) => {
    try {
      await enqueueUpdate('jenis_pembayaran', id, {
        status_aktif: !currentStatus,
      })
    } catch (err) {
      setError(err.message)
      throw err
    }
  }

  return {
    data,
    loading,
    isRefreshing,
    realtimeStatus: status.realtime,
    error,
    setError,
    deleteItem,
    saveItem,
    toggleStatus,
    refreshData,
  }
}
