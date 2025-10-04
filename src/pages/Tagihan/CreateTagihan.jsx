import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { db } from '../../offline/db'
import { createTagihanWithRincian } from '../../offline/actions/tagihan'
import { useTagihan } from './hooks/useTagihan'
import { CreateTagihanHeader } from './components/CreateTagihanHeader'
import { TargetSiswaSection } from './components/TargetSiswaSection'
import { InformasiTagihanSection } from './components/InformasiTagihanSection'
import { RincianTagihanSection } from './components/RincianTagihanSection'

function CreateTagihanContent() {
  const navigate = useNavigate()
  const { riwayatKelasSiswaList, tingkatList, kelasList, tahunAjaranList } = useTagihan()

  const [targetType, setTargetType] = useState('siswa')
  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState('')
  const [selectedTingkat, setSelectedTingkat] = useState('')
  const [selectedKelas, setSelectedKelas] = useState('')
  const [jenisPembayaranList, setJenisPembayaranList] = useState([])

  const [formData, setFormData] = useState({
    id_riwayat_kelas_siswa: '',
    nomor_tagihan: '',
    judul: '',
    deskripsi: '',
    tanggal_tagihan: new Date().toISOString().split('T')[0],
    tanggal_jatuh_tempo: '',
  })

  const [rincianItems, setRincianItems] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showDropdown, setShowDropdown] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Fetch jenis pembayaran dengan filter
  useEffect(() => {
    const fetchJenis = async () => {
      const all = await db.jenis_pembayaran.orderBy('kode').toArray()
      let filterTahunAjaran = selectedTahunAjaran || null
      let filterTingkat = null

      if (targetType === 'siswa' && formData.id_riwayat_kelas_siswa) {
        const selectedSiswa = riwayatKelasSiswaList?.find(s => s.id === formData.id_riwayat_kelas_siswa)
        if (selectedSiswa) filterTingkat = selectedSiswa.kelas?.tingkat || null
      } else {
        filterTingkat = selectedTingkat || null
      }

      const filtered = all.filter(j => {
        if (j.status_aktif === false) return false
        if (filterTahunAjaran && j.id_tahun_ajaran !== filterTahunAjaran) return false
        if (filterTingkat && j.tingkat !== filterTingkat) return false
        return true
      })
      setJenisPembayaranList(filtered)
    }
    fetchJenis()
  }, [targetType, formData.id_riwayat_kelas_siswa, selectedTahunAjaran, selectedTingkat, riwayatKelasSiswaList])

  const filteredSiswa = riwayatKelasSiswaList?.filter(s => {
    if (selectedTahunAjaran && s.tahun_ajaran?.id !== selectedTahunAjaran) return false
    if (targetType === 'tingkat' && selectedTingkat && s.kelas?.tingkat !== selectedTingkat) return false
    if (targetType === 'kelas' && selectedKelas && s.kelas?.id !== selectedKelas) return false
    return true
  }) || []

  const filteredJenisPembayaran = jenisPembayaranList.filter(jenis =>
    jenis.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jenis.kode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalTagihan = rincianItems.reduce((sum, item) => sum + parseFloat(item.jumlah || 0), 0)

  const generateNomorTagihan = async () => {
    try {
      const now = new Date()
      const year = now.getFullYear()
      const month = String(now.getMonth() + 1).padStart(2, '0')
      
      // Get all tagihan and filter in JavaScript (nomor_tagihan is not indexed)
      const prefix = `TGH-${year}-${month}`
      
      const allTagihan = await db.tagihan.toArray()
      const existingTagihan = allTagihan.filter(t => 
        t.nomor_tagihan && t.nomor_tagihan.startsWith(prefix)
      )
      
      // Find highest sequence number
      let maxSequence = 0
      existingTagihan.forEach(t => {
        const parts = t.nomor_tagihan.split('-')
        if (parts.length === 4) {
          const seq = parseInt(parts[3], 10)
          if (!isNaN(seq) && seq > maxSequence) {
            maxSequence = seq
          }
        }
      })
      
      const nextSequence = maxSequence + 1
      const nomorBaru = `${prefix}-${String(nextSequence).padStart(3, '0')}`
      
      // Use functional update to avoid stale closure
      setFormData(prev => ({...prev, nomor_tagihan: nomorBaru}))
    } catch (err) {
      console.error('Error generating nomor tagihan:', err)
      setError('Gagal generate nomor tagihan: ' + err.message)
    }
  }

  const addJenisToCart = (jenis) => {
    const existingIndex = rincianItems.findIndex(item => item.id_jenis_pembayaran === jenis.id)
    if (existingIndex >= 0) {
      const updated = [...rincianItems]
      updated[existingIndex].jumlah = (parseFloat(updated[existingIndex].jumlah || 0) + parseFloat(jenis.jumlah_default || 0)).toString()
      setRincianItems(updated)
    } else {
      setRincianItems([...rincianItems, {
        id_jenis_pembayaran: jenis.id,
        deskripsi: jenis.nama,
        jumlah: jenis.jumlah_default || '',
        urutan: rincianItems.length + 1,
      }])
    }
    setSearchTerm('')
    setShowDropdown(false)
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    if (!formData.nomor_tagihan || !formData.judul || !formData.tanggal_tagihan || !formData.tanggal_jatuh_tempo) {
      setError('Nomor tagihan, judul, tanggal tagihan, dan jatuh tempo wajib diisi')
      setSubmitting(false)
      return
    }

    if (rincianItems.length === 0) {
      setError('Minimal harus ada 1 rincian item')
      setSubmitting(false)
      return
    }

    for (let i = 0; i < rincianItems.length; i++) {
      if (!rincianItems[i].id_jenis_pembayaran || !rincianItems[i].jumlah) {
        setError(`Rincian item ${i + 1}: Jenis pembayaran dan jumlah wajib diisi`)
        setSubmitting(false)
        return
      }
    }

    try {
      let targetList = []

      if (targetType === 'siswa') {
        if (!formData.id_riwayat_kelas_siswa) {
          setError('Siswa wajib dipilih')
          setSubmitting(false)
          return
        }
        targetList = [formData.id_riwayat_kelas_siswa]
      } else {
        if (!selectedTahunAjaran) {
          setError('Tahun ajaran wajib dipilih untuk tagihan massal')
          setSubmitting(false)
          return
        }
        targetList = filteredSiswa.map(s => s.id)
      }

      if (targetList.length === 0) {
        setError('Tidak ada siswa yang dipilih')
        setSubmitting(false)
        return
      }

      for (let i = 0; i < targetList.length; i++) {
        const nomorTagihan = targetList.length > 1
          ? `${formData.nomor_tagihan}-${String(i + 1).padStart(3, '0')}`
          : formData.nomor_tagihan

        const header = {
          id_riwayat_kelas_siswa: targetList[i],
          nomor_tagihan: nomorTagihan,
          judul: formData.judul,
          deskripsi: formData.deskripsi || null,
          tanggal_tagihan: formData.tanggal_tagihan,
          tanggal_jatuh_tempo: formData.tanggal_jatuh_tempo,
        }
        await createTagihanWithRincian(header, rincianItems)
      }

      navigate('/tagihan')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const filterInfo = (targetType === 'siswa' && formData.id_riwayat_kelas_siswa) || (targetType !== 'siswa' && selectedTahunAjaran) ? (
    <div className="px-3 py-2 bg-blue-50 border-2 border-blue-200">
      <Text size="2" className="text-blue-700">
        <strong>Filter aktif:</strong> Item difilter berdasarkan{' '}
        {targetType === 'siswa' ?
          (() => {
            const siswa = riwayatKelasSiswaList?.find(s => s.id === formData.id_riwayat_kelas_siswa)
            return `${siswa?.tahun_ajaran?.nama || ''}${siswa?.kelas?.tingkat ? ` - Tingkat ${siswa.kelas.tingkat}` : ''}`
          })() :
          `${tahunAjaranList?.find(ta => ta.id === selectedTahunAjaran)?.nama || ''}${selectedTingkat ? ` - Tingkat ${selectedTingkat}` : ''}`
        }
      </Text>
    </div>
  ) : (
    <div className="px-3 py-2 bg-amber-50 border-2 border-amber-200">
      <Text size="2" className="text-amber-700">
        Pilih siswa atau tahun ajaran terlebih dahulu untuk menampilkan item pembayaran yang sesuai
      </Text>
    </div>
  )

  return (
    <PageLayout>
      <div className="flex flex-col h-full">
        <CreateTagihanHeader
          onBack={() => navigate('/tagihan')}
          onSubmit={handleSubmit}
          submitting={submitting}
          canSubmit={rincianItems.length > 0}
        />

        {error && (
          <div className="shrink-0 mx-6 mb-3 flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <Text size="2" weight="medium" className="text-red-700">Terjadi kesalahan</Text>
              <Text size="2" className="text-red-600">{error}</Text>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-hidden px-6 pb-6 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4 shrink-0">
            <TargetSiswaSection
              targetType={targetType}
              onTargetTypeChange={setTargetType}
              selectedTahunAjaran={selectedTahunAjaran}
              onTahunAjaranChange={setSelectedTahunAjaran}
              selectedTingkat={selectedTingkat}
              onTingkatChange={setSelectedTingkat}
              selectedKelas={selectedKelas}
              onKelasChange={setSelectedKelas}
              selectedSiswa={formData.id_riwayat_kelas_siswa}
              onSiswaChange={(v) => setFormData({...formData, id_riwayat_kelas_siswa: v})}
              tahunAjaranList={tahunAjaranList}
              tingkatList={tingkatList}
              kelasList={kelasList}
              riwayatKelasSiswaList={riwayatKelasSiswaList}
              filteredSiswaCount={filteredSiswa.length}
            />

            <InformasiTagihanSection
              formData={formData}
              onChange={(field, value) => setFormData({...formData, [field]: value})}
              onGenerateNomor={generateNomorTagihan}
            />
          </div>

          <RincianTagihanSection
            rincianItems={rincianItems}
            jenisPembayaranList={jenisPembayaranList}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            showDropdown={showDropdown}
            onSearchFocus={() => setShowDropdown(true)}
            onSearchBlur={() => setTimeout(() => setShowDropdown(false), 200)}
            onAddJenis={addJenisToCart}
            onRemoveRincian={(idx) => setRincianItems(rincianItems.filter((_, i) => i !== idx))}
            onRincianChange={(idx, field, value) => {
              const updated = [...rincianItems]
              updated[idx][field] = value
              setRincianItems(updated)
            }}
            filteredJenisPembayaran={filteredJenisPembayaran}
            filterInfo={filterInfo}
            totalTagihan={totalTagihan}
          />
        </div>
      </div>
    </PageLayout>
  )
}

export function CreateTagihan() {
  return <CreateTagihanContent />
}
