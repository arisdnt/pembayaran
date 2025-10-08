# Fitur Upload Bukti Pembayaran

## 📋 Overview

Fitur upload bukti pembayaran telah diimplementasikan dengan **FULL SUPPORT OFFLINE-FIRST**. User dapat upload bukti pembayaran (gambar/PDF) baik dalam kondisi online maupun offline.

## 🎯 Fitur Utama

### 1. **Upload File dengan Validasi**
   - Format: JPG, JPEG, PNG, WEBP, PDF
   - Ukuran maksimal: 5MB
   - Preview real-time untuk gambar
   - Validasi otomatis sebelum upload

### 2. **Offline-First Architecture**
   - File disimpan di IndexedDB saat offline
   - Auto-upload saat koneksi kembali online
   - Status tracking (pending → uploading → uploaded → error)
   - Rollback otomatis jika gagal

### 3. **Supabase Storage Integration**
   - Bucket: `bukti-pembayaran`
   - Path structure: `{tahun}/{bulan}/{reference_id}/{timestamp}_{filename}`
   - Public URL untuk akses mudah
   - RLS policies untuk keamanan

## 🏗️ Arsitektur

### Database Schema

#### Tabel `file_uploads` (IndexedDB)
```javascript
{
  id: 'uuid',
  reference_table: 'rincian_pembayaran',
  reference_id: 'nomor_transaksi',
  file_name: 'bukti.jpg',
  file_type: 'image/jpeg',
  file_size: 123456,
  file_data: ArrayBuffer, // Binary data
  storage_path: 'path/in/storage',
  public_url: 'https://...',
  status: 'pending|uploading|uploaded|error',
  error_message: null,
  created_at: '2025-01-08T...',
  uploaded_at: '2025-01-08T...'
}
```

#### Kolom `bukti_pembayaran_url` (Supabase)
Sudah tersedia di tabel `rincian_pembayaran` untuk menyimpan URL public file.

### File Structure

```
src/
├── lib/
│   └── fileUploadHelper.js          # Core utility untuk file upload
├── offline/
│   ├── db.js                        # Dexie schema (updated v6)
│   ├── syncEngine.js                # Sync logic (updated)
│   └── actions/
│       └── pembayaran.js            # Handle file dalam pembayaran
└── pages/
    └── Pembayaran/
        └── components/
            ├── modals/
            │   └── PaymentInputModal.jsx    # Form upload
            └── table/
                └── RincianTransaksiTable.jsx # Display bukti
```

## 🔄 Flow Diagram

### Upload Flow (Online)
```
User selects file
    ↓
Validate file (size, type)
    ↓
Store in IndexedDB (with file blob)
    ↓
Upload to Supabase Storage
    ↓
Get public URL
    ↓
Update IndexedDB status → 'uploaded'
    ↓
Save URL to rincian_pembayaran table
```

### Upload Flow (Offline)
```
User selects file
    ↓
Validate file (size, type)
    ↓
Store in IndexedDB (with file blob)
    ↓
Mark status → 'pending'
    ↓
User continues working offline
    ↓
Connection restored
    ↓
syncEngine.processPendingUploads()
    ↓
Upload to Supabase Storage
    ↓
Update status → 'uploaded'
    ↓
Sync URL to server
```

## 📝 API Reference

### `fileUploadHelper.js`

#### `validateFile(file)`
Validasi file sebelum upload.
```javascript
const validation = validateFile(file)
// Returns: { valid: boolean, error?: string }
```

#### `handleFileUpload(file, referenceTable, referenceId)`
Main function untuk handle upload dengan offline support.
```javascript
const result = await handleFileUpload(file, 'rincian_pembayaran', 'TRX-001')
// Returns: {
//   success: boolean,
//   fileId: string,
//   publicUrl: string | null,
//   storagePath: string | null,
//   localUrl: string,
//   offline?: boolean
// }
```

#### `processPendingUploads()`
Process semua file yang belum terupload (dipanggil oleh syncEngine).
```javascript
await processPendingUploads()
```

#### `getFileUrl(fileId)`
Ambil URL file (public URL jika uploaded, blob URL jika pending).
```javascript
const url = await getFileUrl('file-uuid')
```

#### `deleteFile(fileId)`
Hapus file dari storage dan IndexedDB.
```javascript
await deleteFile('file-uuid')
```

## 🎨 UI Components

### PaymentInputModal
Modal input pembayaran yang sudah dilengkapi dengan:
- File input dengan drag & drop
- Preview gambar real-time
- Info ukuran file
- Button untuk remove file
- Indicator offline/online status

```jsx
<PaymentInputModal
  open={open}
  onOpenChange={setOpen}
  onSubmit={(data) => {
    // data.payment.bukti_file → File object
  }}
  tagihan={tagihan}
  summary={summary}
/>
```

### RincianTransaksiTable
Table rincian yang menampilkan link bukti pembayaran.
```jsx
<RincianTransaksiTable
  items={rincianItems}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

## 🔐 Security & Storage Policies

### Bucket Configuration
```sql
-- Bucket settings
id: 'bukti-pembayaran'
public: true
file_size_limit: 5242880 (5MB)
allowed_mime_types: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf']
```

### RLS Policies
```sql
-- Public can view
CREATE POLICY "Public can view bukti pembayaran"
ON storage.objects FOR SELECT
USING (bucket_id = 'bukti-pembayaran');

-- Anyone can upload
CREATE POLICY "Anyone can upload bukti pembayaran"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'bukti-pembayaran');

-- Anyone can update
CREATE POLICY "Anyone can update bukti pembayaran"
ON storage.objects FOR UPDATE
USING (bucket_id = 'bukti-pembayaran');

-- Anyone can delete
CREATE POLICY "Anyone can delete bukti pembayaran"
ON storage.objects FOR DELETE
USING (bucket_id = 'bukti-pembayaran');
```

## 🧪 Testing Checklist

### Scenario 1: Upload Online
- [ ] Select file dari modal input
- [ ] Preview muncul dengan benar
- [ ] File ter-upload ke Supabase
- [ ] URL tersimpan di database
- [ ] Link "Lihat Bukti" muncul di table
- [ ] Klik link membuka file di tab baru

### Scenario 2: Upload Offline
- [ ] Matikan koneksi internet
- [ ] Select file dari modal input
- [ ] Preview muncul dengan benar
- [ ] File tersimpan di IndexedDB
- [ ] Status "pending" di file_uploads table
- [ ] Submit pembayaran berhasil (tanpa URL)
- [ ] Nyalakan koneksi internet
- [ ] File auto-upload dalam 4 detik
- [ ] URL terupdate di database
- [ ] Link "Lihat Bukti" muncul

### Scenario 3: Large File Rejection
- [ ] Select file > 5MB
- [ ] Error message muncul
- [ ] File tidak ter-submit

### Scenario 4: Invalid Format
- [ ] Select file format tidak supported (misal .doc)
- [ ] Error message muncul
- [ ] File tidak ter-submit

### Scenario 5: Remove File
- [ ] Upload file
- [ ] Klik button X untuk remove
- [ ] Preview hilang
- [ ] File di-clear dari form
- [ ] Submit tanpa file berhasil

## 🚀 Production Deployment

### Pre-deployment Checklist
1. ✅ Bucket `bukti-pembayaran` sudah dibuat
2. ✅ RLS policies sudah di-set
3. ✅ Dexie schema v6 sudah di-deploy
4. ✅ IndexedDB migration otomatis
5. ✅ File upload helper sudah terintegrasi
6. ✅ Sync engine sudah terupdate

### Post-deployment Verification
1. Test upload online di production
2. Test upload offline → online sync
3. Monitor Supabase storage usage
4. Check sync logs untuk error
5. Verify file accessibility (public URL)

## 🔧 Troubleshooting

### Problem: File tidak terupload setelah online
**Solution:**
- Check browser console untuk error
- Verify `processPendingUploads()` dipanggil oleh syncEngine
- Check status file di IndexedDB (`file_uploads` table)
- Retry manual: `await processPendingUploads()`

### Problem: "Gagal mengupload file" error
**Solution:**
- Verify bucket `bukti-pembayaran` exists
- Check RLS policies
- Verify file size < 5MB
- Check file format valid
- Check Supabase storage quota

### Problem: Link bukti tidak muncul
**Solution:**
- Check `bukti_pembayaran_url` kolom di `rincian_pembayaran`
- Verify file status = 'uploaded' di `file_uploads`
- Check URL format valid
- Refresh page untuk reload data

### Problem: Preview tidak muncul
**Solution:**
- Check file type = image (PDF tidak ada preview)
- Verify FileReader API supported
- Check browser console untuk error

## 📊 Monitoring

### Key Metrics to Monitor
1. **Upload Success Rate**: Persentase file berhasil upload
2. **Average Upload Time**: Waktu rata-rata upload
3. **Storage Usage**: Total storage di bucket
4. **Pending Files**: Jumlah file pending upload
5. **Error Rate**: Jumlah upload gagal

### Query untuk Monitoring

#### Check pending uploads
```javascript
// Di browser console
const pending = await db.file_uploads.where('status').equals('pending').toArray()
console.log(`Pending uploads: ${pending.length}`)
```

#### Check error uploads
```javascript
const errors = await db.file_uploads.where('status').equals('error').toArray()
console.table(errors.map(f => ({ 
  name: f.file_name, 
  error: f.error_message 
})))
```

#### Check storage usage (Supabase Dashboard)
```sql
SELECT 
  bucket_id,
  COUNT(*) as file_count,
  SUM(metadata->>'size')::bigint as total_size_bytes,
  ROUND(SUM((metadata->>'size')::bigint) / 1024.0 / 1024.0, 2) as total_size_mb
FROM storage.objects
WHERE bucket_id = 'bukti-pembayaran'
GROUP BY bucket_id;
```

## 📚 References

- [Supabase Storage Documentation](https://supabase.com/docs/guides/storage)
- [Dexie.js Documentation](https://dexie.org/)
- [IndexedDB API](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

---

**Last Updated**: 2025-01-08  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
