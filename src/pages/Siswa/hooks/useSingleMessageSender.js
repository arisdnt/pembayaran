import { useRef, useState } from 'react'
import { format } from 'date-fns'
import { sendWhatsAppBatch, normalizePhone } from '../../KirimPesan/api/whatsapp'
import { bulkInsertKirimPesan, updateKirimPesanStatusByContent } from '../../../offline/actions/kirimPesan'

const CANCELLED_MESSAGE = '__CANCELLED__'

/**
 * Hook untuk mengirim pesan WhatsApp ke siswa individual
 * Menggunakan implementasi yang sama dengan halaman /kirim-pesan
 */
export function useSingleMessageSender() {
  const [sending, setSending] = useState(false)
  const [logLines, setLogLines] = useState([])
  const abortRef = useRef({ cancelled: false })

  const appendLog = (line) => setLogLines((prev) => [...prev, `[${format(new Date(), 'HH:mm:ss')}] ${line}`])

  const ensureNotCancelled = () => {
    if (abortRef.current.cancelled) {
      throw new Error(CANCELLED_MESSAGE)
    }
  }

  /**
   * Kirim pesan ke siswa individual
   * @param {Object} messageData - Data pesan yang sudah digenerate
   * @param {string} messageData.nomor_whatsapp - Nomor WA yang sudah dinormalisasi
   * @param {string} messageData.isi_pesan - Isi pesan
   * @param {string} messageData.tahun_ajaran - Nama tahun ajaran
   * @param {string} messageData.tingkat_kelas - Tingkat kelas
   * @param {string} messageData.kelas_spesifik - Kelas spesifik
   */
  const sendMessage = async (messageData) => {
    abortRef.current = { cancelled: false }

    try {
      setSending(true)
      setLogLines([])
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('🚀 MEMULAI PROSES PENGIRIMAN PESAN')
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('📡 Menggunakan: Supabase Edge Function (send-wa)')
      appendLog('👤 Mode: Pengiriman Individual')
      appendLog('')

      appendLog('🧭 Memvalidasi konfigurasi...')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const functionsBase = supabaseUrl ? supabaseUrl.replace('.supabase.co', '.functions.supabase.co') : ''
      const functionUrl = functionsBase ? `${functionsBase}/send-wa` : 'N/A'
      appendLog(`    └─ Function URL: ${functionUrl}`)
      appendLog(`    └─ Supabase Project: ${supabaseUrl || 'N/A'}`)
      appendLog(`    └─ Network: ${navigator.onLine ? '✅ Online' : '❌ Offline'}`)
      appendLog('')

      // Validasi data
      if (!messageData.nomor_whatsapp) {
        throw new Error('Nomor WhatsApp tidak tersedia untuk siswa ini')
      }

      if (!messageData.isi_pesan) {
        throw new Error('Pesan tidak dapat digenerate')
      }

      appendLog(`📱 Nomor tujuan: ${messageData.nomor_whatsapp}`)
      appendLog(`📊 Tahun Ajaran: ${messageData.tahun_ajaran}`)
      appendLog(`🏫 Kelas: ${messageData.kelas_spesifik}`)
      appendLog('')

      // Insert ke database kirim_pesan
      appendLog('💾 Menyimpan pesan ke database...')
      await bulkInsertKirimPesan([{
        nomor_whatsapp: messageData.nomor_whatsapp,
        isi_pesan: messageData.isi_pesan,
        status: 'pending',
        tahun_ajaran: messageData.tahun_ajaran,
        tingkat_kelas: messageData.tingkat_kelas,
        kelas_spesifik: messageData.kelas_spesifik,
      }])
      appendLog('    └─ ✅ Berhasil disimpan')
      appendLog('')

      const messages = [{
        target: messageData.nomor_whatsapp,
        message: messageData.isi_pesan,
      }]

      appendLog('🔥 Memulai pengiriman...')
      appendLog('')

      const results = await sendWhatsAppBatch(messages, {
        delaySeconds: 0, // Tidak perlu delay untuk 1 pesan
        typing: false,
        onProgress: ({ message }) => {
          ensureNotCancelled()
          appendLog(`📨 ${message}`)
        },
        onSent: async ({ nomor, isi_pesan, response }) => {
          ensureNotCancelled()
          const detail = response?.detail || 'message sent'
          const requestId = response?.id ? `ID: ${response.id[0]}` : ''
          const processStatus = response?.process || 'pending'

          appendLog(`✅ BERHASIL ke ${nomor}`)
          if (requestId) {
            appendLog(`    └─ ${requestId}`)
          }
          appendLog(`    └─ Status: ${detail}`)
          appendLog(`    └─ Process: ${processStatus}`)
          appendLog('')

          await updateKirimPesanStatusByContent(nomor, isi_pesan, 'sent')
        },
        onError: async ({ target, error, errorType, httpStatus }) => {
          ensureNotCancelled()
          appendLog(`❌ GAGAL ke ${target}`)
          appendLog(`    └─ Error: ${error}`)
          if (errorType) {
            appendLog(`    └─ Type: ${errorType}`)
          }
          if (httpStatus) {
            appendLog(`    └─ HTTP Status: ${httpStatus}`)
          }

          if (errorType === 'network') {
            appendLog('    └─ 💡 Saran:')
            appendLog('       • Periksa koneksi internet')
            appendLog('       • Periksa CSP/allowlist untuk domain Supabase Functions')
            appendLog(`       • Coba akses ${functionUrl} di browser (OPTIONS/POST)`)
            appendLog('       • Periksa Functions logs di Supabase Dashboard')
            appendLog('       • Periksa firewall/antivirus')
          } else if (errorType === 'auth') {
            appendLog('    └─ 💡 Saran: Periksa token Fonnte (FONNTE_TOKEN di Supabase)')
          }
          appendLog('')

          const normalizedTarget = normalizePhone(target)
          await updateKirimPesanStatusByContent(normalizedTarget, messageData.isi_pesan, 'failed')
        },
      })

      appendLog('')
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('📈 RINGKASAN PENGIRIMAN')
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog(`✅ Status: ${results.success > 0 ? 'BERHASIL' : 'GAGAL'}`)
      appendLog(`⏱️  Durasi: ${results.duration} detik`)
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('')
      appendLog(results.success > 0 ? '✅ Pesan berhasil dikirim!' : '❌ Pengiriman gagal, silakan coba lagi')

      return results
    } catch (e) {
      if (e instanceof Error && e.message === CANCELLED_MESSAGE) {
        appendLog('⚠️ Pengiriman dihentikan oleh pengguna.')
        appendLog('')
        return { cancelled: true }
      }

      console.error('Full error:', e)
      const errorMsg = e?.message || String(e) || 'Unknown error'
      appendLog('')
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('❌ TERJADI KESALAHAN')
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog(`Error: ${errorMsg}`)
      appendLog('')
      throw e
    } finally {
      setSending(false)
    }
  }

  const cancelSending = () => {
    if (sending && abortRef.current) {
      abortRef.current.cancelled = true
      appendLog('⛔ Permintaan penghentian pengiriman diterima...')
    }
  }

  const resetLog = () => {
    setLogLines([])
  }

  return {
    sending,
    logLines,
    sendMessage,
    cancelSending,
    resetLog,
  }
}
