import { useMemo, useState } from 'react'

export function usePeminatanSiswaFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterPeminatan, setFilterPeminatan] = useState('all')
  const [filterTahunAjaran, setFilterTahunAjaran] = useState('all')
  const [filterTingkat, setFilterTingkat] = useState('all')

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.siswa?.nama_lengkap?.toLowerCase().includes(query) ||
        item.siswa?.nisn?.toLowerCase().includes(query) ||
        item.peminatan?.nama?.toLowerCase().includes(query) ||
        item.peminatan?.kode?.toLowerCase().includes(query)
      )
    }

    if (filterPeminatan !== 'all') {
      filtered = filtered.filter((item) => item.id_peminatan === filterPeminatan)
    }

    if (filterTahunAjaran !== 'all') {
      filtered = filtered.filter((item) => item.id_tahun_ajaran === filterTahunAjaran)
    }

    if (filterTingkat !== 'all') {
      filtered = filtered.filter((item) => item.tingkat === filterTingkat)
    }

    return filtered
  }, [data, searchQuery, filterPeminatan, filterTahunAjaran, filterTingkat])

  const stats = useMemo(() => {
    const uniquePeminatan = [...new Set(data.map(item => item.peminatan?.nama).filter(Boolean))]
    const uniqueTahunAjaran = [...new Set(data.map(item => item.tahun_ajaran?.nama).filter(Boolean))]
    const uniqueTingkat = [...new Set(data.map(item => item.tingkat).filter(Boolean))].sort()

    return {
      total: data.length,
      filtered: filteredData.length,
      uniquePeminatan,
      uniqueTahunAjaran,
      uniqueTingkat,
    }
  }, [data, filteredData])

  const hasActiveFilters = 
    searchQuery.trim() || 
    filterPeminatan !== 'all' || 
    filterTahunAjaran !== 'all' ||
    filterTingkat !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterPeminatan('all')
    setFilterTahunAjaran('all')
    setFilterTingkat('all')
  }

  return {
    searchQuery,
    setSearchQuery,
    filterPeminatan,
    setFilterPeminatan,
    filterTahunAjaran,
    setFilterTahunAjaran,
    filterTingkat,
    setFilterTingkat,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  }
}
