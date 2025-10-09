import { TextField, Text } from '@radix-ui/themes'
import { Calendar, Hash, School, Users, BookOpen, FileText } from 'lucide-react'
import { SelectField } from './SelectField'

export function EditForm({
  formData,
  tahunAjaranList,
  peminatanList,
  selectedTahunAjaran,
  selectedTingkat,
  selectedKelas,
  tingkatOptions,
  kelasOptions,
  filteredSiswaList,
  onTahunAjaranChange,
  onTingkatChange,
  onKelasChange,
  onFormDataChange,
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-5">
        <SelectField
          icon={Calendar}
          label="1. Tahun Ajaran"
          required
          value={selectedTahunAjaran}
          onChange={onTahunAjaranChange}
          placeholder="Pilih tahun ajaran..."
          options={tahunAjaranList}
          renderOption={(ta) => `${ta.nama} ${ta.status_aktif ? '🟢' : ''}`}
          helpText="Pilih tahun ajaran siswa"
        />

        <SelectField
          icon={Hash}
          label="2. Tingkat"
          required
          value={selectedTingkat}
          onChange={onTingkatChange}
          disabled={!selectedTahunAjaran}
          placeholder={!selectedTahunAjaran ? "Pilih tahun ajaran dulu" : "Pilih tingkat..."}
          options={tingkatOptions}
          renderOption={(tingkat) => `Tingkat ${tingkat}`}
          helpText={!selectedTahunAjaran ? '⚠️ Pilih tahun ajaran terlebih dahulu' : 'Pilih tingkat kelas siswa'}
        />

        <SelectField
          icon={School}
          label="3. Kelas"
          required
          value={selectedKelas}
          onChange={onKelasChange}
          disabled={!selectedTingkat}
          placeholder={!selectedTingkat ? "Pilih tingkat dulu" : "Pilih kelas..."}
          options={kelasOptions}
          renderOption={(kelas) => `Kelas ${kelas.tingkat} ${kelas.nama_sub_kelas}`}
          helpText={!selectedTingkat ? '⚠️ Pilih tingkat terlebih dahulu' : 'Pilih kelas spesifik'}
        />
      </div>

      <div className="space-y-5">
        <SelectField
          icon={Users}
          label="4. Siswa"
          required
          value={formData.id_siswa}
          onChange={(value) => onFormDataChange({ id_siswa: value })}
          disabled={!selectedKelas}
          placeholder={!selectedKelas ? "Pilih kelas dulu" : "Pilih siswa..."}
          options={filteredSiswaList}
          renderOption={(siswa) => `${siswa.nama_lengkap} ${siswa.nisn ? `(${siswa.nisn})` : ''}`}
          helpText={!selectedKelas ? '⚠️ Pilih kelas terlebih dahulu' : `${filteredSiswaList.length} siswa tersedia`}
          emptyText="Tidak ada siswa di kelas ini"
        />

        <SelectField
          icon={BookOpen}
          label="5. Peminatan"
          required
          value={formData.id_peminatan}
          onChange={(value) => onFormDataChange({ id_peminatan: value })}
          placeholder="Pilih peminatan..."
          options={peminatanList}
          renderOption={(peminatan) => `${peminatan.kode} - ${peminatan.nama}`}
          helpText="Pilih peminatan untuk siswa"
        />

        <label>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-3.5 w-3.5 text-orange-500" />
            <Text as="div" size="2" weight="medium">6. Catatan</Text>
          </div>
          <TextField.Root
            placeholder="Catatan tambahan (opsional)"
            value={formData.catatan}
            onChange={(e) => onFormDataChange({ catatan: e.target.value })}
            style={{ borderRadius: 0 }}
          />
        </label>
      </div>
    </div>
  )
}
