import { useMemo, useState } from 'react'

export function usePembayaranFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')

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

    return filtered
  }, [data, searchQuery])

  const stats = useMemo(() => {
    const total = data.length
    const filtered = filteredData.length

    return { total, filtered }
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
