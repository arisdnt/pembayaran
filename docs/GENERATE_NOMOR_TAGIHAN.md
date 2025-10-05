# Fitur Generate Nomor Tagihan

## Deskripsi
Button generate nomor tagihan telah ditambahkan di halaman **Create Tagihan** (`/tagihan/create`), di sebelah field input Nomor Tagihan.

## Lokasi
- **Path**: `/tagihan/create`
- **Section**: Informasi Tagihan
- **Field**: Nomor Tagihan

## Format Nomor Tagihan
Format nomor tagihan yang di-generate:
```
TGH-YYYY-MM-NNN
```

Contoh:
- `TGH-2025-01-001` - Tagihan pertama di Januari 2025
- `TGH-2025-01-002` - Tagihan kedua di Januari 2025
- `TGH-2025-02-001` - Tagihan pertama di Februari 2025

### Komponen Format:
- **TGH**: Prefix (Tagihan)
- **YYYY**: Tahun (4 digit)
- **MM**: Bulan (2 digit, 01-12)
- **NNN**: Nomor urut (3 digit, mulai dari 001)

## Cara Menggunakan

1. **Buka halaman Create Tagihan** (`/tagihan/create`)
2. **Klik button "Generate"** di sebelah field Nomor Tagihan
3. **Nomor tagihan akan otomatis terisi** dengan format yang sesuai
4. Nomor urut akan otomatis increment berdasarkan tagihan yang sudah ada di bulan yang sama

## Logika Auto Increment

Button generate akan:
1. Mengambil tanggal sistem saat ini (tahun dan bulan)
2. Mencari semua tagihan yang ada dengan prefix yang sama (`TGH-YYYY-MM`)
3. Menemukan nomor urut tertinggi dari tagihan yang ada
4. Generate nomor baru dengan increment +1 dari nomor tertinggi

### Contoh:
- Jika sudah ada: `TGH-2025-01-001`, `TGH-2025-01-002`, `TGH-2025-01-005`
- Button generate akan membuat: `TGH-2025-01-006` (nomor tertinggi + 1)

## Fitur Tambahan

- **Manual Override**: User masih bisa mengetik nomor tagihan secara manual jika diperlukan
- **Validasi**: Sistem akan tetap melakukan validasi uniqueness saat submit
- **Auto-numbering untuk Multiple Bills**: Saat membuat tagihan massal (tingkat/kelas), nomor akan otomatis ditambahkan suffix `-001`, `-002`, dst.

## File yang Dimodifikasi

1. **`src/pages/Tagihan/components/InformasiTagihanSection.jsx`**
   - Menambahkan button generate
   - Update layout dengan flexbox untuk button

2. **`src/pages/Tagihan/CreateTagihan.jsx`**
   - Implementasi fungsi `generateNomorTagihan()`
   - Pass fungsi ke component InformasiTagihanSection

## Technical Details

### Query Pattern
Menggunakan Dexie.js `where().startsWith()` untuk efficient querying:
```javascript
const existingTagihan = await db.tagihan
  .where('nomor_tagihan')
  .startsWith(prefix)
  .toArray()
```

### Sequence Detection
Parsing nomor dari format dengan split dan parseInt:
```javascript
const parts = t.nomor_tagihan.split('-')
if (parts.length === 4) {
  const seq = parseInt(parts[3], 10)
  // Find max sequence
}
```

### Padding
Menggunakan `padStart()` untuk zero-padding:
```javascript
String(nextSequence).padStart(3, '0') // 001, 002, ..., 099, 100
```

## UI/UX

- Button dengan icon **RefreshCw** (lucide-react)
- Variant "soft" untuk subtle appearance
- Konsisten dengan design system (square borders, no radius)
- Shrink-0 untuk prevent button resize
- Flex layout untuk responsive behavior
