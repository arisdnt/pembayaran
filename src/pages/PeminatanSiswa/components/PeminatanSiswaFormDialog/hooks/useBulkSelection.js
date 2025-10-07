import { useState, useMemo } from 'react'

export function useBulkSelection(filteredSiswaList) {
  const [selectedSiswaIds, setSelectedSiswaIds] = useState([])
  const [searchSiswa, setSearchSiswa] = useState('')

  const searchedSiswaList = useMemo(() => {
    if (!searchSiswa.trim()) return filteredSiswaList
    const query = searchSiswa.toLowerCase()
    return filteredSiswaList.filter(siswa => 
      siswa.nama_lengkap?.toLowerCase().includes(query) ||
      siswa.nisn?.toLowerCase().includes(query)
    )
  }, [filteredSiswaList, searchSiswa])

  const handleToggleSiswa = (siswaId) => {
    setSelectedSiswaIds(prev => {
      if (prev.includes(siswaId)) {
        return prev.filter(id => id !== siswaId)
      } else {
        return [...prev, siswaId]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectedSiswaIds.length === searchedSiswaList.length) {
      setSelectedSiswaIds([])
    } else {
      setSelectedSiswaIds(searchedSiswaList.map(s => s.id))
    }
  }

  const resetSelection = () => {
    setSelectedSiswaIds([])
    setSearchSiswa('')
  }

  return {
    selectedSiswaIds,
    searchSiswa,
    searchedSiswaList,
    setSearchSiswa,
    handleToggleSiswa,
    handleSelectAll,
    resetSelection,
  }
}
