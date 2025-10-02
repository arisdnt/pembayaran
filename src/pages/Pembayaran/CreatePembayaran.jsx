import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { CreatePembayaranHeader } from './components/CreatePembayaranHeader'
import { TagihanSelectorSection } from './components/TagihanSelectorSection'
import { InformasiPembayaranSection } from './components/InformasiPembayaranSection'
import { RincianPembayaranFormSection } from './components/RincianPembayaranFormSection'

function CreatePembayaranContent() {
  const navigate = useNavigate()

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

  // Fetch siswa based on filters
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

    fetchSiswa()
  }, [selectedTahunAjaran, selectedTingkat, selectedKelas])

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
              rincian_pembayaran(jumlah_dibayar)
            )
          `)
          .eq('id_riwayat_kelas_siswa', selectedSiswa)
          .order('tanggal_tagihan', { ascending: false })

        setTagihanList(data || [])
      } catch (err) {
        console.error('Error fetching tagihan:', err)
      }
    }

    fetchTagihan()
  }, [selectedSiswa])

  // Calculate total tagihan dan sudah dibayar
  const calculateTagihanSummary = (tagihan) => {
    if (!tagihan) return { total: 0, sudahDibayar: 0, sisa: 0 }

    const total = tagihan.rincian_tagihan?.reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0) || 0
    
    const sudahDibayar = tagihan.pembayaran?.reduce((sum, p) => {
      return sum + (p.rincian_pembayaran?.reduce((s, r) => s + parseFloat(r.jumlah_dibayar || 0), 0) || 0)
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

  // Calculate next cicilan_ke
  const getNextCicilanKe = () => {
    if (!selectedTagihan || !selectedTagihan.pembayaran) return 1
    
    const allRincian = selectedTagihan.pembayaran.flatMap(p => p.rincian_pembayaran || [])
    const maxCicilan = Math.max(0, ...allRincian.map(r => r.cicilan_ke || 0))
    return maxCicilan + 1
  }

  const totalPembayaran = rincianItems.reduce((sum, item) => sum + parseFloat(item.jumlah_dibayar || 0), 0)

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

    for (let i = 0; i < rincianItems.length; i++) {
      if (!rincianItems[i].jumlah_dibayar || !rincianItems[i].metode_pembayaran || !rincianItems[i].tanggal_bayar) {
        setError(`Transaksi ${i + 1}: Jumlah, metode, dan tanggal wajib diisi`)
        setSubmitting(false)
        return
      }
    }

    try {
      // 1. Insert pembayaran header
      const { data: pembayaranData, error: pembayaranError } = await supabase
        .from('pembayaran')
        .insert({
          id_tagihan: formData.id_tagihan,
          nomor_pembayaran: formData.nomor_pembayaran,
          catatan: formData.catatan || null,
        })
        .select()
        .single()

      if (pembayaranError) throw pembayaranError

      // 2. Insert rincian pembayaran
      const nextCicilan = getNextCicilanKe()
      const rincianData = rincianItems.map((item, index) => ({
        id_pembayaran: pembayaranData.id,
        nomor_transaksi: item.nomor_transaksi,
        jumlah_dibayar: item.jumlah_dibayar,
        tanggal_bayar: item.tanggal_bayar,
        metode_pembayaran: item.metode_pembayaran,
        referensi_pembayaran: item.referensi_pembayaran || null,
        catatan: item.catatan || null,
        cicilan_ke: nextCicilan + index,
      }))

      const { error: rincianError } = await supabase
        .from('rincian_pembayaran')
        .insert(rincianData)

      if (rincianError) throw rincianError

      navigate('/pembayaran')
    } catch (err) {
      setError(err.message)
      setSubmitting(false)
    }
  }

  const addRincianItem = (formData) => {
    setRincianItems([...rincianItems, formData])
  }

  const removeRincianItem = (index) => {
    setRincianItems(rincianItems.filter((_, i) => i !== index))
  }

  const updateRincianItem = (index, field, value) => {
    const updated = [...rincianItems]
    updated[index][field] = value
    setRincianItems(updated)
  }

  const tagihanSummary = selectedTagihan ? calculateTagihanSummary(selectedTagihan) : null

  return (
    <PageLayout>
      <div className="flex flex-col h-full">
        <CreatePembayaranHeader
          onBack={() => navigate('/pembayaran')}
          onSubmit={handleSubmit}
          submitting={submitting}
          canSubmit={rincianItems.length > 0 && formData.id_tagihan}
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
                onChange={(field, value) => setFormData({ ...formData, [field]: value })}
              />

              <RincianPembayaranFormSection
                rincianItems={rincianItems}
                onAdd={addRincianItem}
                onRemove={removeRincianItem}
                onChange={updateRincianItem}
                totalPembayaran={totalPembayaran}
                nextCicilanKe={getNextCicilanKe()}
                tagihanSummary={tagihanSummary}
              />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export function CreatePembayaran() {
  return <CreatePembayaranContent />
}
