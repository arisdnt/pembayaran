import { useRef, useState } from 'react'
import { format } from 'date-fns'
import { sendWhatsAppBatch, normalizePhone } from '../api/whatsapp'
import { updateKirimPesanStatusByContent, getPendingKirimPesan } from '../../../offline/actions/kirimPesan'

const CANCELLED_MESSAGE = '__CANCELLED__'

export function useMessageSender(rateMs, forceRefresh) {
  const [sending, setSending] = useState(false)
  const [logLines, setLogLines] = useState([])
  const abortRef = useRef({ cancelled: false })

  const appendLog = (line) => setLogLines((prev) => [...prev, `[${format(new Date(), 'HH:mm:ss')}] ${line}`])

  const ensureNotCancelled = () => {
    if (abortRef.current.cancelled) {
      throw new Error(CANCELLED_MESSAGE)
    }
  }

  const handleKirim = async () => {
    abortRef.current = { cancelled: false }

    try {
      setSending(true)
      setLogLines([])
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('🚀 MEMULAI PROSES PENGIRIMAN PESAN')
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('📡 Menggunakan: Supabase Edge Function (send-wa)')
      appendLog(`⏱️  Delay antar pesan: ${rateMs / 1000} detik`)
      appendLog('')

      appendLog('🧭 Memvalidasi konfigurasi...')
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const functionsBase = supabaseUrl ? supabaseUrl.replace('.supabase.co', '.functions.supabase.co') : ''
      const functionUrl = functionsBase ? `${functionsBase}/send-wa` : 'N/A'
      appendLog(`    └─ Function URL: ${functionUrl}`)
      appendLog(`    └─ Supabase Project: ${supabaseUrl || 'N/A'}`)
      appendLog(`    └─ Network: ${navigator.onLine ? '✅ Online' : '❌ Offline'}`)
      appendLog('')

      const data = await getPendingKirimPesan()
      if (!data || data.length === 0) {
        appendLog('⚠️  Tidak ada pesan pending untuk dikirim.')
        appendLog('')
        return { success: 0, failed: 0, total: 0 }
      }
      appendLog(`📊 Total pesan pending: ${data.length} pesan`)
      appendLog('')

      const messages = data.map((item) => ({
        target: item.nomor_whatsapp,
        message: item.isi_pesan,
      }))

      appendLog('🔥 Memulai pengiriman batch...')
      appendLog('')

      const results = await sendWhatsAppBatch(messages, {
        delaySeconds: rateMs / 1000,
        typing: false,
        onProgress: ({ current, total, progress, message }) => {
          ensureNotCancelled()
          appendLog(`[${current}/${total}] 📨 ${message} (${progress}%)`)
        },
        onSent: async ({ nomor, isi_pesan, response, current, total }) => {
          ensureNotCancelled()
          const detail = response?.detail || 'message sent'
          const requestId = response?.id ? `ID: ${response.id[0]}` : ''
          const processStatus = response?.process || 'pending'

          appendLog(`[${current}/${total}] ✅ BERHASIL ke ${nomor}`)
          if (requestId) {
            appendLog(`    └─ ${requestId}`)
          }
          appendLog(`    └─ Status: ${detail}`)
          appendLog(`    └─ Process: ${processStatus}`)
          appendLog('')

          await updateKirimPesanStatusByContent(nomor, isi_pesan, 'sent')
          forceRefresh()
        },
        onError: async ({ target, error, errorType, httpStatus, current, total }) => {
          ensureNotCancelled()
          appendLog(`[${current}/${total}] ❌ GAGAL ke ${target}`)
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
          const failedMsg = data.find((m) => normalizePhone(m.nomor_whatsapp) === normalizedTarget)
          if (failedMsg) {
            await updateKirimPesanStatusByContent(normalizedTarget, failedMsg.isi_pesan, 'failed')
            forceRefresh()
          }
        },
        onDelay: ({ current, total, delaySeconds, nextTarget }) => {
          ensureNotCancelled()
          appendLog(`[${current}/${total}] ⏳ Menunggu ${delaySeconds} detik...`)
          appendLog(`    └─ Pesan berikutnya: ${nextTarget}`)
          appendLog('')
        },
      })

      appendLog('')
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('📈 RINGKASAN PENGIRIMAN')
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog(`✅ Berhasil: ${results.success} pesan`)
      appendLog(`❌ Gagal: ${results.failed} pesan`)
      appendLog(`📊 Total: ${results.total} pesan`)
      appendLog(`⏱️  Durasi: ${results.duration} detik`)
      appendLog('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
      appendLog('')
      appendLog('✅ Proses pengiriman selesai!')

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

  return {
    sending,
    logLines,
    handleKirim,
    cancelSending,
  }
}
