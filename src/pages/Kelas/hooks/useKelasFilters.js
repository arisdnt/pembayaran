import { useMemo, useState } from 'react'
import { formatDateTime } from '../utils/dateHelpers'

export function useKelasFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTingkat, setFilterTingkat] = useState('all')

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.tingkat.toLowerCase().includes(query) ||
        item.nama_sub_kelas.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      )
    }

    if (filterTingkat !== 'all') {
      filtered = filtered.filter((item) => item.tingkat === filterTingkat)
    }

    return filtered
  }, [data, searchQuery, filterTingkat])

  const stats = useMemo(() => {
    const total = data.length
    const tingkatList = [...new Set(data.map(item => item.tingkat))].sort()
    const filtered = filteredData.length
    const tingkat10 = data.filter(item => item.tingkat === '10').length
    const tingkat11 = data.filter(item => item.tingkat === '11').length
    const tingkat12 = data.filter(item => item.tingkat === '12').length
    const lastUpdate = data
      .map((item) => item.diperbarui_pada || item.dibuat_pada)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))
      .at(0)

    return {
      total,
      tingkatList,
      filtered,
      tingkat10,
      tingkat11,
      tingkat12,
      lastUpdate: lastUpdate ? formatDateTime(lastUpdate) : 'Belum ada aktivitas',
    }
  }, [data, filteredData])

  const hasActiveFilters = searchQuery.trim() || filterTingkat !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterTingkat('all')
  }

  return {
    searchQuery,
    setSearchQuery,
    filterTingkat,
    setFilterTingkat,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  }
}
