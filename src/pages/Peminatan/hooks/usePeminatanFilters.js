import { useMemo, useState } from 'react'

export function usePeminatanFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

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

    return filtered
  }, [data, searchQuery, filterStatus])

  const stats = useMemo(() => {
    return {
      total: data.length,
      aktif: data.filter(item => item.aktif).length,
      nonaktif: data.filter(item => !item.aktif).length,
      filtered: filteredData.length,
    }
  }, [data, filteredData])

  const hasActiveFilters = searchQuery.trim() || filterStatus !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
  }

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  }
}
