import { useMemo, useState } from 'react'

export function useRincianTagihanFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.tagihan?.nomor_tagihan?.toLowerCase().includes(query) ||
        item.tagihan?.judul?.toLowerCase().includes(query) ||
        item.jenis_pembayaran?.kode?.toLowerCase().includes(query) ||
        item.jenis_pembayaran?.nama?.toLowerCase().includes(query) ||
        item.deskripsi?.toLowerCase().includes(query)
      )
    }

    return filtered
  }, [data, searchQuery])

  const stats = useMemo(() => {
    const total = data.length
    const totalJumlah = data.reduce((sum, item) => sum + parseFloat(item.jumlah || 0), 0)
    const filtered = filteredData.length

    return { total, totalJumlah, filtered }
  }, [data, filteredData])

  const hasActiveFilters = searchQuery.trim()

  const handleClearFilters = () => {
    setSearchQuery('')
  }

  return {
    searchQuery,
    setSearchQuery,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  }
}
