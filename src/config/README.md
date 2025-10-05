# Panduan Konfigurasi Aplikasi

## 📄 File Konfigurasi: `appInfo.ts`

File ini berisi **SEMUA konfigurasi** untuk aplikasi dan identitas sekolah Anda.

### 🎯 Cara Menggunakan

#### 1️⃣ **Edit Data Sekolah**
Buka file `appInfo.ts` dan scroll ke **BAGIAN 1: KONFIGURASI SEKOLAH** (baris 10-100).

Edit bagian berikut sesuai data sekolah Anda:

```typescript
// ---------- DATA DASAR SEKOLAH ----------
basic: {
  name: 'SMK Negeri 1 Bandung',          // ✏️ Ubah nama sekolah
  shortName: 'SMKN 1 Bandung',           // ✏️ Ubah nama singkat
  level: 'SMK',                          // ✏️ Pilih: SD/SMP/SMA/SMK/UNIVERSITAS/PESANTREN
  npsn: '20219445',                      // ✏️ Ubah NPSN sekolah
  nss: '321026002001'                    // ✏️ Ubah NSS sekolah
}

// ---------- KONTAK SEKOLAH ----------
contact: {
  address: {
    street: 'Jl. Wastukancana No. 3',   // ✏️ Ubah alamat
    city: 'Bandung',                     // ✏️ Ubah kota
    // ... dan seterusnya
  },
  phone: '(022) 4207026',                // ✏️ Ubah telepon
  email: 'info@smkn1bandung.sch.id',     // ✏️ Ubah email
}

// Dan seterusnya...
```

#### 2️⃣ **Edit Info Aplikasi**
Scroll ke **BAGIAN 2: KONFIGURASI APLIKASI** (baris 120-150).

```typescript
export const APP_CONFIG = {
  name: 'Sistem Informasi Akademik',     // ✏️ Ubah nama aplikasi
  version: '1.0.0',                      // ✏️ Ubah versi
  
  maker: {
    company: 'Digital Innovation Labs',  // ✏️ Ubah nama pembuat
    email: 'info@digitalinnovationlabs.com',  // ✏️ Ubah email
  },
}
```

#### 3️⃣ **JANGAN Edit Bagian Lain**
- BAGIAN 3-7 adalah kode program (interfaces & helper functions)
- ⚠️ **JANGAN DIUBAH** kecuali Anda developer

---

## 🚀 Cara Menggunakan di Kode

### Import Functions
```typescript
// Import helper functions
import { 
  getSchoolName, 
  getSchoolAddress,
  getAppVersion 
} from '@/config/appInfo'

// Gunakan di component
const schoolName = getSchoolName()  // "SMK Negeri 1 Bandung"
```

### Import Constants
```typescript
// Import constants
import { 
  SCHOOL_NAME, 
  SCHOOL_PHONE,
  APP_VERSION 
} from '@/config/appInfo'

// Gunakan langsung
console.log(SCHOOL_NAME)  // "SMK Negeri 1 Bandung"
```

### Import Data Object
```typescript
// Import full object
import { SCHOOL_IDENTITY } from '@/config/appInfo'

// Akses nested data
const logo = SCHOOL_IDENTITY.branding.logo.primary
const programs = SCHOOL_IDENTITY.academic.programs
```

---

## 📖 Daftar Helper Functions

### 🏫 School Functions

**Basic Info:**
- `getSchoolName()` - Nama lengkap sekolah
- `getSchoolShortName()` - Nama singkat sekolah
- `getSchoolLevel()` - Jenjang pendidikan (SD/SMP/SMA/SMK/dll)
- `getSchoolNPSN()` - Nomor Pokok Sekolah Nasional
- `getSchoolNSS()` - Nomor Statistik Sekolah

**Contact Info:**
- `getSchoolAddress()` - Alamat lengkap
- `getSchoolPhone()` - Nomor telepon
- `getSchoolFax()` - Nomor fax
- `getSchoolEmail()` - Email sekolah
- `getSchoolWebsite()` - Website sekolah

**Formatted Info:**
- `getSchoolFullTitle()` - Nama + jenjang (contoh: "SMK Negeri 1 Bandung (SMK)")
- `getSchoolContactInfo()` - Alamat, telepon, email dalam satu string

### 📱 App Functions
- `getAppName()` - Nama aplikasi
- `getAppVersion()` - Versi aplikasi
- `getAppDescription()` - Deskripsi aplikasi
- `getMakerCompany()` - Nama perusahaan pembuat
- `getMakerWebsite()` - Website pembuat
- `getMakerEmail()` - Email pembuat
- `getMakerTrademark()` - Trademark pembuat
- `getCopyrightNotice()` - Notice copyright
- `getFullAppInfo()` - Info lengkap app (nama + versi)

---

## ⚙️ Environment Variables (Opsional)

Jika ingin override konfigurasi via environment, set di file `.env`:

```bash
VITE_SCHOOL_NAME="SMK Negeri 2 Jakarta"
VITE_SCHOOL_ADDRESS="Jl. Example No. 123, Jakarta"
VITE_SCHOOL_PHONE="(021) 1234567"
VITE_SCHOOL_EMAIL="info@example.sch.id"
```

Lalu gunakan:
```typescript
import { getSchoolIdentityForEnv } from '@/config/appInfo'

const school = getSchoolIdentityForEnv()  // Akan menggunakan env vars jika ada
```

---

## ✅ Checklist Konfigurasi

Sebelum deploy, pastikan sudah mengisi:

### Data Sekolah
- [ ] Nama sekolah (lengkap & singkat)
- [ ] Jenjang pendidikan (SD/SMP/SMA/SMK/dll)
- [ ] NPSN & NSS
- [ ] Alamat lengkap (jalan, kelurahan, kecamatan, kota, provinsi, kode pos)
- [ ] Kontak (telepon, fax, email, website)

### Info Aplikasi  
- [ ] Nama aplikasi
- [ ] Versi
- [ ] Deskripsi aplikasi
- [ ] Info pembuat/developer (company, website, email, trademark)
- [ ] Copyright (year, holder)

---

## 💡 Tips

1. **Backup file ini** sebelum edit pertama kali
2. **Gunakan VSCode** untuk syntax highlighting yang baik
3. **Perhatikan tanda kutip** - jangan hilangkan `'` atau `"`
4. **Perhatikan koma** - setiap field harus ada koma di akhir
5. **Test build** setelah edit: `npm run build`

---

## ❓ Troubleshooting

### Build Error setelah edit?
- Cek syntax: pastikan semua kutip & koma benar
- Cek type: `level` hanya bisa: SD/SMP/SMA/SMK/UNIVERSITAS/PESANTREN
- Cek `as const` setelah level - jangan dihapus

### Data tidak muncul?
- Pastikan sudah save file
- Restart dev server: `npm run dev`
- Clear cache browser (Ctrl+Shift+R)

---

📚 **Need Help?** Baca komentar di dalam file `appInfo.ts` untuk detail lebih lanjut.
