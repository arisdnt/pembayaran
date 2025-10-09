# Button Design Standards untuk Modal Footer

## Standar Warna Button

### 1. **Close/Tutup (Detail/Info Modal)**
- **Warna**: Gray (Neutral)
- **Background**: `#64748b` (slate-500)
- **Border**: `#475569` (slate-600)
- **Text**: White
- **Icon**: `<X />`
- **Use Case**: Menutup modal detail/info tanpa aksi

### 2. **Batal/Cancel**
- **Warna**: Gray (Soft)
- **Variant**: `variant="soft" color="gray"`
- **Border**: `border-slate-300`
- **Text**: Slate
- **Icon**: `<X />`
- **Use Case**: Membatalkan form/aksi

### 3. **Simpan/Save (Create)**
- **Warna**: Green
- **Background**: `#16a34a` (green-600)
- **Border**: `#15803d` (green-700)
- **Text**: White
- **Icon**: Sesuai konteks (UserPlus, Save, dll)
- **Use Case**: Menyimpan data baru

### 4. **Perbarui/Update (Edit)**
- **Warna**: Orange/Amber
- **Background**: `#d97706` (amber-600)
- **Border**: `#b45309` (amber-700)
- **Text**: White
- **Icon**: `<Edit3 />`
- **Use Case**: Mengupdate data existing

### 5. **Hapus/Delete**
- **Warna**: Red
- **Background**: `#dc2626` (red-600)
- **Border**: `#b91c1c` (red-700)
- **Text**: White
- **Icon**: `<AlertTriangle />` atau `<Trash />`
- **Use Case**: Menghapus data (destructive action)

### 6. **Konfirmasi (Danger Action)**
- **Warna**: Red
- **Background**: `#dc2626` (red-600)
- **Border**: `#b91c1c` (red-700)
- **Text**: White
- **Use Case**: Konfirmasi aksi berbahaya

### 7. **Ya/Yes (Confirm)**
- **Warna**: Green
- **Background**: `#16a34a` (green-600)
- **Border**: `#15803d` (green-700)
- **Text**: White
- **Use Case**: Konfirmasi aksi positif

## Template Button

```jsx
// Close/Tutup Button (Detail Modal)
<Button
  size="2"
  onClick={() => onOpenChange(false)}
  style={{
    borderRadius: 0,
    backgroundColor: '#64748b',
    border: '1px solid #475569'
  }}
  className="cursor-pointer text-white shadow-sm hover:shadow flex items-center gap-2"
>
  <X className="h-4 w-4" />
  Tutup
</Button>

// Batal Button
<Button
  size="2"
  type="button"
  variant="soft"
  color="gray"
  disabled={submitting}
  onClick={onCancel}
  style={{ borderRadius: 0 }}
  className="cursor-pointer border border-slate-300 shadow-sm hover:shadow flex items-center gap-2"
>
  <X className="h-4 w-4" />
  Batal
</Button>

// Simpan Button (Create)
<Button
  size="2"
  onClick={onSubmit}
  disabled={submitting}
  style={{
    borderRadius: 0,
    backgroundColor: '#16a34a',
    border: '1px solid #15803d'
  }}
  className="cursor-pointer text-white shadow-sm hover:shadow flex items-center gap-2"
>
  <Save className="h-4 w-4" />
  {submitting ? 'Menyimpan...' : 'Simpan'}
</Button>

// Perbarui Button (Update)
<Button
  size="2"
  onClick={onSubmit}
  disabled={submitting}
  style={{
    borderRadius: 0,
    backgroundColor: '#d97706',
    border: '1px solid #b45309'
  }}
  className="cursor-pointer text-white shadow-sm hover:shadow flex items-center gap-2"
>
  <Edit3 className="h-4 w-4" />
  {submitting ? 'Memperbarui...' : 'Perbarui'}
</Button>

// Hapus Button
<Button
  size="2"
  onClick={handleDelete}
  disabled={submitting}
  style={{
    borderRadius: 0,
    backgroundColor: '#dc2626',
    border: '1px solid #b91c1c'
  }}
  className="cursor-pointer text-white shadow-sm hover:shadow flex items-center gap-2"
>
  <AlertTriangle className="h-4 w-4" />
  {submitting ? 'Menghapus...' : 'Hapus'}
</Button>
```

## Footer Container Standard

```jsx
<div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
  {/* Buttons here */}
</div>
```

## Button Order (Left to Right)
1. Batal/Cancel (gray)
2. Action Button (green/orange/red based on action type)
