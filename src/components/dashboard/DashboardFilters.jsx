import { Text, Select } from '@radix-ui/themes'
import { Calendar, GraduationCap, BookOpen, Filter } from 'lucide-react'

const TIME_RANGES = [
  { value: 'today', label: 'Hari Ini' },
  { value: 'week', label: '7 Hari Terakhir' },
  { value: 'month', label: '30 Hari Terakhir' },
  { value: 'quarter', label: '3 Bulan Terakhir' },
  { value: 'semester', label: '6 Bulan Terakhir' },
  { value: 'year', label: 'Tahun Ini' },
  { value: 'all', label: 'Semua Waktu' }
]

export function DashboardFilters({
  tahunAjaranList,
  kelasList,
  tingkatList,
  selectedTahunAjaran,
  onTahunAjaranChange,
  selectedTingkat,
  onTingkatChange,
  selectedKelas,
  onKelasChange,
  selectedTimeRange,
  onTimeRangeChange
}) {
  console.log('DashboardFilters render:', {
    tahunAjaranList: tahunAjaranList?.length,
    kelasList: kelasList?.length,
    tingkatList: tingkatList?.length,
    selectedTahunAjaran,
    selectedTingkat,
    selectedKelas,
    selectedTimeRange
  })

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-slate-600" />
        <Text size="2" weight="medium" className="text-slate-700">
          Filter:
        </Text>
      </div>

      {/* Tahun Ajaran */}
      <div className="flex items-center gap-2">
        <BookOpen className="h-3.5 w-3.5 text-blue-500" />
        <Select.Root
          value={selectedTahunAjaran || undefined}
          onValueChange={(value) => onTahunAjaranChange(value === '__all__' ? '' : value)}
        >
          <Select.Trigger style={{ borderRadius: 0, width: '200px' }} placeholder="Tahun Ajaran" />
          <Select.Content style={{ borderRadius: 0 }}>
            <Select.Item value="__all__">Semua Tahun Ajaran</Select.Item>
            {tahunAjaranList.map(ta => (
              <Select.Item key={ta.id} value={ta.id}>
                {ta.nama} {ta.status_aktif && '(Aktif)'}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      {/* Tingkat */}
      <div className="flex items-center gap-2">
        <GraduationCap className="h-3.5 w-3.5 text-indigo-500" />
        <Select.Root
          value={selectedTingkat || undefined}
          onValueChange={(value) => onTingkatChange(value === '__all__' ? '' : value)}
          disabled={!selectedTahunAjaran}
        >
          <Select.Trigger
            style={{ borderRadius: 0, width: '150px' }}
            placeholder={selectedTahunAjaran ? "Tingkat" : "Pilih tahun ajaran"}
          />
          <Select.Content style={{ borderRadius: 0 }}>
            <Select.Item value="__all__">Semua Tingkat</Select.Item>
            {tingkatList.map(t => (
              <Select.Item key={t} value={t}>Tingkat {t}</Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>

      {/* Kelas */}
      <div className="flex items-center gap-2">
        <GraduationCap className="h-3.5 w-3.5 text-purple-500" />
        <Select.Root
          value={selectedKelas || undefined}
          onValueChange={(value) => onKelasChange(value === '__all__' ? '' : value)}
          disabled={!selectedTingkat}
        >
          <Select.Trigger
            style={{ borderRadius: 0, width: '150px' }}
            placeholder={selectedTingkat ? "Kelas" : "Pilih tingkat"}
          />
          <Select.Content style={{ borderRadius: 0 }}>
            <Select.Item value="__all__">Semua Kelas</Select.Item>
            {kelasList
              .filter(k => !selectedTingkat || k.tingkat === selectedTingkat)
              .map(k => (
                <Select.Item key={k.id} value={k.id}>
                  {k.tingkat} {k.nama_sub_kelas}
                </Select.Item>
              ))}
          </Select.Content>
        </Select.Root>
      </div>

      {/* Time Range */}
      <div className="flex items-center gap-2 border-l border-slate-300 pl-3 ml-3">
        <Calendar className="h-3.5 w-3.5 text-green-500" />
        <Select.Root value={selectedTimeRange} onValueChange={onTimeRangeChange}>
          <Select.Trigger style={{ borderRadius: 0, width: '180px' }} placeholder="Periode Waktu" />
          <Select.Content style={{ borderRadius: 0 }}>
            {TIME_RANGES.map(range => (
              <Select.Item key={range.value} value={range.value}>
                {range.label}
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
    </div>
  )
}
