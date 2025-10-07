import { useMemo, useState } from 'react'

export function usePeminatanFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTingkat, setFilterTingkat] = useState('all')

  // Get unique tingkat from data (untuk dropdown filter)
  const tingkatList = useMemo(() => {
    const tingkatSet = new Set()
    data.forEach((item) => {
      if (item.tingkat_min) tingkatSet.add(item.tingkat_min)
      if (item.tingkat_max) tingkatSet.add(item.tingkat_max)
    })
    return Array.from(tingkatSet).sort((a, b) => a - b)
  }, [data])

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.nama.toLowerCase().includes(query) ||
        item.kode.toLowerCase().includes(query) ||
        (item.keterangan && item.keterangan.toLowerCase().includes(query))
      )
    }

    if (filterStatus === 'aktif') {
      filtered = filtered.filter((item) => item.aktif === true)
    } else if (filterStatus === 'nonaktif') {
      filtered = filtered.filter((item) => item.aktif === false)
    }

    if (filterTingkat !== 'all') {
      const tingkat = parseInt(filterTingkat)
      filtered = filtered.filter((item) => {
        // Filter: tingkat harus berada dalam range tingkat_min dan tingkat_max
        const minMatch = item.tingkat_min === null || tingkat >= item.tingkat_min
        const maxMatch = item.tingkat_max === null || tingkat <= item.tingkat_max
        return minMatch && maxMatch
      })
    }

    return filtered
  }, [data, searchQuery, filterStatus, filterTingkat])

  const stats = useMemo(() => {
    return {
      total: data.length,
      aktif: data.filter(item => item.aktif).length,
      nonaktif: data.filter(item => !item.aktif).length,
      filtered: filteredData.length,
    }
  }, [data, filteredData])

  const hasActiveFilters = searchQuery.trim() || filterStatus !== 'all' || filterTingkat !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
    setFilterTingkat('all')
  }

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterTingkat,
    setFilterTingkat,
    tingkatList,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  }
}
