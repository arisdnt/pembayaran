# Testing Guide: Upload Bukti Pembayaran

## 🐛 Bug yang Diperbaiki

### Masalah Sebelumnya:
1. ❌ File tidak di-pass dari modal ke action
2. ❌ URL file tidak ter-update setelah upload offline → online

### Perbaikan yang Dilakukan:
1. ✅ Fix `usePaymentFlow.js` - Pass `bukti_file` ke `createPembayaranWithRincian`
2. ✅ Fix `fileUploadHelper.js` - Auto-update `rincian_pembayaran` setelah upload berhasil
3. ✅ Tambah logging lengkap untuk debug

---

## 🧪 Testing Steps

### Test 1: Upload File Online (Happy Path)

**Expected Result**: File langsung terupload ke Supabase dan URL tersimpan

**Steps**:
1. Buka browser console (F12)
2. Pastikan online (check network tab)
3. Buka `/pembayaran/create`
4. Pilih siswa
5. Klik "Bayar" pada tagihan
6. Upload file (gambar atau PDF)
7. Isi nominal dan klik "Tambahkan"
8. Klik "Proses & Cetak Invoice"

**Verify**:
- [ ] Console log: `[Pembayaran] File detected, uploading: [filename] for [nomor_transaksi]`
- [ ] Console log: `[Pembayaran] File uploaded successfully. URL: https://...`
- [ ] Check IndexedDB → `rincian_pembayaran` → field `bukti_pembayaran_url` HARUS ada URL
- [ ] Check IndexedDB → `file_uploads` → status = `'uploaded'`
- [ ] Check Supabase Storage bucket `bukti-pembayaran` → file ada
- [ ] Di tabel rincian, link "Lihat Bukti" muncul
- [ ] Klik link membuka file dengan benar

**Console Command untuk Verify**:
```javascript
// Check rincian_pembayaran
const rincian = await db.rincian_pembayaran.toArray()
console.table(rincian.map(r => ({
  nomor: r.nomor_transaksi,
  url: r.bukti_pembayaran_url
})))

// Check file_uploads
const files = await db.file_uploads.toArray()
console.table(files.map(f => ({
  name: f.file_name,
  status: f.status,
  url: f.public_url
})))
```

---

### Test 2: Upload File Offline → Online (Critical Test)

**Expected Result**: File disimpan lokal, auto-upload saat online, URL ter-update

**Steps**:
1. **Go Offline**: Chrome DevTools → Network tab → Set to "Offline"
2. Buka `/pembayaran/create`
3. Pilih siswa
4. Klik "Bayar" pada tagihan
5. Upload file (gambar atau PDF)
6. Isi nominal dan klik "Tambahkan"
7. Klik "Proses & Cetak Invoice"

**Verify Offline State**:
- [ ] Console log: `[Pembayaran] File detected, uploading: [filename]`
- [ ] Console log: `[Pembayaran] File stored offline, will upload when online. FileID: [uuid]`
- [ ] Check IndexedDB → `rincian_pembayaran` → `bukti_pembayaran_url` = `null` ✅ (Expected!)
- [ ] Check IndexedDB → `file_uploads` → status = `'pending'`
- [ ] Check IndexedDB → `file_uploads` → `file_data` ada (ArrayBuffer)
- [ ] Link "Lihat Bukti" TIDAK muncul ✅ (Expected!)

**Go Online**:
8. **Go Online**: Chrome DevTools → Network tab → Set to "Online"
9. Tunggu 4-8 detik (sync interval)

**Verify Online Sync**:
- [ ] Console log: `[FileUpload] Processing 1 pending uploads`
- [ ] Console log: `[FileUpload] Successfully uploaded: [filename]`
- [ ] Console log: `[FileUpload] Updating rincian_pembayaran [id] with URL: https://...`
- [ ] Console log: `[FileUpload] Successfully updated rincian_pembayaran with bukti URL`
- [ ] Check IndexedDB → `file_uploads` → status = `'uploaded'`
- [ ] Check IndexedDB → `rincian_pembayaran` → `bukti_pembayaran_url` = `https://...` ✅
- [ ] Check Supabase Storage → file ada
- [ ] Refresh page → Link "Lihat Bukti" muncul
- [ ] Klik link membuka file dengan benar

**Console Command untuk Monitor Sync**:
```javascript
// Watch file upload status
setInterval(async () => {
  const files = await db.file_uploads.toArray()
  const rincian = await db.rincian_pembayaran.toArray()
  console.clear()
  console.log('=== FILE UPLOADS ===')
  console.table(files.map(f => ({
    name: f.file_name,
    status: f.status,
    has_url: !!f.public_url
  })))
  console.log('\n=== RINCIAN PEMBAYARAN ===')
  console.table(rincian.map(r => ({
    nomor: r.nomor_transaksi,
    has_url: !!r.bukti_pembayaran_url
  })))
}, 2000)
```

---

### Test 3: Upload Invalid File

**Expected Result**: Error message muncul, file tidak diproses

**Test Cases**:

#### 3A: File > 5MB
- [ ] Upload file 6MB → Error: "Ukuran file maksimal 5MB"
- [ ] File tidak tersimpan

#### 3B: Invalid Format
- [ ] Upload file .docx → Error: "Format file harus JPG, PNG, WEBP, atau PDF"
- [ ] File tidak tersimpan

#### 3C: No File (Optional)
- [ ] Submit tanpa file → Berhasil
- [ ] `bukti_pembayaran_url` = `null`
- [ ] Console log: `[Pembayaran] No file provided for [nomor_transaksi]`

---

### Test 4: Check Supabase Storage Directly

**Supabase Dashboard**:
1. Buka Supabase Dashboard
2. Storage → Buckets → `bukti-pembayaran`
3. Navigate folder structure: `{year}/{month}/{reference_id}/`
4. Verify file ada dengan nama: `{timestamp}_{original_filename}`

**SQL Query untuk Check**:
```sql
-- Check uploaded files
SELECT 
  name,
  metadata->>'size' as size_bytes,
  created_at,
  updated_at
FROM storage.objects
WHERE bucket_id = 'bukti-pembayaran'
ORDER BY created_at DESC
LIMIT 10;

-- Check rincian_pembayaran with bukti
SELECT 
  nomor_transaksi,
  jumlah_dibayar,
  bukti_pembayaran_url,
  tanggal_bayar
FROM rincian_pembayaran
WHERE bukti_pembayaran_url IS NOT NULL
ORDER BY tanggal_bayar DESC;
```

---

### Test 5: Error Recovery

**Test Scenario**: Upload gagal → Retry mechanism

**Steps**:
1. Buka console
2. Inject error sementara:
```javascript
// Override uploadToStorage untuk simulate error
const originalUpload = window.uploadToStorage
window.uploadToStorage = () => Promise.resolve({ success: false, error: 'Simulated error' })
```
3. Upload file
4. Verify status = 'error' di `file_uploads`
5. Restore function:
```javascript
window.uploadToStorage = originalUpload
```
6. Manual retry:
```javascript
const { processPendingUploads } = await import('./src/lib/fileUploadHelper.js')
await processPendingUploads()
```
7. Verify file berhasil upload

---

## 🔍 Debugging Tips

### Check File Upload Status
```javascript
// Get all file uploads
const files = await db.file_uploads.toArray()
console.log('Total files:', files.length)
console.log('Pending:', files.filter(f => f.status === 'pending').length)
console.log('Uploaded:', files.filter(f => f.status === 'uploaded').length)
console.log('Error:', files.filter(f => f.status === 'error').length)
```

### Check Rincian Pembayaran URLs
```javascript
// Get rincian with/without bukti
const rincian = await db.rincian_pembayaran.toArray()
const withBukti = rincian.filter(r => r.bukti_pembayaran_url)
const withoutBukti = rincian.filter(r => !r.bukti_pembayaran_url)

console.log('Rincian dengan bukti:', withBukti.length)
console.log('Rincian tanpa bukti:', withoutBukti.length)
console.table(withBukti.map(r => ({
  nomor: r.nomor_transaksi,
  url: r.bukti_pembayaran_url
})))
```

### Manual Force Upload
```javascript
// Force process pending uploads NOW
const { processPendingUploads } = await import('./src/lib/fileUploadHelper.js')
await processPendingUploads()
```

### Check Outbox Status
```javascript
// Check if update queued
const outbox = await db.outbox.toArray()
const updateQueue = outbox.filter(o => 
  o.table === 'rincian_pembayaran' && 
  o.op === 'update' &&
  o.payload?.bukti_pembayaran_url
)
console.log('URL updates in queue:', updateQueue.length)
console.table(updateQueue.map(o => ({
  id: o.pk,
  status: o.status,
  url: o.payload.bukti_pembayaran_url
})))
```

---

## 📊 Success Criteria

### ✅ All Tests Must Pass:
- [x] Online upload: File uploaded & URL saved immediately
- [x] Offline upload: File stored locally
- [x] Auto-sync: File uploaded & URL updated when online
- [x] Invalid file: Proper error handling
- [x] No file: Optional flow works
- [x] Link display: "Lihat Bukti" appears correctly
- [x] File access: Link opens file successfully

### ✅ No Console Errors:
- No red errors in console
- All `[Pembayaran]` logs successful
- All `[FileUpload]` logs successful

### ✅ Database Integrity:
- `file_uploads` table has correct status
- `rincian_pembayaran` has URL after sync
- `outbox` processes updates successfully
- Supabase Storage has actual files

---

## 🚨 Known Issues & Workarounds

### Issue: URL tidak update setelah 4 detik
**Cause**: Sync interval belum triggered  
**Solution**: Manual trigger `processPendingUploads()`

### Issue: File tidak muncul di Storage
**Cause**: RLS policy atau bucket settings  
**Solution**: Verify bucket exists & policies correct

### Issue: Link tidak muncul setelah refresh
**Cause**: Cache IndexedDB belum refresh  
**Solution**: Hard refresh (Ctrl+Shift+R) atau clear IndexedDB

---

## 📝 Checklist Sebelum Production

- [ ] Test 1: Online upload ✅
- [ ] Test 2: Offline → Online ✅
- [ ] Test 3: Invalid files ✅
- [ ] Test 4: Supabase Storage verified ✅
- [ ] Test 5: Error recovery ✅
- [ ] No console errors
- [ ] Documentation updated
- [ ] All team members informed

---

**Last Updated**: 2025-01-08  
**Version**: 1.1.0 (Bug Fix)  
**Status**: 🧪 Ready for Testing
