import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageLayout } from '../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle, ArrowLeft, Save } from 'lucide-react'
import { InformasiPembayaranSection } from './components/InformasiPembayaranSection'
import { RincianPembayaranFormSection } from './components/RincianPembayaranFormSection'
import { db } from '../../offline/db'
import { updatePembayaranWithRincian } from '../../offline/actions/pembayaran'
import { formatCurrency } from './utils/currencyHelpers'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function EditPembayaranContent() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const [formData, setFormData] = useState({ nomor_pembayaran: '', catatan: '' })
  const [rincianItems, setRincianItems] = useState([])
  const [validationErrors, setValidationErrors] = useState({})

  const [siswaInfo, setSiswaInfo] = useState(null)
  const [tagihanInfo, setTagihanInfo] = useState(null)
  const [tagihanTotals, setTagihanTotals] = useState(null)
  const [maxCicilanSeed, setMaxCicilanSeed] = useState(0)

  useEffect(() => {
    const fetchPembayaran = async () => {
      try {
        setLoading(true)
        setError('')
        setValidationErrors({})

        const pembayaranRow = await db.pembayaran.get(id)
        if (!pembayaranRow) {
          setNotFound(true)
          setError('Pembayaran tidak ditemukan')
          setLoading(false)
          return
        }

        const tagihan = await db.tagihan.get(pembayaranRow.id_tagihan)
        if (!tagihan) {
          setError('Tagihan untuk pembayaran ini tidak ditemukan')
          setNotFound(true)
          setLoading(false)
          return
        }

        const rks = await db.riwayat_kelas_siswa.get(tagihan.id_riwayat_kelas_siswa)
        const siswa = rks ? await db.siswa.get(rks.id_siswa) : null
        const kelas = rks ? await db.kelas.get(rks.id_kelas) : null
        const tahun = rks ? await db.tahun_ajaran.get(rks.id_tahun_ajaran) : null

        setSiswaInfo({
          nama: siswa?.nama_lengkap || '-',
          nisn: siswa?.nisn || '-',
          kelas: kelas ? `${kelas.tingkat || '-'} ${kelas.nama_sub_kelas || ''}`.trim() : '-',
          tahunAjaran: tahun?.nama || '-',
        })

        setTagihanInfo({
          id: tagihan.id,
          nomor: tagihan.nomor_tagihan || '-',
          judul: tagihan.judul || '-',
          tanggal_tagihan: tagihan.tanggal_tagihan || null,
          tahunAjaran: tahun?.nama || '-',
        })

        const rincianTagihan = await db.rincian_tagihan.where('id_tagihan').equals(tagihan.id).toArray()
        const totalTagihan = rincianTagihan.reduce((sum, r) => sum + parseFloat(r.jumlah || 0), 0)

        const semuaPembayaran = await db.pembayaran.where('id_tagihan').equals(tagihan.id).toArray()
        const pembayaranIds = semuaPembayaran.map(p => p.id)

        let seluruhRincian = []
        if (pembayaranIds.length > 0) {
          seluruhRincian = await db.rincian_pembayaran.where('id_pembayaran').anyOf(pembayaranIds).toArray()
        }
        const totalDibayarSemua = seluruhRincian.reduce((sum, item) => sum + parseFloat(item.jumlah_dibayar || 0), 0)
        const maxCicilan = seluruhRincian.reduce((max, item) => Math.max(max, item.cicilan_ke || 0), 0)
        setMaxCicilanSeed(maxCicilan)

        const rincianCurrent = await db.rincian_pembayaran.where('id_pembayaran').equals(id).toArray()
        const sortedRincian = [...rincianCurrent].sort((a, b) => (a.cicilan_ke || 0) - (b.cicilan_ke || 0))
        const originalTotalPembayaran = sortedRincian.reduce((sum, item) => sum + parseFloat(item.jumlah_dibayar || 0), 0)
        const totalDibayarLain = Math.max(0, totalDibayarSemua - originalTotalPembayaran)

        setFormData({
          nomor_pembayaran: pembayaranRow.nomor_pembayaran || '',
          catatan: pembayaranRow.catatan || '',
        })

        setRincianItems(sortedRincian.map(item => ({
          id: item.id,
          nomor_transaksi: item.nomor_transaksi || '',
          jumlah_dibayar: item.jumlah_dibayar !== null && item.jumlah_dibayar !== undefined
            ? String(item.jumlah_dibayar)
            : '',
          tanggal_bayar: item.tanggal_bayar ? item.tanggal_bayar.split('T')[0] : '',
          metode_pembayaran: item.metode_pembayaran || 'transfer',
          referensi_pembayaran: item.referensi_pembayaran || '',
          catatan: item.catatan || '',
          cicilan_ke: item.cicilan_ke || undefined,
        })))

        setTagihanTotals({
          totalTagihan,
          totalDibayarLain,
          originalTotalPembayaran,
        })

        setLoading(false)
      } catch (err) {
        console.error('Error fetching pembayaran:', err)
        setError(err.message || 'Gagal memuat data pembayaran')
        setLoading(false)
      }
    }

    if (id) {
      fetchPembayaran()
    }
  }, [id])

  const totalPembayaran = useMemo(() => (
    rincianItems.reduce((sum, item) => sum + (parseFloat(item.jumlah_dibayar) || 0), 0)
  ), [rincianItems])

  const summary = useMemo(() => {
    if (!tagihanTotals) return null
    const totalDibayar = tagihanTotals.totalDibayarLain + totalPembayaran
    const remainingRaw = tagihanTotals.totalTagihan - totalDibayar

    return {
      totalTagihan: tagihanTotals.totalTagihan,
      totalDibayar,
      totalDibayarLain: tagihanTotals.totalDibayarLain,
      totalPembayaranSaatIni: totalPembayaran,
      originalTotalPembayaran: tagihanTotals.originalTotalPembayaran,
      remainingRaw,
      sisaTagihan: remainingRaw < 0 ? 0 : remainingRaw,
    }
  }, [tagihanTotals, totalPembayaran])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full bg-slate-50">
          <Text size="3" className="text-slate-500">Memuat data pembayaran...</Text>
        </div>
      </PageLayout>
    )
  }

  if (notFound) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-full gap-4 bg-slate-50">
          <Text size="4" className="text-red-600">{error || 'Pembayaran tidak ditemukan'}</Text>
          <button
            onClick={() => navigate('/pembayaran')}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors"
            type="button"
          >
            Kembali ke Daftar Pembayaran
          </button>
        </div>
      </PageLayout>
    )
  }

  const handleInfoChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getNextCicilanKe = () => {
    const maxInForm = rincianItems.reduce((max, item) => Math.max(max, item.cicilan_ke || 0), 0)
    return Math.max(maxCicilanSeed, maxInForm) + 1
  }

  const handleAddRincian = (formData) => {
    setRincianItems(prev => ([
      ...prev,
      {
        nomor_transaksi: formData.nomor_transaksi,
        jumlah_dibayar: formData.jumlah_dibayar,
        tanggal_bayar: formData.tanggal_bayar,
        metode_pembayaran: formData.metode_pembayaran,
        referensi_pembayaran: formData.referensi_pembayaran,
        catatan: formData.catatan,
        cicilan_ke: formData.cicilan_ke,
      },
    ]))
  }

  const handleRemoveRincian = (index) => {
    setRincianItems(prev => prev.filter((_, i) => i !== index))
  }

  const handleRincianChange = (index, field, value) => {
    setRincianItems(prev => {
      const next = [...prev]
      next[index] = { ...next[index], [field]: value }
      return next
    })
  }

  const handleSubmit = async () => {
    if (submitting) return
    if (!tagihanInfo) {
      setError('Data tagihan tidak valid. Muat ulang halaman dan coba lagi.')
      return
    }

    setSubmitting(true)
    setError('')

    const newErrors = {}

    if (!formData.nomor_pembayaran || !formData.nomor_pembayaran.trim()) {
      newErrors.nomor_pembayaran = 'Nomor pembayaran wajib diisi'
    }

    if (rincianItems.length === 0) {
      newErrors.rincian = 'Minimal harus ada 1 transaksi pembayaran'
    }

    for (let i = 0; i < rincianItems.length; i += 1) {
      const item = rincianItems[i]
      if (!item.nomor_transaksi || !item.nomor_transaksi.trim()) {
        newErrors.rincian = `Transaksi #${i + 1}: Nomor transaksi wajib diisi`
        break
      }
      if (!item.jumlah_dibayar || Number(item.jumlah_dibayar) <= 0) {
        newErrors.rincian = `Transaksi #${i + 1}: Jumlah dibayar harus lebih dari 0`
        break
      }
      if (!item.tanggal_bayar) {
        newErrors.rincian = `Transaksi #${i + 1}: Tanggal bayar wajib dipilih`
        break
      }
      if (!item.metode_pembayaran) {
        newErrors.rincian = `Transaksi #${i + 1}: Metode pembayaran wajib dipilih`
        break
      }
    }

    setValidationErrors(newErrors)

    if (Object.keys(newErrors).length > 0) {
      if (newErrors.rincian) {
        setError(newErrors.rincian)
      } else if (newErrors.nomor_pembayaran) {
        setError(newErrors.nomor_pembayaran)
      }
      setSubmitting(false)
      return
    }

    try {
      const payloadItems = rincianItems.map((item, idx) => ({
        nomor_transaksi: item.nomor_transaksi.trim(),
        jumlah_dibayar: Number(item.jumlah_dibayar),
        tanggal_bayar: item.tanggal_bayar,
        metode_pembayaran: item.metode_pembayaran || 'transfer',
        referensi_pembayaran: item.referensi_pembayaran
          ? item.referensi_pembayaran.trim()
          : null,
        catatan: item.catatan ? item.catatan.trim() : null,
        cicilan_ke: item.cicilan_ke || idx + 1,
      }))

      await updatePembayaranWithRincian(id, {
        id_tagihan: tagihanInfo.id,
        nomor_pembayaran: formData.nomor_pembayaran.trim(),
        catatan: formData.catatan ? formData.catatan.trim() : null,
      }, payloadItems)

      navigate('/pembayaran')
    } catch (err) {
      console.error('Error updating pembayaran:', err)
      setError(err.message || 'Gagal menyimpan perubahan pembayaran')
    } finally {
      setSubmitting(false)
    }
  }

  const canSubmit = Boolean(formData.nomor_pembayaran?.trim()) && rincianItems.length > 0 && !submitting

  return (
    <PageLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="shrink-0 bg-white px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <Text size="4" weight="bold" className="text-slate-900 block mb-1">
                Edit Pembayaran
              </Text>
              <Text size="1" className="text-slate-500">
                Perbarui nomor pembayaran dan rincian transaksi untuk tagihan siswa.
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/pembayaran')}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                type="button"
                disabled={submitting}
              >
                <ArrowLeft className="h-4 w-4 text-slate-600" />
                <Text size="2" weight="medium" className="text-slate-700">
                  Kembali
                </Text>
              </button>
              <button
                onClick={handleSubmit}
                disabled={!canSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                type="button"
              >
                <Save className="h-4 w-4" />
                <Text size="2" weight="medium" className="text-white">
                  {submitting ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Text>
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="shrink-0 mx-6 mt-4 flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <Text size="2" weight="medium" className="text-red-700 mb-1">
                Terjadi Kesalahan
              </Text>
              <Text size="2" className="text-red-600">
                {error}
              </Text>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden px-6 pb-6 pt-4">
          <div className="flex gap-4 h-full">
            {/* Main Content (75%) */}
            <div className="w-3/4 flex flex-col gap-4 overflow-auto">
              <InformasiPembayaranSection
                formData={formData}
                onChange={handleInfoChange}
                errors={validationErrors}
                disabled={submitting}
              />

              <RincianPembayaranFormSection
                rincianItems={rincianItems}
                totalPembayaran={totalPembayaran}
                onAdd={handleAddRincian}
                onRemove={handleRemoveRincian}
                onChange={handleRincianChange}
                summary={summary}
                errors={validationErrors}
                disableAdd={submitting}
                getNextCicilanKe={getNextCicilanKe}
              />
            </div>

            {/* Sidebar (25%) */}
            <div className="w-1/4 flex flex-col gap-4 overflow-auto">
              <div className="border-2 border-slate-300 bg-white shadow-lg shrink-0">
                <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3">
                  <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Identitas Siswa
                  </Text>
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-2 text-sm text-slate-700">
                    <div>
                      <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">Nama</Text>
                      <Text size="2" className="mt-0.5">{siswaInfo?.nama || '-'}</Text>
                    </div>
                    <div>
                      <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">NISN</Text>
                      <Text size="2" className="font-mono mt-0.5">{siswaInfo?.nisn || '-'}</Text>
                    </div>
                    <div>
                      <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">Kelas</Text>
                      <Text size="2" className="mt-0.5">{siswaInfo?.kelas || '-'}</Text>
                    </div>
                    <div>
                      <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">Tahun Ajaran</Text>
                      <Text size="2" className="mt-0.5">{siswaInfo?.tahunAjaran || '-'}</Text>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-2 border-slate-300 bg-white shadow-lg shrink-0">
                <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3">
                  <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Ringkasan Tagihan
                  </Text>
                </div>
                <div className="p-4 space-y-3">
                  <div className="space-y-2 text-sm text-slate-700">
                    <div>
                      <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">Nomor Tagihan</Text>
                      <Text size="2" className="font-mono mt-0.5">{tagihanInfo?.nomor || '-'}</Text>
                    </div>
                    <div>
                      <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">Judul Tagihan</Text>
                      <Text size="2" weight="medium" className="mt-0.5">{tagihanInfo?.judul || '-'}</Text>
                    </div>
                    <div>
                      <Text weight="medium" className="text-slate-500 block text-xs uppercase tracking-wide">Tanggal Tagihan</Text>
                      <Text size="2" className="mt-0.5">{formatDate(tagihanInfo?.tanggal_tagihan)}</Text>
                    </div>
                  </div>

                  {summary && (
                    <div className="mt-4 space-y-2 border-t border-slate-200 pt-4 text-sm">
                      <div className="flex items-center justify-between">
                        <Text size="1" className="text-slate-500">Total Tagihan</Text>
                        <Text size="2" weight="medium">{formatCurrency(summary.totalTagihan)}</Text>
                      </div>
                      <div className="flex items-center justify-between">
                        <Text size="1" className="text-slate-500">Sudah Dibayar</Text>
                        <Text size="2" weight="medium" className="text-emerald-700">
                          {formatCurrency(summary.totalDibayarLain + summary.originalTotalPembayaran)}
                        </Text>
                      </div>
                      <div className="flex items-center justify-between">
                        <Text size="1" className="text-slate-500">Draft Saat Ini</Text>
                        <Text size="2" weight="medium" className="text-blue-700">
                          {formatCurrency(summary.totalPembayaranSaatIni)}
                        </Text>
                      </div>
                      <div className="flex items-center justify-between">
                        <Text size="1" className="text-slate-500">Total Setelah Edit</Text>
                        <Text size="2" weight="medium" className="text-emerald-800">
                          {formatCurrency(summary.totalDibayar)}
                        </Text>
                      </div>
                      <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                        <Text size="1" className="text-slate-500">Sisa Tagihan</Text>
                        <Text size="2" weight="bold" className={summary.remainingRaw < 0 ? 'text-orange-700' : 'text-slate-900'}>
                          {formatCurrency(summary.sisaTagihan)}
                        </Text>
                      </div>
                      {summary.remainingRaw < 0 && (
                        <div className="mt-2 p-2 bg-orange-50 border border-orange-200">
                          <Text size="1" className="text-orange-700">
                            Pembayaran melebihi tagihan sebesar {formatCurrency(Math.abs(summary.remainingRaw))}
                          </Text>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
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

