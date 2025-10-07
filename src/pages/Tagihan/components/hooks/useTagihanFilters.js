import { useMemo, useState } from 'react'

export function useTagihanFilters(data) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTahunAjaran, setFilterTahunAjaran] = useState('all')
  const [filterTingkatKelas, setFilterTingkatKelas] = useState('all')
  const [filterJudul, setFilterJudul] = useState('all')

  const handleTahunAjaranChange = (value) => {
    setFilterTahunAjaran(value)
    setFilterJudul('all')
  }

  const handleTingkatKelasChange = (value) => {
    setFilterTingkatKelas(value)
    setFilterJudul('all')
  }

  const tingkatKelasOptions = useMemo(() => {
    const siswaLatestTingkat = new Map()
    
    data.forEach(item => {
      const rks = item.riwayat_kelas_siswa
      if (!rks?.siswa?.id || !rks?.kelas?.tingkat || !rks?.tanggal_masuk) return
      
      const siswaId = rks.siswa.id
      const currentLatest = siswaLatestTingkat.get(siswaId)
      
      if (!currentLatest || new Date(rks.tanggal_masuk) > new Date(currentLatest.tanggal_masuk)) {
        siswaLatestTingkat.set(siswaId, {
          tingkat: rks.kelas.tingkat,
          tanggal_masuk: rks.tanggal_masuk
        })
      }
    })
    
    const uniqueTingkat = [...new Set(Array.from(siswaLatestTingkat.values()).map(v => v.tingkat))]
    return ['all', ...uniqueTingkat.sort()]
  }, [data])

  const judulOptions = useMemo(() => {
    let filteredForJudul = [...data]

    if (filterTahunAjaran !== 'all') {
      filteredForJudul = filteredForJudul.filter(
        (item) => item.riwayat_kelas_siswa?.tahun_ajaran?.id === filterTahunAjaran
      )
    }

    if (filterTingkatKelas !== 'all') {
      filteredForJudul = filteredForJudul.filter(
        (item) => item.riwayat_kelas_siswa?.kelas?.tingkat === filterTingkatKelas
      )
    }

    const uniqueJudul = [...new Set(filteredForJudul.map(item => item.judul).filter(Boolean))]
    return ['all', ...uniqueJudul.sort()]
  }, [data, filterTahunAjaran, filterTingkatKelas])

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.nomor_tagihan?.toLowerCase().includes(query) ||
        item.judul?.toLowerCase().includes(query) ||
        item.riwayat_kelas_siswa?.siswa?.nama_lengkap?.toLowerCase().includes(query) ||
        item.riwayat_kelas_siswa?.siswa?.nisn?.toLowerCase().includes(query)
      )
    }

    if (filterTahunAjaran !== 'all') {
      filtered = filtered.filter(
        (item) => item.riwayat_kelas_siswa?.tahun_ajaran?.id === filterTahunAjaran
      )
    }

    if (filterTingkatKelas !== 'all') {
      filtered = filtered.filter(
        (item) => item.riwayat_kelas_siswa?.kelas?.tingkat === filterTingkatKelas
      )
    }

    if (filterJudul !== 'all') {
      filtered = filtered.filter((item) => item.judul === filterJudul)
    }

    return filtered
  }, [data, searchQuery, filterTahunAjaran, filterTingkatKelas, filterJudul])

  const hasActiveFilters =
    searchQuery.trim() || filterTahunAjaran !== 'all' || filterTingkatKelas !== 'all' || filterJudul !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterTahunAjaran('all')
    setFilterTingkatKelas('all')
    setFilterJudul('all')
  }

  return {
    searchQuery,
    setSearchQuery,
    filterTahunAjaran,
    setFilterTahunAjaran: handleTahunAjaranChange,
    filterTingkatKelas,
    setFilterTingkatKelas: handleTingkatKelasChange,
    filterJudul,
    setFilterJudul,
    tingkatKelasOptions,
    judulOptions,
    filteredData,
    hasActiveFilters,
    handleClearFilters,
  }
}
