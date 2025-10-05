# Backend Proxy untuk WhatsApp API

## Arsitektur

```
Frontend (React/Tauri) → Backend Proxy (Express) → Fonnte API
     localhost:5175          localhost:3001        api.fonnte.com
```

## Mengapa Backend Proxy?

**Masalah CORS:**
- Browser memblokir request langsung dari frontend ke Fonnte API
- Error: `Failed to fetch` dengan CORS policy error

**Solusi Backend Proxy:**
- ✅ Frontend memanggil backend proxy (localhost:3001)
- ✅ Backend proxy memanggil Fonnte API
- ✅ Tidak ada CORS issue karena backend tidak terpengaruh CORS

## Struktur File

```
server/
├── index.js              # Main server file
├── routes/
│   └── fonnte.js        # Fonnte API routes
├── package.json         # Backend dependencies
├── .env                 # Backend environment variables
└── start.bat           # Windows start script

src/services/
└── whatsappApi.js       # Frontend service (memanggil backend proxy)

.env                     # Frontend environment variables
```

## Environment Variables

### Frontend (.env di root)
```env
VITE_BACKEND_URL=http://localhost:3001
VITE_PUBLIC_BASE_URL=http://localhost:5173
```

### Backend (server/.env)
```env
PORT=3001
FRONTEND_URL=http://localhost:5175
FONNTE_TOKEN=VFhuW2pCZPTYnEdhkyoa
```

## Cara Menjalankan

### Option 1: Jalankan Semua Sekaligus (RECOMMENDED)
```bash
npm run dev
```
Script ini menjalankan:
1. Backend proxy server (port 3001)
2. Tauri + Vite dev server (port 5175)

### Option 2: Jalankan Manual

**Terminal 1 - Backend Proxy:**
```bash
cd server
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run dev:tauri
```

## Endpoints Backend Proxy

### POST /api/send-wa
Kirim pesan WhatsApp

**Request:**
```json
{
  "target": "628123456789",
  "message": "Halo, ini pesan test",
  "typing": false,
  "countryCode": "62"
}
```

**Response Success:**
```json
{
  "success": true,
  "data": {
    "detail": "success! message in queue",
    "id": ["80367170"],
    "process": "pending",
    "status": true,
    "target": ["6282227097005"]
  }
}
```

**Response Error:**
```json
{
  "success": false,
  "error": "Token invalid"
}
```

### POST /api/validate-fonnte
Validasi koneksi dan token Fonnte

**Response:**
```json
{
  "success": true,
  "valid": true,
  "message": "Token valid"
}
```

### GET /api/fonnte-status
Cek status konfigurasi

**Response:**
```json
{
  "success": true,
  "configured": true,
  "tokenPreview": "VFhuW2pCZP...",
  "apiUrl": "https://api.fonnte.com/send"
}
```

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-05T08:00:00.000Z",
  "service": "ArtaPay WhatsApp Proxy"
}
```

## Testing

### 1. Test Backend Health
```bash
curl http://localhost:3001/health
```

### 2. Test Fonnte Status
```bash
curl http://localhost:3001/api/fonnte-status
```

### 3. Test Send Message
```bash
curl -X POST http://localhost:3001/api/send-wa \
  -H "Content-Type: application/json" \
  -d '{
    "target": "628123456789",
    "message": "Test message"
  }'
```

## Troubleshooting

### Error: "Tidak dapat terhubung ke backend proxy"

**Penyebab:**
- Backend server tidak berjalan

**Solusi:**
1. Pastikan backend berjalan di port 3001
2. Cek dengan: `curl http://localhost:3001/health`
3. Jika error, jalankan: `cd server && npm start`

### Error: "Token invalid"

**Penyebab:**
- Token Fonnte salah atau expired

**Solusi:**
1. Login ke https://fonnte.com
2. Copy token baru
3. Update `server/.env`:
   ```env
   FONNTE_TOKEN=your_new_token_here
   ```
4. Restart backend server

### Error: Port 3001 sudah digunakan

**Solusi:**
1. Ubah port di `server/.env`:
   ```env
   PORT=3002
   ```
2. Update `.env` di root:
   ```env
   VITE_BACKEND_URL=http://localhost:3002
   ```
3. Restart semua service

## Dependencies

### Backend (server/package.json)
- `express` - Web framework
- `cors` - CORS middleware
- `dotenv` - Environment variables
- `form-data` - FormData untuk Fonnte API
- `node-fetch` - HTTP client

### Frontend (package.json)
- `concurrently` - Run multiple commands

## Keamanan

⚠️ **PENTING:**

1. **Token Fonnte:**
   - Jangan commit token ke git
   - Simpan di `.env` (sudah di `.gitignore`)
   - Token ada di backend, tidak exposed ke frontend

2. **CORS:**
   - Backend hanya accept dari `http://localhost:5175`
   - Update `FRONTEND_URL` jika deploy

3. **Rate Limiting:**
   - Implementasi delay di frontend
   - Default: 10 detik per pesan

## Deployment

### Development
```bash
npm run dev
```

### Production
1. Build frontend:
   ```bash
   npm run build
   ```

2. Deploy backend:
   ```bash
   cd server
   npm start
   ```

3. Update environment variables untuk production URLs

## Support

Jika masih ada masalah:
1. Cek log backend di terminal
2. Cek browser console (F12)
3. Cek network tab di DevTools
4. Screenshot error dan log
