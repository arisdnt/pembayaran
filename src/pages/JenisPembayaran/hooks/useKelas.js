import { useEffect, useState } from 'react'
import { db } from '../../../offline/db'

export function useKelas() {
  const [kelasList, setKelasList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      const data = await db.kelas.orderBy('tingkat').toArray()
      setKelasList(data || [])
      setLoading(false)
    })()
  }, [])

  // Get unique tingkat values
  const tingkatList = [...new Set(kelasList.map(k => k.tingkat))].sort()

  // Filter kelas by tingkat
  const getKelasByTingkat = (tingkat) => {
    if (!tingkat) return []
    return kelasList.filter(k => k.tingkat === tingkat)
  }

  return { 
    kelasList, 
    tingkatList, 
    getKelasByTingkat,
    loading 
  }
}
