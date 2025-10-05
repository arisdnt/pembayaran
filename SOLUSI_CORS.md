# Solusi CORS untuk Fonnte API

## 🔴 Masalah
Browser memblokir request ke `api.fonnte.com` karena CORS policy. Ini adalah **security feature** browser yang tidak bisa dibypass dari frontend.

## ✅ Solusi yang Tersedia

### **OPTION 1: Backend Proxy (RECOMMENDED untuk Production)**

#### A. Node.js/Express Backend
**1. Install dependencies:**
```bash
npm install express cors form-data node-fetch
```

**2. Buat file `server.js`:**
```javascript
const express = require('express')
const cors = require('cors')
const FormData = require('form-data')
const fetch = require('node-fetch')

const app = express()
app.use(cors())
app.use(express.json())

const FONNTE_TOKEN = 'VFhuW2pCZPTYnEdhkyoa'

app.post('/api/send-wa', async (req, res) => {
  try {
    const { target, message, typing = false } = req.body

    const formData = new FormData()
    formData.append('target', target)
    formData.append('message', message)
    formData.append('typing', typing)
    formData.append('countryCode', '62')

    const response = await fetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': FONNTE_TOKEN
      },
      body: formData
    })

    const result = await response.json()
    res.json(result)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Backend proxy running on http://localhost:${PORT}`)
})
```

**3. Jalankan backend:**
```bash
node server.js
```

**4. Update frontend `whatsappApi.js`:**
```javascript
// Ganti URL ke backend proxy
const FONNTE_API_URL = 'http://localhost:3001/api/send-wa'

// Ubah fetch menjadi JSON karena sekarang hit backend sendiri
export async function sendWhatsAppMessage({ target, message, typing = false }) {
  try {
    const response = await fetch(FONNTE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ target, message, typing })
    })

    const result = await response.json()
    
    if (!result.status) {
      throw new Error(result.reason || 'Gagal mengirim pesan')
    }

    return {
      success: true,
      data: result,
      target: target
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      errorType: 'network',
      target: target
    }
  }
}
```

---

#### B. PHP Backend (Alternatif)
**Buat file `send-wa.php`:**
```php
<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$target = $_POST['target'] ?? '';
$message = $_POST['message'] ?? '';
$typing = $_POST['typing'] ?? false;

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => 'https://api.fonnte.com/send',
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => '',
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 0,
  CURLOPT_FOLLOWLOCATION => true,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => 'POST',
  CURLOPT_POSTFIELDS => array(
    'target' => $target,
    'message' => $message,
    'typing' => $typing,
    'countryCode' => '62'
  ),
  CURLOPT_HTTPHEADER => array(
    'Authorization: VFhuW2pCZPTYnEdhkyoa'
  ),
));

$response = curl_exec($curl);
curl_close($curl);

echo $response;
?>
```

---

### **OPTION 2: Browser Extension (Development Only)**

**⚠️ HANYA UNTUK TESTING - TIDAK AMAN UNTUK PRODUCTION!**

#### Chrome:
1. Install extension: [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino)
2. Atau [Allow CORS](https://chrome.google.com/webstore/detail/allow-cors-access-control/lhobafahddgcelffkeicbaginigeejlf)
3. Enable extension
4. Refresh aplikasi
5. Coba kirim lagi

#### Firefox:
1. Install [CORS Everywhere](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/)
2. Enable extension
3. Refresh aplikasi

---

### **OPTION 3: Tauri Configuration (Desktop App)**

Jika ini **desktop app dengan Tauri**, Anda bisa bypass CORS:

**Update `src-tauri/tauri.conf.json`:**
```json
{
  "tauri": {
    "allowlist": {
      "http": {
        "all": true,
        "request": true,
        "scope": [
          "https://api.fonnte.com/*"
        ]
      }
    },
    "security": {
      "csp": "default-src 'self'; connect-src 'self' https://api.fonnte.com"
    }
  }
}
```

**Update `whatsappApi.js` untuk Tauri:**
```javascript
import { fetch as tauriFetch } from '@tauri-apps/api/http'

export async function sendWhatsAppMessage({ target, message, typing = false }) {
  try {
    const normalizedTarget = normalizePhone(target)

    const response = await tauriFetch('https://api.fonnte.com/send', {
      method: 'POST',
      headers: {
        'Authorization': FONNTE_TOKEN
      },
      body: {
        type: 'Form',
        payload: {
          target: normalizedTarget,
          message: message,
          typing: typing,
          countryCode: '62'
        }
      }
    })

    if (!response.data.status) {
      throw new Error(response.data.reason || 'Gagal mengirim pesan')
    }

    return {
      success: true,
      data: response.data,
      target: normalizedTarget
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
      errorType: 'network',
      target: target
    }
  }
}
```

---

### **OPTION 4: Test Manual (Untuk Verifikasi Token)**

**Test di Browser Console (F12):**
```javascript
// Test dengan fetch native
(async () => {
    const data = new FormData()
    data.append("target", "082227097005")
    data.append("message", "test dari console")
    data.append("countryCode", "62")

    const response = await fetch("https://api.fonnte.com/send", {
        method: "POST",
        mode: "cors",
        headers: new Headers({
            Authorization: "VFhuW2pCZPTYnEdhkyoa",
        }),
        body: data,
    });

    const res = await response.json();
    console.log(res)
})()
```

**Jika token valid, akan muncul:**
```json
{
  "status": false,
  "reason": "CORS blocked" // Ini normal di browser
}
```

**Atau test dengan CURL (Terminal/CMD):**
```bash
curl -X POST https://api.fonnte.com/send \
  -H "Authorization: VFhuW2pCZP TYnEdhkyoa" \
  -F "target=082227097005" \
  -F "message=test dari curl" \
  -F "countryCode=62"
```

---

## 📊 Perbandingan Solusi

| Solusi | Kelebihan | Kekurangan | Recommended |
|--------|-----------|------------|-------------|
| Backend Proxy | ✅ Aman<br>✅ Production-ready<br>✅ Kontrol penuh | ⚠️ Butuh backend server | ⭐⭐⭐⭐⭐ |
| CORS Extension | ✅ Cepat untuk testing<br>✅ Tidak perlu coding | ❌ Tidak aman<br>❌ Hanya development | ⭐⭐ |
| Tauri HTTP | ✅ No CORS issue<br>✅ Native performance | ⚠️ Desktop only | ⭐⭐⭐⭐ |
| Test Manual | ✅ Verifikasi token<br>✅ Quick debug | ❌ Bukan solusi permanen | ⭐⭐⭐ |

---

## 🎯 Rekomendasi

### Untuk Development:
1. Install CORS extension
2. Test dengan extension enabled
3. Verifikasi token dan connectivity

### Untuk Production:
1. **Gunakan Backend Proxy** (Node.js/PHP)
2. Deploy backend ke server
3. Frontend hit backend proxy instead of Fonnte directly

### Untuk Desktop App:
1. Gunakan Tauri HTTP API
2. Configure allowlist di tauri.conf.json
3. No CORS issue!

---

## 🆘 Still Having Issues?

1. **Pastikan token valid:**
   - Login ke https://fonnte.com
   - Check token di dashboard
   - Generate token baru jika perlu

2. **Pastikan device connected:**
   - WhatsApp harus scan QR di Fonnte dashboard
   - Device harus online

3. **Check quota:**
   - Fonnte punya limit message per bulan
   - Check sisa quota di dashboard

4. **Contact support:**
   - Email: support@fonnte.com
   - WhatsApp: 0822-2709-7005
