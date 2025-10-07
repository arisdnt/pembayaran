import { useMemo, useState } from 'react'
import { formatDateTime } from '../utils/formatters'

export function useTableFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTahunAjaran, setFilterTahunAjaran] = useState('all')

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.wali_kelas?.nama_lengkap.toLowerCase().includes(query) ||
        item.kelas?.nama_sub_kelas.toLowerCase().includes(query) ||
        item.tahun_ajaran?.nama.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === filterStatus)
    }

    if (filterTahunAjaran !== 'all') {
      filtered = filtered.filter((item) => item.id_tahun_ajaran === filterTahunAjaran)
    }

    return filtered
  }, [data, searchQuery, filterStatus, filterTahunAjaran])

  const stats = useMemo(() => {
    const total = data.length
    const aktif = data.filter((item) => item.status === 'aktif').length
    const filtered = filteredData.length
    const lastUpdate = data
      .map((item) => item.diperbarui_pada || item.dibuat_pada)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))
      .at(0)

    return {
      total,
      aktif,
      filtered,
      lastUpdate: lastUpdate ? formatDateTime(lastUpdate) : 'Belum ada aktivitas',
    }
  }, [data, filteredData])

  const hasActiveFilters = searchQuery.trim() || filterStatus !== 'all' || filterTahunAjaran !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
    setFilterTahunAjaran('all')
  }

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterTahunAjaran,
    setFilterTahunAjaran,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  }
}
