import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PageLayout } from '../../layout/PageLayout'
import { Text, Button } from '@radix-ui/themes'
import { ArrowLeft, Printer } from 'lucide-react'
import { db } from '../../offline/db'
import { PaymentInvoiceDocument } from './components/documents/PaymentInvoiceDocument'

function buildInvoiceData(pembayaran) {
  if (!pembayaran) return null

  const siswa = pembayaran.tagihan?.riwayat_kelas_siswa?.siswa || {}
  const kelas = pembayaran.tagihan?.riwayat_kelas_siswa?.kelas || {}
  const tahun = pembayaran.tagihan?.riwayat_kelas_siswa?.tahun_ajaran || {}

  const siswaInfo = {
    nama_lengkap: siswa.nama_lengkap || '-',
    nisn: siswa.nisn || '-',
    tahun_ajaran: tahun.nama || pembayaran.tagihan?.tahun_ajaran || '-',
    kelas: [kelas.tingkat, kelas.nama_sub_kelas].filter(Boolean).join(' ') || '-',
  }

  const payments = (pembayaran.rincian_pembayaran || []).map(rincian => ({
    tagihan: {
      judul: pembayaran.tagihan?.judul || 'Pembayaran Tagihan',
      nomor_tagihan: pembayaran.tagihan?.nomor_tagihan || pembayaran.nomor_pembayaran || '-',
      tahun_ajaran: tahun.nama || pembayaran.tagihan?.tahun_ajaran || '-',
    },
    payment: {
      metode_pembayaran: rincian.metode_pembayaran || pembayaran.metode_pembayaran,
      jumlah_dibayar: parseFloat(rincian.jumlah_dibayar || 0),
    },
  }))

  const totalAmount = payments.reduce((sum, item) => sum + (item.payment?.jumlah_dibayar || 0), 0)
  const timestamp = pembayaran.rincian_pembayaran?.[0]?.tanggal_bayar || pembayaran.diperbarui_pada || pembayaran.dibuat_pada || new Date().toISOString()

  return {
    siswaInfo,
    payments,
    totalAmount,
    timestamp,
    nomor_pembayaran: pembayaran.nomor_pembayaran || null,
  }
}

function DetailPembayaranContent() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const [pembayaran, setPembayaran] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchPembayaran = async () => {
      try {
        setLoading(true)

        const pembayaranRow = await db.pembayaran.get(id)
        if (!pembayaranRow) throw new Error('Pembayaran tidak ditemukan')
        const tagihan = await db.tagihan.get(pembayaranRow.id_tagihan)
        const rks = tagihan ? await db.riwayat_kelas_siswa.get(tagihan.id_riwayat_kelas_siswa) : null
        const siswa = rks ? await db.siswa.get(rks.id_siswa) : null
        const kelas = rks ? await db.kelas.get(rks.id_kelas) : null
        const tahun = rks ? await db.tahun_ajaran.get(rks.id_tahun_ajaran) : null
        const rincianAll = await db.rincian_pembayaran.where('id_pembayaran').equals(id).toArray()
        const rincianPembayaran = rincianAll.sort((a, b) => (a.cicilan_ke || 0) - (b.cicilan_ke || 0))
        const rincianTagihan = tagihan ? await db.rincian_tagihan.where('id_tagihan').equals(tagihan.id).toArray() : []

        setPembayaran({
          ...pembayaranRow,
          tagihan: tagihan && {
            ...tagihan,
            riwayat_kelas_siswa: rks && {
              siswa: siswa && { nama_lengkap: siswa.nama_lengkap, nisn: siswa.nisn },
              kelas: kelas && { tingkat: kelas.tingkat, nama_sub_kelas: kelas.nama_sub_kelas },
              tahun_ajaran: tahun && { nama: tahun.nama },
            },
            rincian_tagihan: rincianTagihan,
          },
          rincian_pembayaran: rincianPembayaran,
        })
      } catch (err) {
        console.error('Error fetching pembayaran:', err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchPembayaran()
    }
  }, [id])

  const invoiceData = useMemo(() => buildInvoiceData(pembayaran), [pembayaran])

  if (loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <Text size="3" className="text-slate-500">Memuat data pembayaran...</Text>
        </div>
      </PageLayout>
    )
  }

  if (error || !pembayaran) {
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-full gap-4">
          <Text size="4" className="text-red-600">Gagal memuat data pembayaran</Text>
          {error && <Text size="2" className="text-slate-500">{error}</Text>}
          <button
            onClick={() => navigate('/pembayaran')}
            className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Kembali ke Daftar Pembayaran
          </button>
        </div>
      </PageLayout>
    )
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <PageLayout>
      <div className="flex flex-col h-full bg-white">
        <div className="print:hidden sticky top-0 z-10 flex items-center justify-between bg-white/90 backdrop-blur px-5 py-3 shadow-sm">
          <div className="flex flex-col">
            <Text size="4" weight="bold" className="text-slate-900 leading-tight">
              Bukti Pembayaran
            </Text>
            <Text size="2" className="text-slate-500 font-mono mt-0.5">
              {pembayaran?.nomor_pembayaran || '—'}
            </Text>
          </div>
          <div className="flex items-center gap-3">
            <Button
              onClick={handlePrint}
              size="2"
              className="cursor-pointer bg-green-600 hover:bg-green-700 text-white"
              style={{ borderRadius: 0 }}
            >
              <Printer className="h-4 w-4" />
              Cetak
            </Button>
            <Button
              onClick={() => navigate('/pembayaran')}
              variant="soft"
              color="gray"
              size="2"
              className="cursor-pointer"
              style={{ borderRadius: 0 }}
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-auto bg-white px-4 py-6">
          <div className="max-w-[900px] mx-auto relative">
            <div className="absolute inset-0 translate-y-3 scale-[0.99] bg-slate-900/5 blur-xl opacity-60 pointer-events-none print:hidden" aria-hidden="true" />
            <div className="relative bg-white border border-slate-100 p-6 sm:p-10 shadow-[0_12px_32px_rgba(15,23,42,0.07)] print:shadow-none print:border-none print:p-0">
              <PaymentInvoiceDocument paymentData={invoiceData} contentId="invoice-page-content" />
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          /* Force color printing only for invoice content */
          #invoice-page-content * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          body * {
            visibility: hidden;
          }

          #invoice-page-content,
          #invoice-page-content * {
            visibility: visible;
          }

          #invoice-page-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }

          .print\\:hidden {
            display: none !important;
          }

          /* Ensure backgrounds and colors are preserved */
          .bg-slate-800 {
            background-color: #1e293b !important;
            color: white !important;
          }

          .text-white {
            color: white !important;
          }

          .bg-slate-100 {
            background-color: #f1f5f9 !important;
          }

          .bg-slate-200 {
            background-color: #e2e8f0 !important;
          }

          .border-slate-800 {
            border-color: #1e293b !important;
          }

          .border-slate-300 {
            border-color: #cbd5e1 !important;
          }

          .border-slate-600 {
            border-color: #475569 !important;
          }

          .text-slate-900 {
            color: #0f172a !important;
          }

          .text-slate-700 {
            color: #334155 !important;
          }

          .text-slate-600 {
            color: #475569 !important;
          }

          .text-slate-500 {
            color: #64748b !important;
          }

          /* Preserve all borders */
          table, th, td {
            border-collapse: collapse !important;
          }

          .border-2 {
            border-width: 2px !important;
          }

          .border-4 {
            border-width: 4px !important;
          }

          .border-b-4 {
            border-bottom-width: 4px !important;
          }

          .border-b {
            border-bottom-width: 1px !important;
          }

          .border-r {
            border-right-width: 1px !important;
          }

          .border-t-2 {
            border-top-width: 2px !important;
          }

          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>
    </PageLayout>
  )
}

export function DetailPembayaran() {
  return <DetailPembayaranContent />
}
