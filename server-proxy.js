/**
 * Backend Proxy untuk Fonnte WhatsApp API
 * Solusi untuk CORS issue
 * 
 * Cara menjalankan:
 * 1. npm install express cors form-data node-fetch
 * 2. node server-proxy.js
 * 3. Backend akan jalan di http://localhost:3001
 */

const express = require('express')
const cors = require('cors')
const FormData = require('form-data')
const fetch = require('node-fetch')

const app = express()

// Enable CORS untuk frontend
app.use(cors({
  origin: '*', // Atau specific domain: 'http://localhost:5173'
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Configuration
const FONNTE_API_URL = 'https://api.fonnte.com/send'
const FONNTE_TOKEN = process.env.FONNTE_TOKEN || 'VFhuW2pCZPTYnEdhkyoa'

/**
 * Endpoint untuk kirim WhatsApp
 * POST /api/send-wa
 * Body: { target, message, typing }
 */
app.post('/api/send-wa', async (req, res) => {
  const startTime = Date.now()
  
  try {
    console.log(`[${new Date().toISOString()}] Incoming request:`, {
      target: req.body.target,
      messageLength: req.body.message?.length || 0
    })

    const { target, message, typing = false } = req.body

    // Validation
    if (!target) {
      return res.status(400).json({
        status: false,
        reason: 'Target nomor WhatsApp harus diisi'
      })
    }

    if (!message) {
      return res.status(400).json({
        status: false,
        reason: 'Message harus diisi'
      })
    }

    // Prepare FormData untuk Fonnte API
    const formData = new FormData()
    // Ensure form-data fields are strings
    formData.append('target', String(target))
    formData.append('message', String(message))
    formData.append('typing', String(!!typing))
    formData.append('countryCode', '62')

    console.log(`[${new Date().toISOString()}] Forwarding to Fonnte API...`)

    // Forward request ke Fonnte API
    const response = await fetch(FONNTE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': FONNTE_TOKEN
      },
      body: formData
    })

    const result = await response.json()
    const duration = Date.now() - startTime

    console.log(`[${new Date().toISOString()}] Fonnte response (${duration}ms):`, {
      status: result.status,
      reason: result.reason || result.detail
    })

    // Return response ke frontend
    res.json(result)

  } catch (error) {
    const duration = Date.now() - startTime
    console.error(`[${new Date().toISOString()}] Error (${duration}ms):`, error.message)
    
    res.status(500).json({
      status: false,
      reason: 'Internal server error: ' + error.message
    })
  }
})

/**
 * Health check endpoint
 * GET /health
 */
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    token: FONNTE_TOKEN.substring(0, 10) + '...'
  })
})

/**
 * Test endpoint untuk validasi token
 * GET /api/test-token
 */
app.get('/api/test-token', async (req, res) => {
  try {
    const formData = new FormData()
    formData.append('target', '6281234567890')
    formData.append('message', 'test')
    formData.append('countryCode', '62')

    const response = await fetch(FONNTE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': FONNTE_TOKEN
      },
      body: formData
    })

    const result = await response.json()
    
    res.json({
      tokenValid: result.reason !== 'token invalid',
      response: result
    })
  } catch (error) {
    res.status(500).json({
      tokenValid: false,
      error: error.message
    })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error)
  res.status(500).json({
    status: false,
    reason: 'Internal server error'
  })
})

// Start server
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('🚀 Fonnte WhatsApp API Proxy Server')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`✅ Server running on: http://localhost:${PORT}`)
  console.log(`📡 Fonnte API: ${FONNTE_API_URL}`)
  console.log(`🔑 Token: ${FONNTE_TOKEN.substring(0, 10)}...`)
  console.log('')
  console.log('Available endpoints:')
  console.log(`  POST http://localhost:${PORT}/api/send-wa`)
  console.log(`  GET  http://localhost:${PORT}/health`)
  console.log(`  GET  http://localhost:${PORT}/api/test-token`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
})

module.exports = app
