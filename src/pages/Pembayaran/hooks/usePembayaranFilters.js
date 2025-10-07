import { useMemo, useState } from 'react'

export function usePembayaranFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState('all')
  const [selectedTingkat, setSelectedTingkat] = useState('all')

  const tahunAjaranOptions = useMemo(() => {
    const map = new Map()
    data.forEach((item) => {
      const ta = item.latest_tahun_ajaran
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
      const tingkat = item.latest_kelas?.tingkat
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
        const id = item.latest_tahun_ajaran?.id
        return id !== undefined && id !== null && String(id) === selectedTahunAjaran
      })
    }

    if (selectedTingkat !== 'all') {
      filtered = filtered.filter((item) => {
        const tingkat = item.latest_kelas?.tingkat
        return tingkat !== undefined && tingkat !== null && String(tingkat) === selectedTingkat
      })
    }

    return filtered
  }, [data, searchQuery, selectedTahunAjaran, selectedTingkat])

  const stats = useMemo(() => {
    const total = data.length
    const filtered = filteredData.length

    return { total, filtered }
  }, [data, filteredData])

  const hasActiveFilters = Boolean(
    searchQuery.trim() || selectedTahunAjaran !== 'all' || selectedTingkat !== 'all'
  )

  const handleClearFilters = () => {
    setSearchQuery('')
    setSelectedTahunAjaran('all')
    setSelectedTingkat('all')
  }

  return {
    searchQuery,
    setSearchQuery,
    selectedTahunAjaran,
    setSelectedTahunAjaran,
    selectedTingkat,
    setSelectedTingkat,
    tahunAjaranOptions,
    tingkatOptions,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  }
}
