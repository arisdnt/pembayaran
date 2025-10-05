# Troubleshooting WhatsApp API (Fonnte)

## Error: "Failed to fetch"

### Penyebab Umum:

#### 1. **CORS Policy (Cross-Origin Resource Sharing)**
Browser memblokir request ke API eksternal karena security policy.

**Ciri-ciri:**
- Error: `Failed to fetch`
- Console browser menampilkan: `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solusi:**
```
Option A: Gunakan Backend Proxy
- Buat endpoint di backend (Node.js/PHP) yang memanggil Fonnte API
- Frontend memanggil backend proxy, bukan langsung ke Fonnte

Option B: Disable CORS (Development Only)
- Chrome: Install extension "CORS Unblock" atau "Allow CORS"
- Firefox: about:config → Ubah security settings
- TIDAK AMAN untuk production!

Option C: Gunakan Electron/Tauri (Desktop App)
- Desktop app tidak terkena CORS restrictions
- Tauri sudah mendukung ini dengan konfigurasi proper
```

#### 2. **Network Issue**
Tidak ada koneksi internet atau firewall memblokir.

**Ciri-ciri:**
- Error: `Failed to fetch`
- Tidak ada CORS error di console
- Browser status: Offline

**Solusi:**
- Periksa koneksi internet
- Coba akses https://api.fonnte.com di browser
- Matikan firewall/antivirus sementara
- Periksa proxy settings

#### 3. **Token Invalid**
Token Fonnte tidak valid atau expired.

**Ciri-ciri:**
- Error: `token invalid`
- HTTP Status: 200 OK tapi response.status = false

**Solusi:**
- Login ke dashboard Fonnte: https://fonnte.com
- Generate token baru
- Update file .env:
  ```
  VITE_FONNTE_TOKEN=your_new_token_here
  ```

#### 4. **Device Disconnect**
Device WhatsApp tidak terhubung di Fonnte.

**Ciri-ciri:**
- Error: `device disconnected` atau similar
- HTTP Status: 200 OK tapi message gagal

**Solusi:**
- Login ke dashboard Fonnte
- Scan QR code untuk connect device
- Pastikan WhatsApp di HP aktif dan online

## Log Output Sekarang

### Log Normal (Success):
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 MEMULAI PROSES PENGIRIMAN PESAN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📡 Menggunakan: Fonnte WhatsApp API
⏱️  Delay antar pesan: 10 detik

🔍 Memvalidasi konfigurasi...
    └─ API URL: https://api.fonnte.com/send
    └─ Token: VFhuW2pCZP...kyoa
    └─ Network: ✅ Online

📊 Total pesan pending: 4 pesan

🔄 Memulai pengiriman batch...

[1/4] 📤 Mengirim pesan... (25%)
[1/4] ✅ BERHASIL ke 628123456789
    └─ ID: 80367170
    └─ Status: success! message in queue
    └─ Process: pending

[1/4] ⏳ Menunggu 10 detik...
    └─ Pesan berikutnya: 628987654321
```

### Log Error dengan Detail:
```
[1/4] 📤 Mengirim pesan... (25%)
[1/4] ❌ GAGAL ke 628123456789
    └─ Error: Tidak dapat terhubung ke server Fonnte. Periksa koneksi internet atau CORS policy.
    └─ Type: network
    └─ 💡 Saran:
       • Periksa koneksi internet
       • Periksa CORS policy browser
       • Coba akses https://api.fonnte.com di browser
       • Periksa firewall/antivirus
```

## Debugging Steps

### 1. Cek Browser Console
Buka Developer Tools (F12) dan lihat:
- Network tab → Cek request ke Fonnte API
- Console tab → Lihat error messages detail
- Response headers → Cek CORS headers

### 2. Test API Manual
Buka Postman atau curl untuk test API:
```bash
curl -X POST https://api.fonnte.com/send \
  -H "Authorization: YOUR_TOKEN" \
  -F "target=628123456789" \
  -F "message=test"
```

### 3. Validate Token
Test token validity:
```javascript
// Di browser console
fetch('https://api.fonnte.com/send', {
  method: 'POST',
  headers: { 'Authorization': 'YOUR_TOKEN' },
  body: new FormData()
}).then(r => r.json()).then(console.log)
```

## Solusi Recommended untuk Production

### Option 1: Backend Proxy (RECOMMENDED)
Buat endpoint backend yang memanggil Fonnte:

**Backend (Node.js/Express):**
```javascript
app.post('/api/send-wa', async (req, res) => {
  const formData = new FormData()
  formData.append('target', req.body.target)
  formData.append('message', req.body.message)
  
  const response = await fetch('https://api.fonnte.com/send', {
    method: 'POST',
    headers: { 'Authorization': process.env.FONNTE_TOKEN },
    body: formData
  })
  
  res.json(await response.json())
})
```

**Frontend:**
```javascript
// Ubah di whatsappApi.js
const FONNTE_API_URL = '/api/send-wa' // Use backend proxy
```

### Option 2: Tauri Configuration
Untuk Tauri app, sudah bisa langsung tanpa CORS issue. Pastikan konfigurasi:

**src-tauri/tauri.conf.json:**
```json
{
  "tauri": {
    "allowlist": {
      "http": {
        "all": true,
        "request": true,
        "scope": ["https://api.fonnte.com/*"]
      }
    }
  }
}
```

## Environment Variables

Pastikan file `.env` sudah benar:
```env
VITE_FONNTE_API_URL=https://api.fonnte.com/send
VITE_FONNTE_TOKEN=your_actual_token_here
VITE_PUBLIC_BASE_URL=http://localhost:5173
```

## Support

Jika masih error:
1. Screenshot log lengkap
2. Screenshot browser console (Network + Console tab)
3. Cek dokumentasi Fonnte: https://api.fonnte.com
4. Contact Fonnte support jika masalah di sisi mereka
