import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageLayout } from '../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { db } from '../../offline/db'
import { updatePembayaranWithRincian } from '../../offline/actions/pembayaran'
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
        
        const pembayaranData = await db.pembayaran.get(id)
        const tagihan = pembayaranData ? await db.tagihan.get(pembayaranData.id_tagihan) : null
        const rks = tagihan ? await db.riwayat_kelas_siswa.get(tagihan.id_riwayat_kelas_siswa) : null

        const rincianAll = await db.rincian_pembayaran.where('id_pembayaran').equals(id).toArray()
        const rincianData = rincianAll.sort((a, b) => (a.cicilan_ke || 0) - (b.cicilan_ke || 0))

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

        setSelectedTagihan(tagihan)
        
        // Set filters from tagihan data
        if (rks) {
          setSelectedTahunAjaran(rks.id_tahun_ajaran || '')
          setSelectedTingkat(undefined)
          setSelectedKelas(rks.id_kelas || '')
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
      const tahunData = await db.tahun_ajaran.orderBy('tanggal_mulai').reverse().toArray()
      setTahunAjaranList(tahunData || [])

      const kelasData = await db.kelas.orderBy('tingkat').toArray()
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
        const rks = await db.riwayat_kelas_siswa.where('id_tahun_ajaran').equals(selectedTahunAjaran).toArray()
        const siswaMap = new Map((await db.siswa.toArray()).map(s => [s.id, s]))
        const kelasMap = new Map((await db.kelas.toArray()).map(k => [k.id, k]))
        const tahunMap = new Map((await db.tahun_ajaran.toArray()).map(t => [t.id, t]))
        let filteredData = rks.map(r => ({
          id: r.id,
          siswa: siswaMap.get(r.id_siswa) ? { id: r.id_siswa, nama_lengkap: siswaMap.get(r.id_siswa).nama_lengkap, nisn: siswaMap.get(r.id_siswa).nisn } : null,
          kelas: kelasMap.get(r.id_kelas) ? { id: r.id_kelas, tingkat: kelasMap.get(r.id_kelas).tingkat, nama_sub_kelas: kelasMap.get(r.id_kelas).nama_sub_kelas } : null,
          tahun_ajaran: tahunMap.get(r.id_tahun_ajaran) ? { id: r.id_tahun_ajaran, nama: tahunMap.get(r.id_tahun_ajaran).nama } : null,
        }))
        
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
        const tAll = await db.tagihan.where('id_riwayat_kelas_siswa').equals(selectedSiswa).toArray()
        const t = tAll.sort((a, b) => {
          const dateA = new Date(a.tanggal_tagihan || 0)
          const dateB = new Date(b.tanggal_tagihan || 0)
          return dateB - dateA // descending (newest first)
        })
        const rincianByTagihan = new Map((await db.rincian_tagihan.toArray()).reduce((acc, r) => {
          const arr = acc.get(r.id_tagihan) || []
          arr.push(r)
          acc.set(r.id_tagihan, arr)
          return acc
        }, new Map()))
        const pembayaranByTagihan = new Map((await db.pembayaran.toArray()).reduce((acc, p) => {
          const arr = acc.get(p.id_tagihan) || []
          arr.push(p)
          acc.set(p.id_tagihan, arr)
          return acc
        }, new Map()))
        const rpByPembayaran = new Map((await db.rincian_pembayaran.toArray()).reduce((acc, rp) => {
          const arr = acc.get(rp.id_pembayaran) || []
          arr.push(rp)
          acc.set(rp.id_pembayaran, arr)
          return acc
        }, new Map()))
        const data = t.map(x => ({
          ...x,
          riwayat_kelas_siswa: { id: selectedSiswa },
          rincian_tagihan: rincianByTagihan.get(x.id) || [],
          pembayaran: (pembayaranByTagihan.get(x.id) || []).map(p => ({ ...p, rincian_pembayaran: rpByPembayaran.get(p.id) || [] })),
        }))

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
      await updatePembayaranWithRincian(id, {
        id_tagihan: formData.id_tagihan,
        nomor_pembayaran: formData.nomor_pembayaran,
        catatan: formData.catatan || null,
      }, rincianItems)

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
