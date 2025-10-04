import { useEffect, useState } from 'react'
import { db } from '../../../offline/db'

export function usePeminatan() {
  const [peminatanList, setPeminatanList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      const data = await db.peminatan.where('aktif').equals(true).toArray()
      // Sort by nama
      data.sort((a, b) => (a.nama || '').localeCompare(b.nama || ''))
      setPeminatanList(data || [])
      setLoading(false)
    })()
  }, [])

  // Filter peminatan by tingkat
  const getPeminatanByTingkat = (tingkat) => {
    if (!tingkat) return []
    const tingkatNum = parseInt(tingkat)
    return peminatanList.filter(p => {
      const min = p.tingkat_min || 0
      const max = p.tingkat_max || 999
      return tingkatNum >= min && tingkatNum <= max
    })
  }

  return { 
    peminatanList, 
    getPeminatanByTingkat,
    loading 
  }
}
