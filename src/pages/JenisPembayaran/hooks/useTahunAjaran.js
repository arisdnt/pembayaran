import { useEffect, useState } from 'react'
import { db } from '../../../offline/db'

export function useTahunAjaran() {
  const [tahunAjaranList, setTahunAjaranList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      const data = await db.tahun_ajaran.orderBy('tanggal_mulai').reverse().toArray()
      setTahunAjaranList(data || [])
      setLoading(false)
    })()
  }, [])

  return { tahunAjaranList, loading }
}
