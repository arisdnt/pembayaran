import { useState, useMemo, useEffect } from 'react'
import { Dialog, TextField, TextArea, Select, Text, Button } from '@radix-ui/themes'
import { AlertCircle, BookOpen, Edit3, Users, Calendar, Hash, FileText, X, School } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../offline/db'

export function PeminatanSiswaFormDialog({ 
  open, 
  onOpenChange, 
  onSubmit, 
  initialData, 
  isEdit,
  siswaList = [],
  peminatanList = [],
  tahunAjaranList = [],
}) {
  const [formData, setFormData] = useState(
    initialData || {
      id: '',
      id_siswa: undefined,
      id_peminatan: undefined,
      id_tahun_ajaran: undefined,
      tingkat: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      catatan: '',
    }
  )
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  // Nested selection state
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState('')
  const [selectedTingkat, setSelectedTingkat] = useState('')
  const [selectedKelas, setSelectedKelas] = useState('')
  
  // Fetch data from IndexedDB
  const riwayatKelasSiswa = useLiveQuery(() => db.riwayat_kelas_siswa.toArray(), [], [])
  const kelasList = useLiveQuery(() => db.kelas.toArray(), [], [])
  
  // Get unique tingkat options based on selected tahun ajaran
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
  
  // Get kelas options based on selected tahun ajaran and tingkat
  const kelasOptions = useMemo(() => {
    if (!selectedTahunAjaran || !selectedTingkat || !riwayatKelasSiswa.length || !kelasList.length) return []
    
    const kelasIds = riwayatKelasSiswa
      .filter(rks => rks.id_tahun_ajaran === selectedTahunAjaran && rks.status === 'aktif')
      .map(rks => rks.id_kelas)
    
    return kelasList
      .filter(kelas => kelasIds.includes(kelas.id) && kelas.tingkat === selectedTingkat)
      .sort((a, b) => a.nama_sub_kelas.localeCompare(b.nama_sub_kelas))
  }, [selectedTahunAjaran, selectedTingkat, riwayatKelasSiswa, kelasList])
  
  // Get siswa options based on selected tahun ajaran, tingkat, and kelas
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
  
  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData) {
      setFormData(initialData)

      // Pre-fill selection state for edit mode
      if (isEdit && initialData.id_tahun_ajaran) {
        setSelectedTahunAjaran(initialData.id_tahun_ajaran)

        if (initialData.tingkat) {
          setSelectedTingkat(initialData.tingkat)
        }

        // Find the kelas for this siswa
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

  // Auto-fill tanggal mulai and tanggal selesai based on selected tahun ajaran
  useEffect(() => {
    if (selectedTahunAjaran && tahunAjaranList.length > 0) {
      const tahun = tahunAjaranList.find(ta => ta.id === selectedTahunAjaran)
      if (tahun) {
        const formatDate = (dateStr) => {
          if (!dateStr) return ''
          try {
            const date = new Date(dateStr)
            if (Number.isNaN(date.getTime())) return ''
            return date.toISOString().split('T')[0]
          } catch {
            return ''
          }
        }

        setFormData(prev => ({
          ...prev,
          tanggal_mulai: formatDate(tahun.tanggal_mulai),
          tanggal_selesai: formatDate(tahun.tanggal_selesai)
        }))
      }
    }
  }, [selectedTahunAjaran, tahunAjaranList])

  // Reset nested selection state when dialog opens/closes or when creating new
  useEffect(() => {
    if (open && !isEdit) {
      // Reset for new entry
      setSelectedTahunAjaran('')
      setSelectedTingkat('')
      setSelectedKelas('')
    }
  }, [open, isEdit])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError('')

    if (!formData.id_siswa || !formData.id_peminatan || !formData.id_tahun_ajaran) {
      setError('Siswa, Peminatan, dan Tahun Ajaran wajib dipilih')
      setSubmitting(false)
      return
    }

    if (!formData.tingkat) {
      setError('Tingkat wajib diisi')
      setSubmitting(false)
      return
    }

    try {
      await onSubmit(formData, isEdit)
      onOpenChange(false)
      setFormData({
        id: '',
        id_siswa: undefined,
        id_peminatan: undefined,
        id_tahun_ajaran: undefined,
        tingkat: '',
        tanggal_mulai: '',
        tanggal_selesai: '',
        catatan: '',
      })
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content 
        style={{ 
          maxWidth: '900px',
          width: '95vw',
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-10 w-10 items-center justify-center border shadow-sm ${
              isEdit ? 'bg-amber-600 border-amber-700' : 'bg-green-600 border-green-700'
            }`}>
              {isEdit ? (
                <Edit3 className="h-5 w-5 text-white" />
              ) : (
                <BookOpen className="h-5 w-5 text-white" />
              )}
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                {isEdit ? 'Edit Peminatan Siswa' : 'Tambah Peminatan Siswa'}
              </Text>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
            aria-label="Close"
            type="button"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="overflow-auto bg-white" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          <div className="p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-4">
                {/* Step 1: Tahun Ajaran */}
                <label>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Calendar className="h-3.5 w-3.5 text-purple-500" />
                    <Text as="div" size="2" weight="medium">
                      1. Tahun Ajaran <span className="text-red-600">*</span>
                    </Text>
                  </div>
                  <Select.Root
                    value={selectedTahunAjaran}
                    onValueChange={(value) => {
                      setSelectedTahunAjaran(value)
                      setFormData({ ...formData, id_tahun_ajaran: value })
                      // Reset cascading selections
                      setSelectedTingkat('')
                      setSelectedKelas('')
                      setFormData(prev => ({ ...prev, id_siswa: undefined }))
                    }}
                    required
                  >
                    <Select.Trigger
                      style={{ borderRadius: 0, width: '100%' }}
                      placeholder="Pilih tahun ajaran..."
                    />
                    <Select.Content
                      position="popper"
                      style={{ borderRadius: 0 }}
                      className="border-2 border-slate-300 shadow-lg bg-white z-50"
                    >
                      {tahunAjaranList.map((ta) => (
                        <Select.Item
                          key={ta.id}
                          value={ta.id}
                          style={{ borderRadius: 0 }}
                          className="hover:bg-blue-50 cursor-pointer px-3 py-2"
                        >
                          {ta.nama} {ta.status_aktif ? '🟢' : ''}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Text size="1" className="text-slate-500 mt-1">
                    Pilih tahun ajaran siswa
                  </Text>
                </label>

                {/* Step 2: Tingkat */}
                <label>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Hash className="h-3.5 w-3.5 text-green-500" />
                    <Text as="div" size="2" weight="medium">
                      2. Tingkat <span className="text-red-600">*</span>
                    </Text>
                  </div>
                  <Select.Root
                    value={selectedTingkat}
                    onValueChange={(value) => {
                      setSelectedTingkat(value)
                      setFormData({ ...formData, tingkat: value })
                      // Reset cascading selections
                      setSelectedKelas('')
                      setFormData(prev => ({ ...prev, id_siswa: undefined }))
                    }}
                    disabled={!selectedTahunAjaran}
                    required
                  >
                    <Select.Trigger
                      style={{ borderRadius: 0, width: '100%' }}
                      placeholder={!selectedTahunAjaran ? "Pilih tahun ajaran dulu" : "Pilih tingkat..."}
                    />
                    <Select.Content
                      position="popper"
                      style={{ borderRadius: 0 }}
                      className="border-2 border-slate-300 shadow-lg bg-white z-50"
                    >
                      {tingkatOptions.map((tingkat) => (
                        <Select.Item
                          key={tingkat}
                          value={String(tingkat)}
                          style={{ borderRadius: 0 }}
                          className="hover:bg-blue-50 cursor-pointer px-3 py-2"
                        >
                          Tingkat {tingkat}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Text size="1" className="text-slate-500 mt-1">
                    {!selectedTahunAjaran ? '⚠️ Pilih tahun ajaran terlebih dahulu' : 'Pilih tingkat kelas siswa'}
                  </Text>
                </label>

                {/* Step 3: Kelas */}
                <label>
                  <div className="flex items-center gap-1.5 mb-1">
                    <School className="h-3.5 w-3.5 text-blue-500" />
                    <Text as="div" size="2" weight="medium">
                      3. Kelas <span className="text-red-600">*</span>
                    </Text>
                  </div>
                  <Select.Root
                    value={selectedKelas}
                    onValueChange={(value) => {
                      setSelectedKelas(value)
                      // Reset siswa selection
                      setFormData(prev => ({ ...prev, id_siswa: undefined }))
                    }}
                    disabled={!selectedTingkat}
                    required
                  >
                    <Select.Trigger
                      style={{ borderRadius: 0, width: '100%' }}
                      placeholder={!selectedTingkat ? "Pilih tingkat dulu" : "Pilih kelas..."}
                    />
                    <Select.Content
                      position="popper"
                      style={{ borderRadius: 0, maxHeight: '300px' }}
                      className="border-2 border-slate-300 shadow-lg bg-white z-50"
                    >
                      {kelasOptions.map((kelas) => (
                        <Select.Item
                          key={kelas.id}
                          value={kelas.id}
                          style={{ borderRadius: 0 }}
                          className="hover:bg-blue-50 cursor-pointer px-3 py-2"
                        >
                          Kelas {kelas.tingkat} {kelas.nama_sub_kelas}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Text size="1" className="text-slate-500 mt-1">
                    {!selectedTingkat ? '⚠️ Pilih tingkat terlebih dahulu' : 'Pilih kelas spesifik'}
                  </Text>
                </label>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                {/* Step 4: Siswa */}
                <label>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Users className="h-3.5 w-3.5 text-indigo-500" />
                    <Text as="div" size="2" weight="medium">
                      4. Siswa <span className="text-red-600">*</span>
                    </Text>
                  </div>
                  <Select.Root
                    value={formData.id_siswa}
                    onValueChange={(value) => setFormData({ ...formData, id_siswa: value })}
                    disabled={!selectedKelas}
                    required
                  >
                    <Select.Trigger
                      style={{ borderRadius: 0, width: '100%' }}
                      placeholder={!selectedKelas ? "Pilih kelas dulu" : "Pilih siswa..."}
                    />
                    <Select.Content
                      position="popper"
                      style={{ borderRadius: 0, maxHeight: '300px' }}
                      className="border-2 border-slate-300 shadow-lg bg-white z-50"
                    >
                      {filteredSiswaList.length === 0 && selectedKelas && (
                        <div className="px-3 py-4 text-center text-slate-500 text-sm">
                          Tidak ada siswa di kelas ini
                        </div>
                      )}
                      {filteredSiswaList.map((siswa) => (
                        <Select.Item
                          key={siswa.id}
                          value={siswa.id}
                          style={{ borderRadius: 0 }}
                          className="hover:bg-blue-50 cursor-pointer px-3 py-2"
                        >
                          {siswa.nama_lengkap} {siswa.nisn ? `(${siswa.nisn})` : ''}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Text size="1" className="text-slate-500 mt-1">
                    {!selectedKelas ? '⚠️ Pilih kelas terlebih dahulu' : `${filteredSiswaList.length} siswa tersedia`}
                  </Text>
                </label>

                {/* Peminatan */}
                <label>
                  <div className="flex items-center gap-1.5 mb-1">
                    <BookOpen className="h-3.5 w-3.5 text-orange-500" />
                    <Text as="div" size="2" weight="medium">
                      5. Peminatan <span className="text-red-600">*</span>
                    </Text>
                  </div>
                  <Select.Root
                    value={formData.id_peminatan}
                    onValueChange={(value) => setFormData({ ...formData, id_peminatan: value })}
                    required
                  >
                    <Select.Trigger
                      style={{ borderRadius: 0, width: '100%' }}
                      placeholder="Pilih peminatan..."
                    />
                    <Select.Content
                      position="popper"
                      style={{ borderRadius: 0, maxHeight: '300px' }}
                      className="border-2 border-slate-300 shadow-lg bg-white z-50"
                    >
                      {peminatanList.map((peminatan) => (
                        <Select.Item
                          key={peminatan.id}
                          value={peminatan.id}
                          style={{ borderRadius: 0 }}
                          className="hover:bg-blue-50 cursor-pointer px-3 py-2"
                        >
                          {peminatan.kode} - {peminatan.nama}
                        </Select.Item>
                      ))}
                    </Select.Content>
                  </Select.Root>
                  <Text size="1" className="text-slate-500 mt-1">
                    Pilih peminatan untuk siswa
                  </Text>
                </label>

                {/* Catatan */}
                <label>
                  <div className="flex items-center gap-1.5 mb-1">
                    <FileText className="h-3.5 w-3.5 text-orange-500" />
                    <Text as="div" size="2" weight="medium">
                      6. Catatan
                    </Text>
                  </div>
                  <TextField.Root
                    placeholder="Catatan tambahan (opsional)"
                    value={formData.catatan}
                    onChange={(e) => setFormData({ ...formData, catatan: e.target.value })}
                    style={{ borderRadius: 0 }}
                  />
                  <Text size="1" className="text-slate-500 mt-1">
                    Catatan atau informasi tambahan
                  </Text>
                </label>
              </div>
            </div>

            {/* Info Tanggal Otomatis - Full width below form (only in create mode) */}
            {!isEdit && selectedTahunAjaran && formData.tanggal_mulai && (
              <div className="border border-blue-200 bg-blue-50 px-3 py-3 mt-6">
                <Text size="2" weight="medium" className="text-blue-800 mb-2 block">
                  Tanggal Peminatan (Otomatis dari Tahun Ajaran)
                </Text>
                <div className="space-y-1">
                  <Text size="1" className="text-blue-700 block">
                    Mulai: {new Date(formData.tanggal_mulai).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                  </Text>
                  {formData.tanggal_selesai && (
                    <Text size="1" className="text-blue-700 block">
                      Selesai: {new Date(formData.tanggal_selesai).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </Text>
                  )}
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-200 mt-4">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                <Text size="2" className="text-red-800 font-medium">
                  {error}
                </Text>
              </div>
            )}
          </div>
        </form>

        {/* Footer */}
        <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-semibold transition-colors shadow-sm hover:shadow border border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ borderRadius: 0 }}
            >
              <span className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Batal
              </span>
            </button>
            <button
              type="submit"
              disabled={submitting}
              onClick={handleSubmit}
              className={`px-5 py-2 text-white text-sm font-semibold transition-colors shadow-sm hover:shadow border disabled:opacity-50 disabled:cursor-not-allowed ${
                isEdit 
                  ? 'bg-amber-600 hover:bg-amber-700 border-amber-700' 
                  : 'bg-green-600 hover:bg-green-700 border-green-700'
              }`}
              style={{ borderRadius: 0 }}
            >
              <span className="flex items-center gap-2">
                {isEdit ? <Edit3 className="h-4 w-4" /> : <BookOpen className="h-4 w-4" />}
                {submitting ? 'Menyimpan...' : isEdit ? 'Perbarui' : 'Simpan'}
              </span>
            </button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
