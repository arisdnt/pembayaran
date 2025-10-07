import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDetailSiswa } from '../hooks/useDetailSiswa'
import { useSingleMessageSender } from '../hooks/useSingleMessageSender'
import { generateSingleMessage } from '../utils/generateSingleMessage'
import { SendMessageModal } from '../components/SendMessageModal'
import {
  DetailSiswaLayout,
  DetailLoadingState,
  DetailErrorState,
  DetailNotFoundState,
} from '../components/detail'

export function DetailSiswa() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { siswa, riwayatKelas, peminatan, tagihanData, loading, error } = useDetailSiswa(id)
  const { sending, logLines, sendMessage, cancelSending, resetLog } = useSingleMessageSender()
  
  const [modalOpen, setModalOpen] = useState(false)
  const [messageData, setMessageData] = useState(null)
  const [generateError, setGenerateError] = useState(null)

  const handleBack = () => navigate('/siswa')

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

  return (
    <>
      <DetailSiswaLayout
        siswa={siswa}
        riwayatKelas={riwayatKelas}
        peminatan={peminatan}
        tagihanData={tagihanData}
        onBack={handleBack}
        onSendMessage={handleSendMessage}
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
