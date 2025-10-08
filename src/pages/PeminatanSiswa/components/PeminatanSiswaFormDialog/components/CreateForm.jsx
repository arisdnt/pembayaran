import { Text, TextArea } from '@radix-ui/themes'
import { Calendar, Hash, School, BookOpen, FileText } from 'lucide-react'
import { SiswaCheckboxList } from './SiswaCheckboxList'
import { SelectField } from './SelectField'
import { formatDate } from '../utils/dateFormatters'

export function CreateForm({
  formData,
  tahunAjaranList,
  peminatanList,
  selectedTahunAjaran,
  selectedTingkat,
  selectedKelas,
  tingkatOptions,
  kelasOptions,
  filteredSiswaList,
  searchedSiswaList,
  selectedSiswaIds,
  searchSiswa,
  siswaWithPeminatan,
  onTahunAjaranChange,
  onTingkatChange,
  onKelasChange,
  onFormDataChange,
  onSearchChange,
  onToggleSiswa,
  onSelectAll,
}) {
  return (
    <div className="grid grid-cols-3 gap-6" style={{ height: 'calc(90vh - 280px)' }}>
      <div className="border-r-2 border-slate-300 pr-6 space-y-5">
        <div className="bg-slate-50 border border-slate-300 px-4 py-3 mb-5">
          <Text size="2" weight="bold" className="text-slate-700">
            Filter Siswa
          </Text>
        </div>

        <SelectField
          icon={Calendar}
          label="Tahun Ajaran"
          required
          value={selectedTahunAjaran}
          onChange={onTahunAjaranChange}
          placeholder="Pilih tahun ajaran..."
          options={tahunAjaranList}
          renderOption={(ta) => `${ta.nama} ${ta.status_aktif ? '🟢' : ''}`}
        />

        <SelectField
          icon={Hash}
          label="Tingkat"
          required
          value={selectedTingkat}
          onChange={onTingkatChange}
          disabled={!selectedTahunAjaran}
          placeholder={!selectedTahunAjaran ? "Pilih tahun ajaran dulu" : "Pilih tingkat..."}
          options={tingkatOptions}
          renderOption={(tingkat) => `Tingkat ${tingkat}`}
        />

        <SelectField
          icon={School}
          label="Kelas"
          required
          value={selectedKelas}
          onChange={onKelasChange}
          disabled={!selectedTingkat}
          placeholder={!selectedTingkat ? "Pilih tingkat dulu" : "Pilih kelas..."}
          options={kelasOptions}
          renderOption={(kelas) => `Kelas ${kelas.tingkat} ${kelas.nama_sub_kelas}`}
        />
      </div>

      <SiswaCheckboxList
        selectedKelas={selectedKelas}
        searchedSiswaList={searchedSiswaList}
        filteredSiswaList={filteredSiswaList}
        selectedSiswaIds={selectedSiswaIds}
        searchSiswa={searchSiswa}
        siswaWithPeminatan={siswaWithPeminatan}
        onSearchChange={onSearchChange}
        onToggleSiswa={onToggleSiswa}
        onSelectAll={onSelectAll}
      />

      <div className="space-y-5">
        <div className="bg-slate-50 border border-slate-300 px-4 py-3 mb-5">
          <Text size="2" weight="bold" className="text-slate-700">
            Data Peminatan
          </Text>
        </div>

        <SelectField
          icon={BookOpen}
          label="Peminatan"
          required
          value={formData.id_peminatan}
          onChange={(value) => onFormDataChange({ id_peminatan: value })}
          placeholder="Pilih peminatan..."
          options={peminatanList}
          renderOption={(peminatan) => `${peminatan.kode} - ${peminatan.nama}`}
          helpText="Pilih peminatan untuk siswa yang dipilih"
        />

        <label>
          <div className="flex items-center gap-2 mb-3">
            <FileText className="h-3.5 w-3.5 text-purple-500" />
            <Text as="div" size="2" weight="medium">
              Catatan
            </Text>
          </div>
          <TextArea
            placeholder="Catatan tambahan (opsional)"
            value={formData.catatan}
            onChange={(e) => onFormDataChange({ catatan: e.target.value })}
            style={{ borderRadius: 0, minHeight: '120px' }}
          />
          <Text size="1" className="text-slate-500 mt-2.5 block">
            Catatan akan diterapkan ke semua siswa yang dipilih
          </Text>
        </label>

        {selectedTahunAjaran && formData.tanggal_mulai && (
          <div className="border border-blue-200 bg-blue-50 px-4 py-3">
            <Text size="1" weight="medium" className="text-blue-800 mb-1.5 block">
              Tanggal Peminatan (Otomatis)
            </Text>
            <Text size="1" className="text-blue-700 block">
              Mulai: {formatDate(formData.tanggal_mulai)}
            </Text>
            {formData.tanggal_selesai && (
              <Text size="1" className="text-blue-700 block">
                Selesai: {formatDate(formData.tanggal_selesai)}
              </Text>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
