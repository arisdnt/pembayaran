import { useMemo, useState } from 'react'

export function useTableFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTahunAjaran, setFilterTahunAjaran] = useState('all')
  const [filterTingkatKelas, setFilterTingkatKelas] = useState('all')

  const tahunAjaranOptions = useMemo(() => {
    const uniqueTahun = [...new Set(data.map(item => item.tahun_ajaran?.nama).filter(Boolean))]
    return ['all', ...uniqueTahun.sort()]
  }, [data])

  const tingkatKelasOptions = useMemo(() => {
    const uniqueTingkat = [...new Set(data.map(item => item.kelas?.tingkat).filter(Boolean))]
    return ['all', ...uniqueTingkat.sort()]
  }, [data])

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.siswa?.nama_lengkap.toLowerCase().includes(query) ||
        item.siswa?.nisn?.toLowerCase().includes(query) ||
        item.kelas?.nama_sub_kelas.toLowerCase().includes(query) ||
        item.tahun_ajaran?.nama.toLowerCase().includes(query) ||
        item.id.toLowerCase().includes(query)
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === filterStatus)
    }

    if (filterTahunAjaran !== 'all') {
      filtered = filtered.filter((item) => item.tahun_ajaran?.nama === filterTahunAjaran)
    }

    if (filterTingkatKelas !== 'all') {
      filtered = filtered.filter((item) => item.kelas?.tingkat === filterTingkatKelas)
    }

    return filtered
  }, [data, searchQuery, filterStatus, filterTahunAjaran, filterTingkatKelas])

  const hasActiveFilters = searchQuery.trim() || filterStatus !== 'all' || filterTahunAjaran !== 'all' || filterTingkatKelas !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
    setFilterTahunAjaran('all')
    setFilterTingkatKelas('all')
  }

  return {
    searchQuery,
    setSearchQuery,
    filterStatus,
    setFilterStatus,
    filterTahunAjaran,
    setFilterTahunAjaran,
    filterTingkatKelas,
    setFilterTingkatKelas,
    tahunAjaranOptions,
    tingkatKelasOptions,
    filteredData,
    hasActiveFilters,
    handleClearFilters,
  }
}
