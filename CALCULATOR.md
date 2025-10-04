# Calculator Feature

## Fitur Calculator

Calculator telah berhasil diimplementasikan dengan fitur lengkap:

### 1. **Akses Global**
- Calculator dapat diakses dari halaman manapun dalam aplikasi
- Icon calculator tersedia di Navbar (sebelah kanan, dekat tombol Refresh)
- Klik icon calculator untuk membuka/menutup calculator

### 2. **Draggable**
- Calculator dapat dipindahkan dengan cara drag and drop
- Klik dan tahan pada header calculator untuk memindahkannya
- Calculator memiliki boundary check agar tidak keluar dari viewport

### 3. **Keyboard Support**
Calculator mendukung input keyboard:
- **Angka (0-9)**: Input angka
- **Operator (+, -, *, /)**: Operasi matematika
- **Enter atau =**: Hitung hasil
- **Escape**: Clear (reset calculator)
- **Backspace**: Hapus digit terakhir
- **.**: Input desimal
- **%**: Konversi ke persentase

### 4. **UI/UX**
- Design compact dan konsisten dengan theme aplikasi (gradient biru ArtaPay)
- Display menunjukkan operasi yang sedang berlangsung
- Tombol-tombol dengan warna yang jelas:
  - Merah: Clear
  - Biru: Operator
  - Hijau: Equals
  - Putih: Angka
  - Abu-abu: Backspace dan Persentase

### 5. **Modal Behavior**
- Calculator tidak akan close otomatis kecuali:
  - User klik tombol X (close button) di header
  - User klik icon calculator di navbar lagi (toggle)
- Keyboard input hanya aktif ketika calculator terbuka

## File yang Dibuat/Dimodifikasi

### File Baru:
1. `src/contexts/CalculatorContext.jsx` - Context untuk state management
2. `src/components/Calculator.jsx` - Component calculator

### File Dimodifikasi:
1. `src/main.jsx` - Menambahkan CalculatorProvider
2. `src/components/AppLayout.jsx` - Menambahkan Calculator component
3. `src/layout/Navbar.jsx` - Menambahkan icon dan toggle button

## Cara Menggunakan

1. **Buka aplikasi**
2. **Klik icon Calculator** di Navbar (icon kalkulator di bagian kanan navbar)
3. **Calculator akan muncul** di pojok kanan atas layar
4. **Gunakan mouse atau keyboard** untuk menghitung
5. **Drag header** untuk memindahkan calculator ke posisi yang diinginkan
6. **Klik tombol X** atau **klik icon calculator lagi** untuk menutup

## Troubleshooting

Jika calculator tidak muncul:
1. Pastikan Anda sudah login ke aplikasi
2. Periksa console browser (F12) untuk error
3. Refresh halaman (Ctrl+R atau F5)
4. Coba restart aplikasi

## Technical Details

- **State Management**: React Context API
- **Z-Index**: 9999 (agar selalu di atas)
- **Position**: Fixed positioning dengan boundary checks
- **Framework**: React + Radix UI untuk konsistensi theme
