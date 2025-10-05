# Cara Menggunakan Backend Proxy

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd C:\pembayaran
npm install --save express cors form-data node-fetch@2
```

### 2. Jalankan Backend Server
```bash
node server-proxy.js
```

Output yang diharapkan:
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Fonnte WhatsApp API Proxy Server
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ Server running on: http://localhost:3001
📡 Fonnte API: https://api.fonnte.com/send
🔑 Token: VFhuW2pCZP...

Available endpoints:
  POST http://localhost:3001/api/send-wa
  GET  http://localhost:3001/health
  GET  http://localhost:3001/api/test-token
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### 3. Test Backend (Opsional)
Buka browser atau Postman, test endpoint:
```
http://localhost:3001/health
```

### 4. Update Frontend

**File: `src/services/whatsappApi.js`**

Ubah bagian ini:
```javascript
// BEFORE (langsung ke Fonnte - CORS error)
const FONNTE_API_URL = 'https://api.fonnte.com/send'

// AFTER (lewat backend proxy - NO CORS issue)
const FONNTE_API_URL = 'http://localhost:3001/api/send-wa'
```

Dan ubah function `sendWhatsAppMessage`:
```javascript
export async function sendWhatsAppMessage({ target, message, typing = false }) {
  let response
  try {
    const normalizedTarget = normalizePhone(target)

    if (!normalizedTarget) {
      throw new Error('Nomor target tidak valid')
    }

    console.log(`[WhatsApp API] Mengirim ke ${normalizedTarget}...`)

    // PENTING: Sekarang kirim sebagai JSON, bukan FormData
    response = await fetch(FONNTE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        target: normalizedTarget,
        message: message,
        typing: typing
      })
    })

    console.log(`[WhatsApp API] Response status: ${response.status}`)

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`[WhatsApp API] Error response: ${errorText}`)
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const result = await response.json()
    console.log(`[WhatsApp API] Response data:`, result)

    if (!result.status) {
      throw new Error(result.reason || 'Gagal mengirim pesan')
    }

    return {
      success: true,
      data: result,
      target: normalizedTarget,
      httpStatus: response.status
    }
  } catch (error) {
    console.error('[WhatsApp API] Full error:', error)
    
    let errorMessage = error.message
    let errorType = 'unknown'

    if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
      errorType = 'network'
      errorMessage = 'Tidak dapat terhubung ke backend proxy. Pastikan server proxy berjalan di http://localhost:3001'
    } else if (error.message.includes('HTTP')) {
      errorType = 'http'
    } else if (error.message.includes('token')) {
      errorType = 'auth'
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
```

### 5. Jalankan Frontend
```bash
npm run dev
```

### 6. Test Kirim Pesan
- Buka aplikasi di browser
- Pilih filter dan klik Generate
- Klik Kirim Pesan
- Lihat log di:
  - **Browser console** (F12): Log dari frontend
  - **Terminal backend**: Log dari backend proxy

## 📊 Expected Flow

```
Frontend (Browser)
    ↓ POST /api/send-wa (JSON)
Backend Proxy (localhost:3001)
    ↓ POST /send (FormData)
Fonnte API (api.fonnte.com)
    ↓ Response
Backend Proxy
    ↓ Response
Frontend (Browser)
    ↓ Update status ke IndexedDB
```

## 🔧 Troubleshooting

### Backend tidak bisa start:
```
Error: Cannot find module 'express'
```
**Solusi:** Install dependencies
```bash
npm install --save express cors form-data node-fetch@2
```

### Frontend masih CORS error:
```
Access to fetch at 'http://localhost:3001/api/send-wa' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```
**Solusi:** Pastikan backend sudah running! Check terminal backend.

### Backend error "token invalid":
```
{
  "status": false,
  "reason": "token invalid"
}
```
**Solusi:** 
1. Login ke https://fonnte.com
2. Copy token baru
3. Update di `server-proxy.js` atau set env variable:
   ```bash
   set FONNTE_TOKEN=your_new_token_here
   node server-proxy.js
   ```

### Port 3001 sudah dipakai:
```
Error: listen EADDRINUSE: address already in use :::3001
```
**Solusi:** Ubah port di `server-proxy.js`:
```javascript
const PORT = process.env.PORT || 3002 // Ganti ke port lain
```

## 🎯 Production Deployment

### Deploy ke VPS/Cloud:
1. Upload `server-proxy.js` ke server
2. Install dependencies: `npm install`
3. Install PM2: `npm install -g pm2`
4. Start dengan PM2: `pm2 start server-proxy.js`
5. Setup nginx reverse proxy
6. Update frontend URL ke domain production

### Deploy ke Heroku:
1. Create `Procfile`:
   ```
   web: node server-proxy.js
   ```
2. Push ke Heroku
3. Set env variable: `heroku config:set FONNTE_TOKEN=xxx`
4. Update frontend URL ke Heroku app URL

### Deploy ke Vercel (Serverless):
1. Install Vercel CLI: `npm i -g vercel`
2. Create `vercel.json`:
   ```json
   {
     "version": 2,
     "builds": [
       {
         "src": "server-proxy.js",
         "use": "@vercel/node"
       }
     ],
     "routes": [
       {
         "src": "/(.*)",
         "dest": "server-proxy.js"
       }
     ]
   }
   ```
3. Deploy: `vercel`
4. Update frontend URL ke Vercel URL

## ✅ Keuntungan Menggunakan Backend Proxy

1. ✅ **No CORS Issue** - Backend tidak terkena CORS policy
2. ✅ **Token Aman** - Token tidak exposed di frontend
3. ✅ **Logging** - Bisa log semua request di backend
4. ✅ **Rate Limiting** - Bisa tambahkan rate limiting
5. ✅ **Caching** - Bisa cache response jika perlu
6. ✅ **Monitoring** - Mudah monitor request/response
7. ✅ **Production Ready** - Solusi yang proper untuk production
