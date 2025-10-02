import { useMemo, useState } from 'react'

export function useRiwayatWaliKelasFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.wali_kelas?.nama_lengkap.toLowerCase().includes(query) ||
        item.wali_kelas?.nip?.toLowerCase().includes(query) ||
        item.kelas?.nama_sub_kelas.toLowerCase().includes(query) ||
        item.tahun_ajaran?.nama.toLowerCase().includes(query)
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === filterStatus)
    }

    return filtered
  }, [data, searchQuery, filterStatus])

  const stats = useMemo(() => {
    const total = data.length
    const aktif = data.filter((item) => item.status === 'aktif').length
    const filtered = filteredData.length

    return { total, aktif, filtered }
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
