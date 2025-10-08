import { useState, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDetailSiswa } from '../hooks/useDetailSiswa'
import { useSingleMessageSender } from '../hooks/useSingleMessageSender'
import { generateSingleMessage } from '../utils/generateSingleMessage'
import { SendMessageModal } from '../components/SendMessageModal'
import { StudentPaymentHistoryDocument } from '../components/documents/StudentPaymentHistoryDocument'
import {
  DetailSiswaLayout,
  DetailLoadingState,
  DetailErrorState,
  DetailNotFoundState,
} from '../components/detail'

function buildHistoryData(siswa, tagihanData) {
  if (!siswa || !tagihanData || tagihanData.length === 0) return null

  const siswaInfo = {
    nama_lengkap: siswa.nama_lengkap || '-',
    nisn: siswa.nisn || '-',
    kelas: '-',
  }

  // Build ledger entries seperti di TagihanPembayaranSection
  const ledgerEntries = []
  
  tagihanData.forEach((group) => {
    // Set kelas dari group pertama
    if (siswaInfo.kelas === '-' && group.kelas) {
      siswaInfo.kelas = group.kelas
    }

    if (group.tagihan && group.tagihan.length > 0) {
      group.tagihan.forEach((tagihan) => {
        // Entry tagihan
        ledgerEntries.push({
          type: 'tagihan',
          tanggal: tagihan.tanggal_tagihan,
          tahunAjaran: group.tahunAjaran,
          kelas: group.kelas,
          namaTagihan: tagihan.judul,
          jenisPembayaran: '',
          deskripsi: '',
          referensi: tagihan.nomor_tagihan,
          metode: '',
          nominalTagihan: tagihan.totalTagihan,
          nominalJenis: 0,
          nominalBayar: 0,
          saldo: 0,
          tagihanId: tagihan.id,
          totalTagihan: tagihan.totalTagihan,
          totalDibayar: tagihan.totalDibayar,
          sisaTagihan: tagihan.sisaTagihan
        })

        // Entry rincian tagihan
        if (tagihan.rincian_tagihan && tagihan.rincian_tagihan.length > 0) {
          tagihan.rincian_tagihan.forEach((rincian) => {
            ledgerEntries.push({
              type: 'rincian_tagihan',
              tanggal: tagihan.tanggal_tagihan,
              tahunAjaran: group.tahunAjaran,
              kelas: group.kelas,
              namaTagihan: '',
              jenisPembayaran: rincian.jenis_pembayaran?.nama || '-',
              deskripsi: rincian.deskripsi,
              referensi: rincian.jenis_pembayaran?.kode || '-',
              metode: '',
              nominalTagihan: 0,
              nominalJenis: rincian.jumlah,
              nominalBayar: 0,
              saldo: 0,
              tagihanId: tagihan.id
            })
          })
        }

        // Entry pembayaran
        if (tagihan.pembayaran && tagihan.pembayaran.length > 0) {
          tagihan.pembayaran.forEach((pembayaran) => {
            if (pembayaran.rincian_pembayaran && pembayaran.rincian_pembayaran.length > 0) {
              pembayaran.rincian_pembayaran.forEach((rincian) => {
                ledgerEntries.push({
                  type: 'pembayaran',
                  tanggal: rincian.tanggal_bayar,
                  tahunAjaran: group.tahunAjaran,
                  kelas: group.kelas,
                  namaTagihan: tagihan.judul,
                  jenisPembayaran: 'Pembayaran',
                  deskripsi: '',
                  referensi: rincian.nomor_transaksi,
                  metode: rincian.metode_pembayaran,
                  nominalTagihan: 0,
                  nominalJenis: 0,
                  nominalBayar: rincian.jumlah_dibayar,
                  saldo: 0,
                  tagihanId: tagihan.id
                })
              })
            }
          })
        }

        // Entry status pembayaran
        ledgerEntries.push({
          type: 'status_pembayaran',
          tanggal: tagihan.tanggal_tagihan,
          tahunAjaran: group.tahunAjaran,
          kelas: group.kelas,
          namaTagihan: tagihan.judul,
          jenisPembayaran: '',
          deskripsi: '',
          referensi: '',
          metode: '',
          nominalTagihan: 0,
          nominalJenis: 0,
          nominalBayar: 0,
          saldo: 0,
          tagihanId: tagihan.id,
          totalTagihan: tagihan.totalTagihan,
          totalDibayar: tagihan.totalDibayar,
          sisaTagihan: tagihan.sisaTagihan
        })
      })
    }
  })

  // Calculate running balance
  let runningBalance = 0
  ledgerEntries.forEach(entry => {
    if (entry.type === 'tagihan') {
      runningBalance += entry.nominalTagihan
      entry.saldo = runningBalance
    } else if (entry.type === 'pembayaran') {
      runningBalance -= entry.nominalBayar
      entry.saldo = runningBalance
    } else if (entry.type === 'status_pembayaran') {
      entry.saldo = runningBalance
    }
  })

  // Calculate grand total
  const grandTotal = {
    totalTagihan: tagihanData.reduce((sum, group) => sum + group.totalTagihan, 0),
    totalDibayar: tagihanData.reduce((sum, group) => sum + group.totalDibayar, 0),
  }
  grandTotal.sisaTagihan = grandTotal.totalTagihan - grandTotal.totalDibayar

  return {
    siswaInfo,
    ledgerEntries,
    grandTotal,
    timestamp: new Date().toISOString(),
  }
}

export function DetailSiswa() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { siswa, riwayatKelas, peminatan, tagihanData, loading, error } = useDetailSiswa(id)
  const { sending, logLines, sendMessage, cancelSending, resetLog } = useSingleMessageSender()
  
  const [modalOpen, setModalOpen] = useState(false)
  const [messageData, setMessageData] = useState(null)
  const [generateError, setGenerateError] = useState(null)
  const [showPrintView, setShowPrintView] = useState(false)

  const historyData = useMemo(() => buildHistoryData(siswa, tagihanData), [siswa, tagihanData])

  const handleBack = () => navigate('/siswa')

  const handlePrint = () => {
    setShowPrintView(true)
    setTimeout(() => {
      window.print()
    }, 100)
  }

  const handleSendMessage = async () => {
    // Reset state
    setGenerateError(null)
    resetLog()
    
    // Validasi nomor WhatsApp
    if (!siswa?.nomor_whatsapp_wali) {
      setGenerateError('Nomor WhatsApp wali tidak tersedia')
      return
    }

    // Cari riwayat kelas aktif (yang terbaru atau yang sedang berjalan)
    let activeRiwayatKelas = null
    if (riwayatKelas && riwayatKelas.length > 0) {
      // Cari yang masih aktif atau yang paling baru
      activeRiwayatKelas = riwayatKelas.find(rk => rk.status === 'aktif') || riwayatKelas[0]
    }

    if (!activeRiwayatKelas) {
      setGenerateError('Data riwayat kelas tidak ditemukan untuk siswa ini')
      return
    }

    try {
      // Generate pesan
      const message = await generateSingleMessage(siswa, activeRiwayatKelas.id)
      setMessageData(message)
      
      // Buka modal
      setModalOpen(true)
    } catch (err) {
      console.error('Error generating message:', err)
      setGenerateError(err.message || 'Gagal membuat pesan')
      alert(`Gagal membuat pesan: ${err.message}`)
    }
  }

  const handleModalSend = async () => {
    if (!messageData) return

    try {
      await sendMessage(messageData)
    } catch (err) {
      console.error('Error sending message:', err)
      // Error sudah ditangani di hook
    }
  }

  const handleModalClose = (open) => {
    if (!sending) {
      setModalOpen(open)
      if (!open) {
        // Reset saat modal ditutup
        setMessageData(null)
        setGenerateError(null)
        resetLog()
      }
    }
  }

  if (loading) {
    return <DetailLoadingState />
  }

  if (error) {
    return <DetailErrorState error={error} onBack={handleBack} />
  }

  if (!siswa) {
    return <DetailNotFoundState onBack={handleBack} />
  }

  // Listen untuk event setelah print selesai
  if (typeof window !== 'undefined') {
    const afterPrintHandler = () => {
      setShowPrintView(false)
    }
    
    window.onafterprint = afterPrintHandler
  }

  if (showPrintView) {
    return (
      <div className="bg-white">
        <div className="max-w-[900px] mx-auto relative py-6 print:py-0">
          <StudentPaymentHistoryDocument historyData={historyData} contentId="student-history-print" />
        </div>
        
        <style>{`
          @media print {
            /* Reveal only the print content but keep normal flow */
            body * {
              visibility: hidden !important;
            }

            #student-history-print,
            #student-history-print * {
              visibility: visible !important;
            }

            /* Ensure containers don't clip content when printing */
            html, body, #root {
              height: auto !important;
              overflow: visible !important;
            }

            .route-container {
              height: auto !important;
              overflow: visible !important;
            }

            /* Override Tailwind viewport-constrained utilities during print */
            .h-screen { height: auto !important; }
            .w-screen { width: auto !important; }
            .overflow-hidden { overflow: visible !important; }

            /* Keep the print target in normal document flow */
            #student-history-print {
              position: static !important;
              width: auto !important;
              max-width: 210mm !important;
              margin: 0 auto !important;
            }

            /* Optional helper to hide non-print items */
            .print\\:hidden { display: none !important; }

            @page {
              size: A4;
              margin: 6mm 12mm 12mm 12mm; /* reduce top margin further on first page */
            }

            /* Remove user-agent default margins on body when printing */
            body { margin: 0 !important; }
          }
        `}</style>
      </div>
    )
  }

  return (
    <>
      <DetailSiswaLayout
        siswa={siswa}
        riwayatKelas={riwayatKelas}
        peminatan={peminatan}
        tagihanData={tagihanData}
        onBack={handleBack}
        onSendMessage={handleSendMessage}
        onPrint={handlePrint}
      />
      
      <SendMessageModal
        open={modalOpen}
        onOpenChange={handleModalClose}
        logLines={logLines}
        sending={sending}
        onSend={handleModalSend}
        onCancel={cancelSending}
        messageData={messageData}
      />
    </>
  )
}
