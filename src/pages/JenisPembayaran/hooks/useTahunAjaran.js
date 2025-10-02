import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

export function useTahunAjaran() {
  const [tahunAjaranList, setTahunAjaranList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTahunAjaran()
  }, [])

  const fetchTahunAjaran = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('tahun_ajaran')
        .select('*')
        .order('tanggal_mulai', { ascending: false })

      if (error) throw error
      setTahunAjaranList(data || [])
    } catch (error) {
      console.error('Error fetching tahun ajaran:', error)
      setTahunAjaranList([])
    } finally {
      setLoading(false)
    }
  }

  return { tahunAjaranList, loading }
}
