import { useMemo, useState } from 'react'

export function useJenisPembayaranFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTipe, setFilterTipe] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTahunId, setFilterTahunId] = useState('all')
  const [filterTingkat, setFilterTingkat] = useState('all')

  // Derived lists for filters
  const tahunList = useMemo(() => {
    const map = new Map()
    for (const item of data) {
      const ta = item.tahun_ajaran
      if (ta?.id && !map.has(ta.id)) map.set(ta.id, ta.nama)
    }
    return Array.from(map, ([id, nama]) => ({ id, nama }))
  }, [data])

  const tingkatList = useMemo(() => {
    return Array.from(new Set(data.map(item => item.tingkat).filter(Boolean))).sort()
  }, [data])

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.kode?.toLowerCase().includes(query) ||
        item.nama?.toLowerCase().includes(query)
      )
    }

    if (filterTipe !== 'all') {
      filtered = filtered.filter((item) => item.tipe_pembayaran === filterTipe)
    }

    if (filterStatus === 'aktif') {
      filtered = filtered.filter((item) => item.status_aktif)
    } else if (filterStatus === 'nonaktif') {
      filtered = filtered.filter((item) => !item.status_aktif)
    }

    if (filterTahunId !== 'all') {
      filtered = filtered.filter((item) => item.id_tahun_ajaran === filterTahunId)
    }
    if (filterTingkat !== 'all') {
      filtered = filtered.filter((item) => item.tingkat === filterTingkat)
    }

    return filtered
  }, [data, searchQuery, filterTipe, filterStatus, filterTahunId, filterTingkat])

  const hasActiveFilters = searchQuery.trim() || filterTipe !== 'all' || 
    filterStatus !== 'all' || filterTahunId !== 'all' || 
    filterTingkat !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterTipe('all')
    setFilterStatus('all')
    setFilterTahunId('all')
    setFilterTingkat('all')
  }

  return {
    searchQuery,
    setSearchQuery,
    filterTipe,
    setFilterTipe,
    filterStatus,
    setFilterStatus,
    filterTahunId,
    setFilterTahunId,
    filterTingkat,
    setFilterTingkat,
    tahunList,
    tingkatList,
    filteredData,
    hasActiveFilters,
    handleClearFilters,
  }
}
