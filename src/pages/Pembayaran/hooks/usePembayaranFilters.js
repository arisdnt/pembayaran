import { useMemo, useState } from 'react'

export function usePembayaranFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState('all')
  const [selectedTingkat, setSelectedTingkat] = useState('all')
  const [selectedDateRange, setSelectedDateRange] = useState('all')

  const tahunAjaranOptions = useMemo(() => {
    const map = new Map()
    data.forEach((item) => {
      const ta = item.tahun_ajaran_tagihan
      if (ta?.id && ta?.nama) {
        map.set(String(ta.id), ta.nama)
      }
    })
    return Array.from(map.entries())
      .map(([id, nama]) => ({ id, nama }))
      .sort((a, b) => a.nama.localeCompare(b.nama, 'id', { sensitivity: 'base' }))
  }, [data])

  const tingkatOptions = useMemo(() => {
    const set = new Set()
    data.forEach((item) => {
      const tingkat = item.kelas_tagihan?.tingkat
      if (tingkat !== undefined && tingkat !== null && `${tingkat}`.trim() !== '') {
        set.add(String(tingkat))
      }
    })
    return Array.from(set).sort((a, b) => a.localeCompare(b, 'id', { numeric: true, sensitivity: 'base' }))
  }, [data])

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.nomor_pembayaran?.toLowerCase().includes(query) ||
        item.tagihan?.nomor_tagihan?.toLowerCase().includes(query) ||
        item.tagihan?.judul?.toLowerCase().includes(query) ||
        item.tagihan?.riwayat_kelas_siswa?.siswa?.nama_lengkap?.toLowerCase().includes(query)
      )
    }

    if (selectedTahunAjaran !== 'all') {
      filtered = filtered.filter((item) => {
        const id = item.tahun_ajaran_tagihan?.id
        return id !== undefined && id !== null && String(id) === selectedTahunAjaran
      })
    }

    if (selectedTingkat !== 'all') {
      filtered = filtered.filter((item) => {
        const tingkat = item.kelas_tagihan?.tingkat
        return tingkat !== undefined && tingkat !== null && String(tingkat) === selectedTingkat
      })
    }

    // Filter berdasarkan tanggal dibuat
    if (selectedDateRange !== 'all') {
      const now = new Date()
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
      
      filtered = filtered.filter((item) => {
        const itemDate = new Date(item.dibuat_pada || item.diperbarui_pada)
        const itemDateOnly = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate())
        const diffTime = today - itemDateOnly
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        switch (selectedDateRange) {
          case 'today':
            return diffDays === 0
          case '3days':
            return diffDays >= 0 && diffDays <= 2
          case '7days':
            return diffDays >= 0 && diffDays <= 6
          case '30days':
            return diffDays >= 0 && diffDays <= 29
          case '90days':
            return diffDays >= 0 && diffDays <= 89
          default:
            return true
        }
      })
    }

    return filtered
  }, [data, searchQuery, selectedTahunAjaran, selectedTingkat, selectedDateRange])

  const stats = useMemo(() => {
    const total = data.length
    const filtered = filteredData.length

    return { total, filtered }
  }, [data, filteredData])

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedTahunAjaran !== 'all' || selectedTingkat !== 'all' || selectedDateRange !== 'all'
  )

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedTahunAjaran('all')
    setSelectedTingkat('all')
    setSelectedDateRange('all')
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedTahunAjaran,
    setSelectedTahunAjaran,
    selectedTingkat,
    setSelectedTingkat,
    selectedDateRange,
    setSelectedDateRange,
    tahunAjaranOptions,
    tingkatOptions,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  }
}
