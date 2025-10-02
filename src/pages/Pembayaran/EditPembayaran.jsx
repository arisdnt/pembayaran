import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageLayout } from '../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { CreatePembayaranHeader } from './components/CreatePembayaranHeader'
import { TagihanSelectorSection } from './components/TagihanSelectorSection'
import { InformasiPembayaranSection } from './components/InformasiPembayaranSection'
import { RincianPembayaranFormSection } from './components/RincianPembayaranFormSection'

function EditPembayaranContent() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  
  // State untuk filter tagihan
  const [tahunAjaranList, setTahunAjaranList] = useState([])
  const [tingkatList, setTingkatList] = useState([])
  const [kelasList, setKelasList] = useState([])
  const [siswaList, setSiswaList] = useState([])
  const [tagihanList, setTagihanList] = useState([])

  const [selectedTahunAjaran, setSelectedTahunAjaran] = useState('')
  const [selectedTingkat, setSelectedTingkat] = useState('')
  const [selectedKelas, setSelectedKelas] = useState('')
  const [selectedSiswa, setSelectedSiswa] = useState('')

  // State untuk form pembayaran header
  const [formData, setFormData] = useState({
    id_tagihan: '',
    nomor_pembayaran: '',
    catatan: '',
  })

  // State untuk rincian pembayaran (transaksi)
  const [rincianItems, setRincianItems] = useState([])

  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [selectedTagihan, setSelectedTagihan] = useState(null)

  // Fetch existing pembayaran data
  useEffect(() => {
    const fetchPembayaran = async () => {
      try {
        setLoading(true)
        
        // Fetch pembayaran header
        const { data: pembayaranData, error: pembayaranError } = await supabase
          .from('pembayaran')
          .select(`
            *,
            tagihan:id_tagihan(
              *,
              riwayat_kelas_siswa:id_riwayat_kelas_siswa(
                id,
                siswa:id_siswa(id, nama_lengkap, nisn),
                kelas:id_kelas(id, tingkat, nama_sub_kelas),
                tahun_ajaran:id_tahun_ajaran(id, nama)
              ),
              rincian_tagihan(id, deskripsi, jumlah),
              pembayaran(
                id, nomor_pembayaran,
                rincian_pembayaran(jumlah_dibayar, status)
              )
            )
          `)
          .eq('id', id)
          .single()

        if (pembayaranError) throw pembayaranError

        // Fetch rincian items
        const { data: rincianData, error: rincianError } = await supabase
          .from('rincian_pembayaran')
          .select('*')
          .eq('id_pembayaran', id)
          .order('cicilan_ke')

        if (rincianError) throw rincianError

        // Set form data
        setFormData({
          id_tagihan: pembayaranData.id_tagihan,
          nomor_pembayaran: pembayaranData.nomor_pembayaran,
          catatan: pembayaranData.catatan || '',
        })

        // Set rincian items
        setRincianItems(rincianData.map(item => ({
          id: item.id,
          nomor_transaksi: item.nomor_transaksi,
          jumlah_dibayar: item.jumlah_dibayar,
          tanggal_bayar: item.tanggal_bayar,
          metode_pembayaran: item.metode_pembayaran,
          referensi_pembayaran: item.referensi_pembayaran || '',
          catatan: item.catatan || '',
          status: item.status,
          cicilan_ke: item.cicilan_ke,
        })))

        // Set selected tagihan
        setSelectedTagihan(pembayaranData.tagihan)
        
        // Set filters from tagihan data
        const rks = pembayaranData.tagihan?.riwayat_kelas_siswa
        if (rks) {
          setSelectedTahunAjaran(rks.tahun_ajaran?.id || '')
          setSelectedTingkat(rks.kelas?.tingkat || '')
          setSelectedKelas(rks.kelas?.id || '')
          setSelectedSiswa(rks.id || '')
        }

        setLoading(false)
      } catch (err) {
        console.error('Error fetching pembayaran:', err)
        setError(err.message)
        setLoading(false)
      }
    }

    if (id) {
      fetchPembayaran()
    }
  }, [id])

  // Fetch master data
  useEffect(() => {
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    try {
      // Fetch tahun ajaran
      const { data: tahunData } = await supabase
        .from('tahun_ajaran')
        .select('*')
        .order('tanggal_mulai', { ascending: false })
      setTahunAjaranList(tahunData || [])

      // Fetch kelas untuk get tingkat
      const { data: kelasData } = await supabase
        .from('kelas')
        .select('*')
        .order('tingkat', { ascending: true })
      setKelasList(kelasData || [])
      
      // Extract unique tingkat
      const uniqueTingkat = [...new Set(kelasData?.map(k => k.tingkat) || [])].sort()
      setTingkatList(uniqueTingkat)

    } catch (err) {
      console.error('Error fetching master data:', err)
    }
  }

  // Fetch siswa based on filters (triggered after data loaded)
  useEffect(() => {
    const fetchSiswa = async () => {
      if (!selectedTahunAjaran) {
        setSiswaList([])
        return
      }

      try {
        let query = supabase
          .from('riwayat_kelas_siswa')
          .select(`
            id,
            siswa:id_siswa(id, nama_lengkap, nisn),
            kelas:id_kelas(id, tingkat, nama_sub_kelas),
            tahun_ajaran:id_tahun_ajaran(id, nama)
          `)
          .eq('id_tahun_ajaran', selectedTahunAjaran)

        const { data } = await query

        let filteredData = data || []
        
        if (selectedTingkat) {
          filteredData = filteredData.filter(s => s.kelas?.tingkat === selectedTingkat)
        }
        
        if (selectedKelas) {
          filteredData = filteredData.filter(s => s.kelas?.id === selectedKelas)
        }

        setSiswaList(filteredData)
      } catch (err) {
        console.error('Error fetching siswa:', err)
      }
    }

    if (!loading && selectedTahunAjaran) {
      fetchSiswa()
    }
  }, [selectedTahunAjaran, selectedTingkat, selectedKelas, loading])

  // Fetch tagihan for selected siswa
  useEffect(() => {
    const fetchTagihan = async () => {
      if (!selectedSiswa) {
        setTagihanList([])
        return
      }

      try {
        const { data } = await supabase
          .from('tagihan')
          .select(`
            *,
            riwayat_kelas_siswa:id_riwayat_kelas_siswa(
              siswa:id_siswa(nama_lengkap, nisn),
              kelas:id_kelas(tingkat, nama_sub_kelas),
              tahun_ajaran:id_tahun_ajaran(nama)
            ),
            rincian_tagihan(
              id, deskripsi, jumlah,
              jenis_pembayaran:id_jenis_pembayaran(kode, nama)
            ),
            pembayaran(
              id, nomor_pembayaran,
              rincian_pembayaran(jumlah_dibayar, status)
            )
          `)
          .eq('id_riwayat_kelas_siswa', selectedSiswa)
          .order('tanggal_tagihan', { ascending: false })

        setTagihanList(data || [])
      } catch (err) {
        console.error('Error fetching tagihan:', err)
      }
    }

    if (!loading && selectedSiswa) {
      fetchTagihan()
    }
  }, [selectedSiswa, loading])

  // Calculate total tagihan dan sudah dibayar
  const calculateTagihanSummary = (tagihan) => {
    if (!tagihan) return { total: 0, sudahDibayar: 0, sisa: 0 }

    const total = tagihan.rincian_tagihan?.reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0) || 0
    
    const sudahDibayar = tagihan.pembayaran?.reduce((sum, p) => {
      const verified = p.rincian_pembayaran?.filter(r => r.status === 'verified') || []
      return sum + verified.reduce((s, r) => s + parseFloat(r.jumlah_dibayar || 0), 0)
    }, 0) || 0

    return {
      total,
      sudahDibayar,
      sisa: total - sudahDibayar
    }
  }

  // Handle tagihan selection
  const handleTagihanSelect = (tagihanId) => {
    const tagihan = tagihanList.find(t => t.id === tagihanId)
    setSelectedTagihan(tagihan)
    setFormData({ ...formData, id_tagihan: tagihanId })
  }

  // Calculate next cicilan_ke for new items (exclude existing items)
  const getNextCicilanKe = () => {
    if (!selectedTagihan || !selectedTagihan.pembayaran) return 1
    
    // Get all cicilan from all pembayaran for this tagihan
    const allRincian = selectedTagihan.pembayaran.flatMap(p => p.rincian_pembayaran || [])
    const maxCicilan = Math.max(0, ...allRincian.map(r => r.cicilan_ke || 0))
    
    // Also check existing items in current form
    const maxInForm = Math.max(0, ...rincianItems.map(r => r.cicilan_ke || 0))
    
    return Math.max(maxCicilan, maxInForm) + 1
  }

  const totalPembayaran = rincianItems.reduce((sum, item) => sum + parseFloat(item.jumlah_dibayar || 0), 0)

  const handleAddRincian = () => {
    const nextCicilan = getNextCicilanKe()
    setRincianItems([
      ...rincianItems,
      {
        nomor_transaksi: '',
        jumlah_dibayar: 0,
        tanggal_bayar: new Date().toISOString().split('T')[0],
        metode_pembayaran: '',
        referensi_pembayaran: '',
        catatan: '',
        status: 'pending',
        cicilan_ke: nextCicilan,
      },
    ])
  }

  const handleRemoveRincian = (index) => {
    setRincianItems(rincianItems.filter((_, i) => i !== index))
  }

  const handleRincianChange = (index, field, value) => {
    const updated = [...rincianItems]
    updated[index] = { ...updated[index], [field]: value }
    setRincianItems(updated)
  }

  const handleInfoChange = (field, value) => {
    setFormData({ ...formData, [field]: value })
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setError('')

    // Validation
    if (!formData.id_tagihan || !formData.nomor_pembayaran) {
      setError('Tagihan dan Nomor Pembayaran wajib diisi')
      setSubmitting(false)
      return
    }

    if (rincianItems.length === 0) {
      setError('Minimal harus ada 1 transaksi pembayaran')
      setSubmitting(false)
      return
    }

    // Validate each rincian item
    for (let i = 0; i < rincianItems.length; i++) {
      const item = rincianItems[i]
      if (!item.nomor_transaksi || !item.jumlah_dibayar || !item.tanggal_bayar || !item.metode_pembayaran) {
        setError(`Transaksi #${i + 1}: Semua field wajib diisi kecuali referensi dan catatan`)
        setSubmitting(false)
        return
      }
      if (parseFloat(item.jumlah_dibayar) <= 0) {
        setError(`Transaksi #${i + 1}: Jumlah dibayar harus lebih dari 0`)
        setSubmitting(false)
        return
      }
    }

    try {
      // 1. Update pembayaran header
      const { error: headerError } = await supabase
        .from('pembayaran')
        .update({
          id_tagihan: formData.id_tagihan,
          nomor_pembayaran: formData.nomor_pembayaran,
          catatan: formData.catatan || null,
        })
        .eq('id', id)

      if (headerError) throw headerError

      // 2. Delete existing rincian (simple approach - replace all)
      const { error: deleteError } = await supabase
        .from('rincian_pembayaran')
        .delete()
        .eq('id_pembayaran', id)

      if (deleteError) throw deleteError

      // 3. Insert new rincian items
      const rincianData = rincianItems.map((item) => ({
        id_pembayaran: id,
        nomor_transaksi: item.nomor_transaksi,
        jumlah_dibayar: parseFloat(item.jumlah_dibayar),
        tanggal_bayar: item.tanggal_bayar,
        metode_pembayaran: item.metode_pembayaran,
        referensi_pembayaran: item.referensi_pembayaran || null,
        catatan: item.catatan || null,
        status: item.status || 'pending',
        cicilan_ke: item.cicilan_ke,
      }))

      const { error: rincianError } = await supabase
        .from('rincian_pembayaran')
        .insert(rincianData)

      if (rincianError) throw rincianError

      // Navigate back
      navigate('/pembayaran')

    } catch (err) {
      console.error('Error updating pembayaran:', err)
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const tagihanSummary = selectedTagihan ? calculateTagihanSummary(selectedTagihan) : null
  const nextCicilanKe = getNextCicilanKe()

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <Text size="3" className="text-slate-500">Memuat data pembayaran...</Text>
        </div>
      </PageLayout>
    )
  }

  const canSubmit = formData.id_tagihan && formData.nomor_pembayaran && rincianItems.length > 0

  return (
    <PageLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <CreatePembayaranHeader
          onBack={() => navigate('/pembayaran')}
          onSubmit={handleSubmit}
          submitting={submitting}
          canSubmit={canSubmit}
        />

        {/* Error Alert */}
        {error && (
          <div className="shrink-0 mx-6 mt-4 flex items-start gap-3 bg-red-50 border-2 border-red-200 px-4 py-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <Text size="2" weight="medium" className="text-red-700 mb-1">
                Error
              </Text>
              <Text size="2" className="text-red-600">
                {error}
              </Text>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden px-6 pb-6 pt-4">
          <div className="grid grid-cols-3 gap-4 h-full">
            {/* Left Column */}
            <div className="flex flex-col h-full overflow-hidden">
              <TagihanSelectorSection
                tahunAjaranList={tahunAjaranList}
                tingkatList={tingkatList}
                kelasList={kelasList}
                siswaList={siswaList}
                tagihanList={tagihanList}
                selectedTahunAjaran={selectedTahunAjaran}
                onTahunAjaranChange={(val) => {
                  setSelectedTahunAjaran(val)
                  setSelectedTingkat('')
                  setSelectedKelas('')
                  setSelectedSiswa('')
                }}
                selectedTingkat={selectedTingkat}
                onTingkatChange={(val) => {
                  setSelectedTingkat(val)
                  setSelectedKelas('')
                }}
                selectedKelas={selectedKelas}
                onKelasChange={setSelectedKelas}
                selectedSiswa={selectedSiswa}
                onSiswaChange={setSelectedSiswa}
                selectedTagihan={formData.id_tagihan}
                onTagihanChange={handleTagihanSelect}
                tagihanSummary={tagihanSummary}
              />
            </div>

            {/* Right Column */}
            <div className="col-span-2 flex flex-col gap-4 h-full overflow-hidden">
              <InformasiPembayaranSection
                formData={formData}
                onChange={handleInfoChange}
              />

              <RincianPembayaranFormSection
                rincianItems={rincianItems}
                onAdd={handleAddRincian}
                onRemove={handleRemoveRincian}
                onChange={handleRincianChange}
                totalPembayaran={totalPembayaran}
                nextCicilanKe={nextCicilanKe}
                tagihanSummary={tagihanSummary}
              />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export function EditPembayaran() {
  return <EditPembayaranContent />
}
