/**
 * WhatsApp API Service via Supabase Edge Function (send-wa)
 * Mengganti backend Node.js lokal dengan Edge Function agar distribusi dan maintenance lebih mudah.
 *
 * Referensi resmi:
 * - Fonnte API: https://docs.fonnte.com/
 * - Supabase Edge Functions + CORS: https://supabase.com/docs/guides/functions/cors
 */

// Environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[WhatsApp API] Missing Supabase environment variables!')
  console.error('- VITE_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗')
  console.error('- VITE_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✓' : '✗')
}

// Build Edge Function URL
const FUNCTIONS_BASE = SUPABASE_URL?.replace('.supabase.co', '.functions.supabase.co')
const EDGE_FUNCTION_NAME = 'send-wa'
const EDGE_FUNCTION_URL = `${FUNCTIONS_BASE}/${EDGE_FUNCTION_NAME}`

console.log('[WhatsApp API] Configuration loaded:')
console.log('- Edge Function URL:', EDGE_FUNCTION_URL)
console.log('- API Key configured:', SUPABASE_ANON_KEY ? 'Yes' : 'No')

/**
 * Normalize nomor telepon ke format Indonesia
 * @param {string} phone - Nomor telepon
 * @returns {string} Nomor yang sudah dinormalisasi
 */
export function normalizePhone(phone) {
  if (!phone) return ''

  // Hapus semua karakter non-digit
  let normalized = String(phone).replace(/[^0-9]/g, '')

  // Jika dimulai dengan 0, ganti dengan 62
  if (normalized.startsWith('0')) {
    normalized = '62' + normalized.slice(1)
  }

  // Jika tidak dimulai dengan 62, tambahkan 62
  if (!normalized.startsWith('62')) {
    normalized = '62' + normalized
  }

  return normalized
}

/**
 * Kirim pesan WhatsApp tunggal
 * @param {Object} params
 * @param {string} params.target - Nomor tujuan
 * @param {string} params.message - Isi pesan
 * @param {boolean} params.typing - Tampilkan indikator typing (default: false)
 * @returns {Promise<Object>} Response dari API
 */
export async function sendWhatsAppMessage({ target, message, typing = false }) {
  let response
  try {
    const normalizedTarget = normalizePhone(target)

    if (!normalizedTarget) {
      throw new Error('Nomor target tidak valid')
    }

    console.log(`[WhatsApp API] Mengirim ke ${normalizedTarget}...`)
    
    // Gunakan Supabase Edge Function dengan direct fetch untuk kontrol penuh
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      throw new Error('Supabase environment variables tidak ditemukan')
    }

    console.log(`[WhatsApp API] Supabase Function: ${EDGE_FUNCTION_URL}`)

    // Prepare request payload
    const payload = {
      target: normalizedTarget,
      message: message,
      typing: !!typing,
      countryCode: '62'
    }

    console.log(`[WhatsApp API] Payload:`, payload)

    // Direct fetch untuk kontrol penuh atas request format
    response = await fetch(EDGE_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'apikey': SUPABASE_ANON_KEY,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    console.log(`[WhatsApp API] Response status: ${response.status} ${response.statusText}`)
    console.log(`[WhatsApp API] Response ok: ${response.ok}`)

    // Parse response
    const contentType = response.headers.get('content-type') || ''
    let result
    
    if (contentType.includes('application/json')) {
      result = await response.json()
    } else {
      const text = await response.text()
      console.warn(`[WhatsApp API] Non-JSON response:`, text)
      result = { success: false, error: text || 'Invalid response format' }
    }

    console.log(`[WhatsApp API] Response data:`, result)

    // Check if request was successful
    if (!response.ok) {
      const errorMsg = result.error || `HTTP ${response.status}: ${response.statusText}`
      throw new Error(errorMsg)
    }

    if (!result.success) {
      throw new Error(result.error || 'Gagal mengirim pesan')
    }

    return {
      success: true,
      data: result.data,
      target: normalizedTarget,
      httpStatus: response.status
    }
  } catch (error) {
    console.error('[WhatsApp API] Full error:', error)
    console.error('[WhatsApp API] Error name:', error.name)
    console.error('[WhatsApp API] Error message:', error.message)

    // Determine error type for better messaging
    let errorMessage = error.message
    let errorType = 'unknown'

    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      errorType = 'network'
      errorMessage = 'Tidak dapat terhubung ke Supabase Edge Function. Periksa koneksi internet/CSP.'
    } else if (error.message.includes('HTTP') || error.message.includes('status')) {
      errorType = 'http'
      errorMessage = error.message
    } else if (error.message.includes('token') || error.message.includes('Token')) {
      errorType = 'auth'
      errorMessage = 'Token Fonnte tidak valid atau expired'
    } else if (error.message.includes('Upstream Fonnte')) {
      errorType = 'upstream'
      errorMessage = error.message
    }

    return {
      success: false,
      error: errorMessage,
      errorType,
      target: target,
      httpStatus: response?.status || null
    }
  }
}

/**
 * Kirim pesan WhatsApp batch dengan delay
 * @param {Array} messages - Array of {target, message}
 * @param {Object} options
 * @param {number} options.delaySeconds - Delay antar pesan dalam detik (default: 10)
 * @param {boolean} options.typing - Tampilkan indikator typing (default: false)
 * @param {Function} options.onProgress - Callback untuk progress update
 * @param {Function} options.onSent - Callback saat pesan terkirim
 * @param {Function} options.onError - Callback saat terjadi error
 * @param {Function} options.onDelay - Callback saat menunggu delay
 * @returns {Promise<Object>} Summary hasil pengiriman
 */
export async function sendWhatsAppBatch(messages, options = {}) {
  const {
    delaySeconds = 10,
    typing = false,
    onProgress = () => {},
    onSent = () => {},
    onError = () => {},
    onDelay = () => {}
  } = options

  const results = {
    total: messages.length,
    success: 0,
    failed: 0,
    details: []
  }

  const startTime = Date.now()

  for (let i = 0; i < messages.length; i++) {
    const msg = messages[i]
    let result // Declare outside try-catch so it's accessible in catch

    onProgress({
      current: i + 1,
      total: messages.length,
      target: msg.target,
      message: 'Mengirim pesan...',
      progress: Math.round(((i + 1) / messages.length) * 100)
    })

    try {
      result = await sendWhatsAppMessage({
        target: msg.target,
        message: msg.message,
        typing
      })

      if (result.success) {
        results.success++
        results.details.push({
          target: msg.target,
          status: 'success',
          data: result.data
        })

        onSent({
          target: msg.target,
          nomor: result.target,
          isi_pesan: msg.message,
          response: result.data,
          current: i + 1,
          total: messages.length
        })
      } else {
        // result.success = false, treat as error
        throw new Error(result.error || 'Gagal mengirim pesan')
      }
    } catch (error) {
      results.failed++
      
      // Get error details from result or error object
      const errorMessage = result?.error || error.message || 'Unknown error'
      const errorType = result?.errorType || 'unknown'
      const httpStatus = result?.httpStatus || null

      results.details.push({
        target: msg.target,
        status: 'failed',
        error: errorMessage,
        errorType: errorType,
        httpStatus: httpStatus
      })

      onError({
        target: msg.target,
        error: errorMessage,
        errorType: errorType,
        httpStatus: httpStatus,
        current: i + 1,
        total: messages.length
      })
    }

    // Delay sebelum pesan berikutnya (kecuali pesan terakhir)
    if (i < messages.length - 1) {
      onDelay({
        current: i + 1,
        total: messages.length,
        delaySeconds,
        nextTarget: messages[i + 1].target
      })

      await sleep(delaySeconds * 1000)
    }
  }

  const endTime = Date.now()
  const duration = Math.round((endTime - startTime) / 1000)

  return {
    ...results,
    duration,
    startTime,
    endTime
  }
}

/**
 * Validasi koneksi ke backend proxy
 * @returns {Promise<boolean>} True jika koneksi berhasil
 */
// validateBackendConnection dihapus (tidak relevan untuk Edge Functions)

/**
 * Helper function untuk sleep/delay
 * @param {number} ms - Milliseconds
 * @returns {Promise}
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Validasi koneksi ke Fonnte API (via backend proxy)
 * @returns {Promise<boolean>} True jika koneksi berhasil
 */
// validateFonnteConnection dihapus (bisa digantikan dengan Edge Function terpisah bila diperlukan)
