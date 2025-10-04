import { useState, useMemo } from 'react'
import { formatDateTime } from '../helpers/formatters'

export function useTableFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTahunAjaran, setFilterTahunAjaran] = useState('all')
  const [filterTingkat, setFilterTingkat] = useState('all')
  const [filterKelas, setFilterKelas] = useState('all')

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.nama_lengkap.toLowerCase().includes(query) ||
        (item.nisn && item.nisn.toLowerCase().includes(query)) ||
        item.id.toLowerCase().includes(query)
      )
    }

    if (filterStatus === 'active') {
      filtered = filtered.filter((item) => item.status_aktif)
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter((item) => !item.status_aktif)
    }

    if (filterTahunAjaran !== 'all') {
      filtered = filtered.filter((item) => 
        item.tahun_ajaran_terbaru?.id === filterTahunAjaran
      )
    }

    if (filterTingkat !== 'all') {
      filtered = filtered.filter((item) => 
        String(item.kelas_terbaru?.tingkat || '') === filterTingkat
      )
    }

    if (filterKelas !== 'all') {
      filtered = filtered.filter((item) => 
        item.kelas_terbaru?.id === filterKelas
      )
    }

    return filtered
  }, [data, searchQuery, filterStatus, filterTahunAjaran, filterTingkat, filterKelas])

  const stats = useMemo(() => {
    const total = data.length
    const active = data.filter((item) => item.status_aktif).length
    const filtered = filteredData.length
    const lastUpdate = data
      .map((item) => item.diperbarui_pada || item.dibuat_pada)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))
      .at(0)

    return {
      total,
      active,
      filtered,
      lastUpdate: lastUpdate ? formatDateTime(lastUpdate) : 'Belum ada aktivitas',
    }
  }, [data, filteredData])

  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    filterStatus !== 'all' ||
    filterTahunAjaran !== 'all' ||
    filterTingkat !== 'all' ||
    filterKelas !== 'all'
  )

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
    setFilterTahunAjaran('all')
    setFilterTingkat('all')
    setFilterKelas('all')
  }

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterTahunAjaran,
    setFilterTahunAjaran,
    filterTingkat,
    setFilterTingkat,
    filterKelas,
    setFilterKelas,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  }
}
