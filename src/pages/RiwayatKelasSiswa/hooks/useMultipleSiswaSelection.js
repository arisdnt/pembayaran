import { useState, useMemo, useCallback, useRef } from 'react'
import { db } from '../../../offline/db'

export function useMultipleSiswaSelection(siswaList) {
  const [selectedSiswaList, setSelectedSiswaList] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false)
  const autocompleteRef = useRef(null)
  const inputRef = useRef(null)

  const availableSiswaList = useMemo(() => {
    const selectedIds = new Set(selectedSiswaList.map(s => s.id))
    return siswaList.filter(siswa => !selectedIds.has(siswa.id))
  }, [siswaList, selectedSiswaList])

  const searchedSiswaList = useMemo(() => {
    if (!searchQuery.trim()) return []
    const query = searchQuery.toLowerCase()
    return availableSiswaList.filter(siswa => 
      siswa.nama_lengkap.toLowerCase().includes(query) ||
      (siswa.nisn && siswa.nisn.toLowerCase().includes(query))
    ).slice(0, 10)
  }, [availableSiswaList, searchQuery])

  const handleAddSiswa = useCallback(async (siswa) => {
    const lastRiwayat = await db.riwayat_kelas_siswa
      .where('id_siswa')
      .equals(siswa.id)
      .reverse()
      .sortBy('tanggal_masuk')
      .then(results => results[0])
    
    let lastKelas = null
    let lastTahunAjaran = null
    
    if (lastRiwayat) {
      lastKelas = await db.kelas.get(lastRiwayat.id_kelas)
      lastTahunAjaran = await db.tahun_ajaran.get(lastRiwayat.id_tahun_ajaran)
    }
    
    setSelectedSiswaList(prev => [...prev, {
      ...siswa,
      lastKelas,
      lastTahunAjaran
    }])
    setSearchQuery('')
    setIsAutocompleteOpen(false)
    inputRef.current?.focus()
  }, [])

  const handleRemoveSiswa = useCallback((siswaId) => {
    setSelectedSiswaList(prev => prev.filter(s => s.id !== siswaId))
  }, [])

  const resetSelection = useCallback(() => {
    setSelectedSiswaList([])
    setSearchQuery('')
    setIsAutocompleteOpen(false)
  }, [])

  return {
    selectedSiswaList,
    searchQuery,
    setSearchQuery,
    isAutocompleteOpen,
    setIsAutocompleteOpen,
    searchedSiswaList,
    handleAddSiswa,
    handleRemoveSiswa,
    resetSelection,
    autocompleteRef,
    inputRef
  }
}
