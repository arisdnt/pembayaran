import { TextField, Text, Select, Switch } from '@radix-ui/themes'
import { Tag, FileText, DollarSign, Calendar, GraduationCap, School, BookOpen } from 'lucide-react'

export function JenisPembayaranFormFields({ 
  formData, 
  setFormData, 
  tahunAjaranList,
  tingkatList,
  filteredKelasList,
  filteredPeminatanList 
}) {
  // Format number dengan pemisah ribuan
  const formatNumber = (value) => {
    if (!value) return ''
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  // Parse number dari format ribuan
  const parseNumber = (value) => {
    return value.replace(/\./g, '')
  }

  const handleJumlahChange = (e) => {
    const rawValue = parseNumber(e.target.value)
    // Hanya izinkan angka
    if (rawValue === '' || /^\d+$/.test(rawValue)) {
      setFormData({ ...formData, jumlah_default: rawValue })
    }
  }
  return (
    <>
      <div className="grid grid-cols-2 gap-4 mb-5">
        {/* Kolom Kiri: Nama + Deskripsi */}
        <div className="flex flex-col gap-5">
          <label>
            <div className="flex items-center gap-1.5 mb-2">
              <Tag className="h-4 w-4 text-indigo-500" />
              <Text size="2" weight="medium">Nama <span className="text-red-600">*</span></Text>
            </div>
            <TextField.Root
              placeholder="Nama jenis pembayaran"
              value={formData.nama}
              onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              style={{ borderRadius: 0 }}
              required
            />
            <Text size="1" className="text-slate-500 mt-1.5">Kode akan digenerate otomatis berdasarkan nama dan tanggal</Text>
          </label>

          <label>
            <div className="flex items-center gap-1.5 mb-2">
              <FileText className="h-4 w-4 text-slate-500" />
              <Text size="2" weight="medium">Deskripsi</Text>
            </div>
            <TextField.Root
              placeholder="Keterangan tambahan..."
              value={formData.deskripsi}
              onChange={(e) => setFormData({ ...formData, deskripsi: e.target.value })}
              style={{ borderRadius: 0 }}
            />
          </label>
        </div>

        {/* Kolom Kanan: Jumlah Default */}
        <div className="flex flex-col justify-end">
          <label>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5">
                <DollarSign className="h-4 w-4 text-green-500" />
                <Text size="2" weight="medium">Jumlah Default</Text>
              </div>
              <Text size="1" className="text-slate-500">Jumlah dalam Rupiah</Text>
            </div>
            <div className="relative flex items-center border border-slate-300 focus-within:border-blue-500 transition-colors" style={{ backgroundColor: '#48B3AF' }}>
              <span className="pl-4 pr-2 font-bold text-white" style={{ fontSize: '1.25rem' }}>Rp.</span>
              <input
                type="text"
                placeholder="0"
                value={formatNumber(formData.jumlah_default)}
                onChange={handleJumlahChange}
                className="flex-1 py-3 pr-4 border-0 focus:outline-none text-right font-bold text-white placeholder-white placeholder-opacity-50"
                style={{ 
                  borderRadius: 0,
                  fontSize: '1.25rem',
                  backgroundColor: 'transparent'
                }}
              />
            </div>
          </label>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <label>
          <div className="flex items-center gap-1.5 mb-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <Text size="2" weight="medium">Tahun Ajaran <span className="text-red-600">*</span></Text>
          </div>
          <Select.Root
            value={formData.id_tahun_ajaran}
            onValueChange={(value) => {
              setFormData({ ...formData, id_tahun_ajaran: value, tingkat: '', id_kelas: '', id_peminatan: '' })
            }}
            required
          >
            <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder="Pilih tahun ajaran" />
            <Select.Content style={{ borderRadius: 0 }}>
              {tahunAjaranList.map((tahun) => (
                <Select.Item key={tahun.id} value={tahun.id}>
                  {tahun.nama} {tahun.status_aktif && '(Aktif)'}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Text size="1" className="text-slate-500 mt-1.5">Wajib dipilih untuk isolasi data per tahun ajaran</Text>
        </label>

        <label>
          <div className="flex items-center gap-1.5 mb-2">
            <GraduationCap className="h-4 w-4 text-indigo-500" />
            <Text size="2" weight="medium">Tingkat Kelas <span className="text-red-600">*</span></Text>
          </div>
          <Select.Root
            value={formData.tingkat || 'all'}
            onValueChange={(value) => {
              const newTingkat = value === 'all' ? '' : value
              setFormData({ ...formData, tingkat: newTingkat, id_kelas: '', id_peminatan: '' })
            }}
            disabled={!formData.id_tahun_ajaran}
            required
          >
            <Select.Trigger
              style={{ borderRadius: 0, width: '100%' }}
              placeholder={!formData.id_tahun_ajaran ? "Pilih tahun ajaran dulu" : "Pilih tingkat"}
            />
            <Select.Content style={{ borderRadius: 0 }}>
              <Select.Item value="all">Semua Tingkat</Select.Item>
              {tingkatList.map((tingkat) => (
                <Select.Item key={tingkat} value={tingkat}>
                  Kelas {tingkat}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Text size="1" className="text-slate-500 mt-1.5">
            {!formData.id_tahun_ajaran ? '⚠️ Pilih tahun ajaran terlebih dahulu' : 'Pilih tingkat atau semua tingkat'}
          </Text>
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <label>
          <div className="flex items-center gap-1.5 mb-2">
            <School className="h-4 w-4 text-teal-500" />
            <Text size="2" weight="medium">Kelas Spesifik</Text>
          </div>
          <Select.Root
            value={formData.id_kelas || 'all'}
            onValueChange={(value) => setFormData({ ...formData, id_kelas: value === 'all' ? '' : value, id_peminatan: '' })}
            disabled={!formData.tingkat}
          >
            <Select.Trigger
              style={{ borderRadius: 0, width: '100%' }}
              placeholder={!formData.tingkat ? "Pilih tingkat dulu" : "Semua kelas"}
            />
            <Select.Content style={{ borderRadius: 0 }}>
              <Select.Item value="all">Semua Kelas Spesifik</Select.Item>
              {filteredKelasList.map((kelas) => (
                <Select.Item key={kelas.id} value={kelas.id}>
                  Kelas {kelas.tingkat} {kelas.nama_sub_kelas}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Text size="1" className="text-slate-500 mt-1.5">
            {!formData.tingkat ? '⚠️ Pilih "Semua Tingkat" tidak dapat memilih kelas spesifik' : 'Pilih kelas atau semua kelas'}
          </Text>
        </label>

        <label>
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className="h-4 w-4 text-orange-500" />
            <Text size="2" weight="medium">Peminatan</Text>
          </div>
          <Select.Root
            value={formData.id_peminatan || 'all'}
            onValueChange={(value) => setFormData({ ...formData, id_peminatan: value === 'all' ? '' : value })}
            disabled={!formData.tingkat}
          >
            <Select.Trigger
              style={{ borderRadius: 0, width: '100%' }}
              placeholder={!formData.tingkat ? "Pilih tingkat dulu" : "Semua peminatan"}
            />
            <Select.Content style={{ borderRadius: 0 }}>
              <Select.Item value="all">Semua Peminatan</Select.Item>
              {filteredPeminatanList && filteredPeminatanList.map((peminatan) => (
                <Select.Item key={peminatan.id} value={peminatan.id}>
                  {peminatan.kode} - {peminatan.nama}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>
          <Text size="1" className="text-slate-500 mt-1.5">
            {!formData.tingkat ? '⚠️ Pilih tingkat kelas terlebih dahulu' : 'Peminatan berlaku untuk seluruh tingkat kelas'}
          </Text>
        </label>
      </div>

      <div className="border-t-2 border-slate-200 pt-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-300 p-3">
            <Switch
              checked={formData.wajib}
              onCheckedChange={(checked) => setFormData({ ...formData, wajib: checked })}
              size="2"
            />
            <div className="flex-1">
              <Text size="2" weight="medium" className="text-slate-900">
                {formData.wajib ? 'Pembayaran Wajib' : 'Pembayaran Opsional'}
              </Text>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-slate-50 border border-slate-300 p-3">
            <Switch
              checked={formData.status_aktif}
              onCheckedChange={(checked) => setFormData({ ...formData, status_aktif: checked })}
              size="2"
            />
            <div className="flex-1">
              <Text size="2" weight="medium" className="text-slate-900">
                {formData.status_aktif ? 'Status Aktif' : 'Status Nonaktif'}
              </Text>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
