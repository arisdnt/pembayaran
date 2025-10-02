import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

export function useKelas() {
  const [kelasList, setKelasList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchKelas()
  }, [])

  const fetchKelas = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('kelas')
        .select('*')
        .order('tingkat', { ascending: true })
        .order('nama_sub_kelas', { ascending: true })

      if (error) throw error
      setKelasList(data || [])
    } catch (error) {
      console.error('Error fetching kelas:', error)
      setKelasList([])
    } finally {
      setLoading(false)
    }
  }

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
