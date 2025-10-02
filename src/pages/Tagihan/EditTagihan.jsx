import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageLayout } from '../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useTagihan } from './hooks/useTagihan'
import { CreateTagihanHeader } from './components/CreateTagihanHeader'
import { TargetSiswaSection } from './components/TargetSiswaSection'
import { InformasiTagihanSection } from './components/InformasiTagihanSection'
import { RincianTagihanSection } from './components/RincianTagihanSection'

function EditTagihanContent() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { riwayatKelasSiswaList, tingkatList, kelasList, tahunAjaranList } = useTagihan()

  const [loading, setLoading] = useState(true)
  const [targetType] = useState('siswa') // Always siswa for edit mode
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

  // Fetch existing tagihan data
  useEffect(() => {
    const fetchTagihan = async () => {
      try {
        setLoading(true)
        
        // Fetch tagihan header
        const { data: tagihanData, error: tagihanError } = await supabase
          .from('tagihan')
          .select(`
            *,
            riwayat_kelas_siswa:id_riwayat_kelas_siswa(
              id,
              siswa:id_siswa(nama_lengkap, nisn),
              kelas:id_kelas(id, tingkat, nama_sub_kelas),
              tahun_ajaran:id_tahun_ajaran(id, nama)
            )
          `)
          .eq('id', id)
          .single()

        if (tagihanError) throw tagihanError

        // Fetch rincian items
        const { data: rincianData, error: rincianError } = await supabase
          .from('rincian_tagihan')
          .select(`
            *,
            jenis_pembayaran:id_jenis_pembayaran(kode, nama)
          `)
          .eq('id_tagihan', id)
          .order('urutan')

        if (rincianError) throw rincianError

        // Set form data
        setFormData({
          id_riwayat_kelas_siswa: tagihanData.id_riwayat_kelas_siswa,
          nomor_tagihan: tagihanData.nomor_tagihan,
          judul: tagihanData.judul,
          deskripsi: tagihanData.deskripsi || '',
          tanggal_tagihan: tagihanData.tanggal_tagihan,
          tanggal_jatuh_tempo: tagihanData.tanggal_jatuh_tempo,
        })

        // Set rincian items
        setRincianItems(rincianData.map(item => ({
          id: item.id,
          id_jenis_pembayaran: item.id_jenis_pembayaran,
          deskripsi: item.deskripsi,
          jumlah: item.jumlah,
          urutan: item.urutan,
        })))

        setLoading(false)
      } catch (err) {
        console.error('Error fetching tagihan:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    if (id) {
      fetchTagihan()
    }
  }, [id])

  // Fetch jenis pembayaran dengan filter (sama seperti CreateTagihan)
  useEffect(() => {
    const fetchJenis = async () => {
      let query = supabase
        .from('jenis_pembayaran')
        .select(`
          id, kode, nama, jumlah_default, id_tahun_ajaran, tingkat,
          tahun_ajaran:id_tahun_ajaran(nama)
        `)
        .eq('status_aktif', true)

      let filterTahunAjaran = null
      let filterTingkat = null

      if (formData.id_riwayat_kelas_siswa) {
        const selectedSiswa = riwayatKelasSiswaList?.find(s => s.id === formData.id_riwayat_kelas_siswa)
        if (selectedSiswa) {
          filterTahunAjaran = selectedSiswa.tahun_ajaran?.id
          filterTingkat = selectedSiswa.kelas?.tingkat
        }
      }

      if (filterTahunAjaran) {
        query = query.eq('id_tahun_ajaran', filterTahunAjaran)
      }

      if (filterTingkat) {
        query = query.eq('tingkat', filterTingkat)
      }

      const { data } = await query.order('kode')

      setJenisPembayaranList(data || [])
    }
    
    if (!loading && formData.id_riwayat_kelas_siswa) {
      fetchJenis()
    }
  }, [formData.id_riwayat_kelas_siswa, riwayatKelasSiswaList, loading])

  const filteredSiswa = riwayatKelasSiswaList?.filter(s => {
    if (selectedTahunAjaran && s.tahun_ajaran?.id !== selectedTahunAjaran) return false
    if (selectedTingkat && s.kelas?.tingkat !== selectedTingkat) return false
    if (selectedKelas && s.kelas?.id !== selectedKelas) return false
    return true
  }) || []

  const filteredJenisPembayaran = jenisPembayaranList.filter(jenis =>
    jenis.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    jenis.kode.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalTagihan = rincianItems.reduce((sum, item) => sum + parseFloat(item.jumlah || 0), 0)

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
      // Update tagihan header
      const { error: tagihanError } = await supabase
        .from('tagihan')
        .update({
          nomor_tagihan: formData.nomor_tagihan,
          judul: formData.judul,
          deskripsi: formData.deskripsi || null,
          tanggal_tagihan: formData.tanggal_tagihan,
          tanggal_jatuh_tempo: formData.tanggal_jatuh_tempo,
        })
        .eq('id', id)

      if (tagihanError) throw tagihanError

      // Delete existing rincian
      const { error: deleteError } = await supabase
        .from('rincian_tagihan')
        .delete()
        .eq('id_tagihan', id)

      if (deleteError) throw deleteError

      // Insert new rincian
      const rincianData = rincianItems.map(item => ({
        id_tagihan: id,
        id_jenis_pembayaran: item.id_jenis_pembayaran,
        deskripsi: item.deskripsi,
        jumlah: item.jumlah,
        urutan: item.urutan,
      }))

      const { error: rincianError } = await supabase
        .from('rincian_tagihan')
        .insert(rincianData)

      if (rincianError) throw rincianError

      navigate('/tagihan')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const filterInfo = formData.id_riwayat_kelas_siswa ? (
    <div className="px-3 py-2 bg-blue-50 border-2 border-blue-200">
      <Text size="2" className="text-blue-700">
        <strong>Filter aktif:</strong> Item difilter berdasarkan{' '}
        {(() => {
          const siswa = riwayatKelasSiswaList?.find(s => s.id === formData.id_riwayat_kelas_siswa)
          return `${siswa?.tahun_ajaran?.nama || ''}${siswa?.kelas?.tingkat ? ` - Tingkat ${siswa.kelas.tingkat}` : ''}`
        })()}
      </Text>
    </div>
  ) : (
    <div className="px-3 py-2 bg-amber-50 border-2 border-amber-200">
      <Text size="2" className="text-amber-700">
        Memuat data tagihan...
      </Text>
    </div>
  )

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <Text size="3" className="text-slate-500">Memuat data tagihan...</Text>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout>
      <div className="flex flex-col h-full">
        <CreateTagihanHeader
          onBack={() => navigate('/tagihan')}
          onSubmit={handleSubmit}
          submitting={submitting}
          canSubmit={rincianItems.length > 0}
          isEdit={true}
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
              onTargetTypeChange={() => {}} // Disabled for edit
              selectedTahunAjaran={selectedTahunAjaran}
              onTahunAjaranChange={setSelectedTahunAjaran}
              selectedTingkat={selectedTingkat}
              onTingkatChange={setSelectedTingkat}
              selectedKelas={selectedKelas}
              onKelasChange={setSelectedKelas}
              selectedSiswa={formData.id_riwayat_kelas_siswa}
              onSiswaChange={() => {}} // Disabled for edit
              tahunAjaranList={tahunAjaranList}
              tingkatList={tingkatList}
              kelasList={kelasList}
              riwayatKelasSiswaList={riwayatKelasSiswaList}
              filteredSiswaCount={filteredSiswa.length}
              isEdit={true}
            />

            <InformasiTagihanSection
              formData={formData}
              onChange={(field, value) => setFormData({...formData, [field]: value})}
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

export function EditTagihan() {
  return <EditTagihanContent />
}
