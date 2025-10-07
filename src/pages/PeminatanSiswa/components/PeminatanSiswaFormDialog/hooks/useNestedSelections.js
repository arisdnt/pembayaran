import { useState, useMemo, useEffect } from 'react'

export function useNestedSelections({
  initialData,
  isEdit,
  riwayatKelasSiswa,
  kelasList,
  siswaList,
  existingPeminatanSiswa,
  onFormDataChange,
}) {
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState('')
  const [selectedTingkat, setSelectedTingkat] = useState('')
  const [selectedKelas, setSelectedKelas] = useState('')

  const tingkatOptions = useMemo(() => {
    if (!selectedTahunAjaran || !riwayatKelasSiswa.length || !kelasList.length) return []
    
    const kelasIds = riwayatKelasSiswa
      .filter(rks => rks.id_tahun_ajaran === selectedTahunAjaran && rks.status === 'aktif')
      .map(rks => rks.id_kelas)
    
    const tingkatSet = new Set()
    kelasList.forEach(kelas => {
      if (kelasIds.includes(kelas.id)) {
        tingkatSet.add(kelas.tingkat)
      }
    })
    
    return Array.from(tingkatSet).sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }))
  }, [selectedTahunAjaran, riwayatKelasSiswa, kelasList])

  const kelasOptions = useMemo(() => {
    if (!selectedTahunAjaran || !selectedTingkat || !riwayatKelasSiswa.length || !kelasList.length) return []
    
    const kelasIds = riwayatKelasSiswa
      .filter(rks => rks.id_tahun_ajaran === selectedTahunAjaran && rks.status === 'aktif')
      .map(rks => rks.id_kelas)
    
    return kelasList
      .filter(kelas => kelasIds.includes(kelas.id) && kelas.tingkat === selectedTingkat)
      .sort((a, b) => a.nama_sub_kelas.localeCompare(b.nama_sub_kelas))
  }, [selectedTahunAjaran, selectedTingkat, riwayatKelasSiswa, kelasList])

  const filteredSiswaList = useMemo(() => {
    if (!selectedTahunAjaran || !selectedTingkat || !selectedKelas || !riwayatKelasSiswa.length) return []
    
    const siswaIds = riwayatKelasSiswa
      .filter(rks => 
        rks.id_tahun_ajaran === selectedTahunAjaran && 
        rks.id_kelas === selectedKelas &&
        rks.status === 'aktif'
      )
      .map(rks => rks.id_siswa)
    
    return siswaList
      .filter(siswa => siswaIds.includes(siswa.id))
      .sort((a, b) => (a.nama_lengkap || '').localeCompare(b.nama_lengkap || ''))
  }, [selectedTahunAjaran, selectedTingkat, selectedKelas, riwayatKelasSiswa, siswaList])

  const siswaWithPeminatan = useMemo(() => {
    if (!existingPeminatanSiswa || !selectedTahunAjaran || !selectedTingkat) return new Set()
    
    const existing = existingPeminatanSiswa.filter(
      ps => ps.id_tahun_ajaran === selectedTahunAjaran && ps.tingkat === selectedTingkat
    )
    return new Set(existing.map(ps => ps.id_siswa))
  }, [existingPeminatanSiswa, selectedTahunAjaran, selectedTingkat])

  useEffect(() => {
    if (initialData && isEdit) {
      if (initialData.id_tahun_ajaran) {
        setSelectedTahunAjaran(initialData.id_tahun_ajaran)
        if (initialData.tingkat) {
          setSelectedTingkat(initialData.tingkat)
        }
        if (initialData.id_siswa && riwayatKelasSiswa.length > 0) {
          const riwayat = riwayatKelasSiswa.find(
            rks => rks.id_siswa === initialData.id_siswa &&
                   rks.id_tahun_ajaran === initialData.id_tahun_ajaran &&
                   rks.status === 'aktif'
          )
          if (riwayat) {
            setSelectedKelas(riwayat.id_kelas)
          }
        }
      }
    }
  }, [initialData, isEdit, riwayatKelasSiswa])

  const handleTahunAjaranChange = (value) => {
    setSelectedTahunAjaran(value)
    setSelectedTingkat('')
    setSelectedKelas('')
    onFormDataChange?.({ id_tahun_ajaran: value })
  }

  const handleTingkatChange = (value) => {
    setSelectedTingkat(value)
    setSelectedKelas('')
    onFormDataChange?.({ tingkat: value })
  }

  const handleKelasChange = (value) => {
    setSelectedKelas(value)
  }

  const resetSelections = () => {
    setSelectedTahunAjaran('')
    setSelectedTingkat('')
    setSelectedKelas('')
  }

  return {
    selectedTahunAjaran,
    selectedTingkat,
    selectedKelas,
    tingkatOptions,
    kelasOptions,
    filteredSiswaList,
    siswaWithPeminatan,
    handleTahunAjaranChange,
    handleTingkatChange,
    handleKelasChange,
    resetSelections,
  }
}
