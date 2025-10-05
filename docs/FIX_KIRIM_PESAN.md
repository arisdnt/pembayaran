# Perbaikan Halaman Kirim Pesan - Edge Function Integration

## 📋 Ringkasan Masalah

### Error yang Terjadi
```
[17:07:59] [1/4] ❌ GAGAL ke 085235836608
[17:07:59]     └─ Error: Bad request: body is required
[17:07:59]     └─ Type: unknown
[17:07:59]     └─ HTTP Status: 400
```

### Akar Penyebab
1. **Penggunaan `supabase.functions.invoke()`** yang tidak mengirimkan body dengan benar
2. **Request body tidak di-serialize** sebagai JSON dengan format yang tepat
3. **Edge function tidak menerima body** karena format request tidak sesuai

---

## 🔍 Analisis Mendalam

### 1. Edge Function (send-wa) - Status: ✅ SUDAH BENAR

Edge function di Supabase sudah dikonfigurasi dengan benar:
- Parsing body dengan `req.json()` dan fallback ke `formData()`
- Validasi parameter `target` dan `message`
- Error handling yang baik
- CORS headers sudah dikonfigurasi
- Integration dengan Fonnte API sudah benar

**File:** `supabase/functions/send-wa/index.ts`
```typescript
// Edge function sudah benar, tidak perlu diubah
let body = null;
try {
  body = await req.json();
} catch (_) {
  try {
    const form = await req.formData();
    body = Object.fromEntries(form.entries());
  } catch {
    body = null;
  }
}
```

### 2. Client-Side API Call - Status: ❌ PERLU DIPERBAIKI

**Masalah:**
```javascript
// ❌ CARA LAMA - BERMASALAH
const { data, error, response: funcResponse } = await supabase.functions.invoke(EDGE_FUNCTION_NAME, {
  headers: {
    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  },
  body: {
    target: normalizedTarget,
    message: message,
    typing: !!typing,
    countryCode: '62'
  }
})
```

**Alasan Gagal:**
- `supabase.functions.invoke()` memiliki cara khusus menangani request
- Custom headers mungkin mengubah format request
- Body tidak ter-serialize dengan benar sebagai JSON
- Supabase client library menambahkan transformasi yang tidak diinginkan

---

## ✅ Solusi yang Diterapkan

### 1. Ganti dengan Direct Fetch API

**File:** `src/services/whatsappApi.js`

```javascript
// ✅ CARA BARU - BENAR
const payload = {
  target: normalizedTarget,
  message: message,
  typing: !!typing,
  countryCode: '62'
}

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
```

**Keuntungan:**
- Kontrol penuh atas format request
- Body dijamin di-serialize sebagai JSON string
- Headers dikirim dengan benar
- Tidak ada transformasi tak terduga dari Supabase client
- Response handling lebih transparan

### 2. Improved Error Handling

```javascript
// Parse response dengan aman
const contentType = response.headers.get('content-type') || ''
let result

if (contentType.includes('application/json')) {
  result = await response.json()
} else {
  const text = await response.text()
  console.warn(`[WhatsApp API] Non-JSON response:`, text)
  result = { success: false, error: text || 'Invalid response format' }
}

// Check HTTP status
if (!response.ok) {
  const errorMsg = result.error || `HTTP ${response.status}: ${response.statusText}`
  throw new Error(errorMsg)
}
```

### 3. Enhanced Logging

```javascript
console.log(`[WhatsApp API] Payload:`, payload)
console.log(`[WhatsApp API] Response status: ${response.status} ${response.statusText}`)
console.log(`[WhatsApp API] Response data:`, result)
```

### 4. Better Error Classification

```javascript
// Kategorisasi error yang lebih baik
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
```

### 5. Performance Optimization

**File:** `index.html`

Ditambahkan DNS preconnect untuk Edge Functions domain:
```html
<link rel="preconnect" href="https://lbfsfabyannihnrttqbj.functions.supabase.co" crossorigin />
<link rel="dns-prefetch" href="https://lbfsfabyannihnrttqbj.functions.supabase.co" />
```

**Manfaat:** Mengurangi latency dengan melakukan DNS lookup dan SSL handshake lebih awal.

### 6. Environment Validation

```javascript
// Validate environment saat module load
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('[WhatsApp API] Missing Supabase environment variables!')
  console.error('- VITE_SUPABASE_URL:', SUPABASE_URL ? '✓' : '✗')
  console.error('- VITE_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✓' : '✗')
}

console.log('[WhatsApp API] Configuration loaded:')
console.log('- Edge Function URL:', EDGE_FUNCTION_URL)
console.log('- API Key configured:', SUPABASE_ANON_KEY ? 'Yes' : 'No')
```

---

## 🧪 Testing Checklist

Setelah perbaikan, lakukan testing berikut:

### 1. Environment Check
- [ ] Pastikan `.env` memiliki `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY`
- [ ] Buka browser console, cek log configuration
- [ ] Tidak ada error "Missing Supabase environment variables"

### 2. Network Check
- [ ] Buka DevTools > Network tab
- [ ] Generate pesan dan klik "Kirim Pesan"
- [ ] Cari request ke `https://lbfsfabyannihnrttqbj.functions.supabase.co/send-wa`
- [ ] Pastikan:
  - Method: POST
  - Status: 200 (jika berhasil)
  - Request Headers: Authorization, apikey, Content-Type ada
  - Request Body: JSON dengan field target, message, typing, countryCode

### 3. Functional Test
- [ ] Generate pesan untuk 1-2 siswa saja (untuk testing)
- [ ] Klik "Kirim Pesan"
- [ ] Periksa log di panel kanan:
  - Tidak ada error "Bad request: body is required"
  - Status berhasil: ✅ BERHASIL ke <nomor>
  - Response detail dari Fonnte
- [ ] Periksa status di tabel berubah menjadi "Terkirim" (hijau)
- [ ] Cek WhatsApp penerima untuk memastikan pesan masuk

### 4. Error Handling Test
- [ ] Test dengan nomor tidak valid (misal: "123") - harus ada error jelas
- [ ] Test tanpa koneksi internet - harus ada error "network"
- [ ] Cek Fonnte dashboard untuk memastikan device aktif

---

## 📊 Perbandingan: Sebelum vs Sesudah

### Sebelum Perbaikan
```
❌ Error: Bad request: body is required
❌ HTTP Status: 400
❌ Type: unknown
❌ Tidak ada detail error yang jelas
```

### Sesudah Perbaikan
```
✅ Request body dikirim dengan format JSON yang benar
✅ Edge function menerima dan memproses body
✅ Error handling lebih detail dan informatif
✅ Logging lengkap untuk debugging
✅ Performance optimization dengan DNS preconnect
```

---

## 🔧 Konfigurasi yang Diperlukan

### 1. Environment Variables
File: `.env`
```env
VITE_SUPABASE_URL=https://lbfsfabyannihnrttqbj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. Supabase Edge Function
- Nama: `send-wa`
- Status: ACTIVE
- Version: 5 (atau terbaru)
- Secret: `FONNTE_TOKEN` (harus diset di Supabase Dashboard)

### 3. Fonnte API
- Token valid dan aktif
- Device WhatsApp terhubung
- Dashboard: https://fonnte.com/

### 4. CSP Configuration
Sudah dikonfigurasi di `index.html` dan `tauri.conf.json`:
```
connect-src 'self'
  https://lbfsfabyannihnrttqbj.functions.supabase.co
  https://lbfsfabyannihnrttqbj.supabase.co
  https://api.fonnte.com
```

---

## 🎯 Hasil yang Diharapkan

Setelah perbaikan ini:
1. ✅ Pengiriman pesan WhatsApp melalui Edge Function berhasil
2. ✅ Tidak ada lagi error "Bad request: body is required"
3. ✅ Log pengiriman lengkap dan informatif
4. ✅ Status pesan ter-update dengan benar di database
5. ✅ Error handling yang jelas untuk debugging
6. ✅ Performance lebih baik dengan DNS preconnect

---

## 📝 Catatan Penting

### Batasan Rate Limit Fonnte
- Fonnte memiliki rate limit per akun
- Gunakan delay minimal 5-10 detik antar pesan
- Untuk batch besar, pertimbangkan delay lebih lama

### Monitoring
- Cek Supabase Dashboard > Edge Functions > Logs untuk error edge function
- Cek Fonnte Dashboard untuk status pengiriman
- Cek browser console untuk error client-side

### Troubleshooting
Jika masih ada error:
1. Cek browser console untuk error detail
2. Cek Supabase Edge Function logs
3. Cek Fonnte dashboard untuk status device
4. Pastikan FONNTE_TOKEN valid dan tidak expired
5. Cek koneksi internet
6. Cek CSP di browser DevTools > Console

---

## 🔗 Referensi

- [Fonnte API Documentation](https://docs.fonnte.com/)
- [Supabase Edge Functions](https://supabase.com/docs/guides/functions)
- [Supabase Edge Functions CORS](https://supabase.com/docs/guides/functions/cors)
- [Fetch API MDN](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)

---

**Tanggal Perbaikan:** 5 Juni 2025  
**Versi:** 1.0  
**Status:** ✅ SELESAI
