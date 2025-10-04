import { useMemo } from 'react'
import { Select } from '@radix-ui/themes'

export function FilterControls({
  filterStatus,
  setFilterStatus,
  filterTahunAjaran,
  setFilterTahunAjaran,
  filterTingkat,
  setFilterTingkat,
  filterKelas,
  setFilterKelas,
  tahunAjaranOptions,
  tingkatOptions,
  kelasOptions,
}) {
  const filteredKelasOptions = useMemo(() => {
    if (filterTingkat === 'all') return kelasOptions
    return kelasOptions.filter((option) => option.tingkat === filterTingkat)
  }, [kelasOptions, filterTingkat])

  return (
    <>
      {/* Filter Status */}
      <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
        <Select.Trigger 
          style={{ 
            borderRadius: 0, 
            minWidth: '140px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff'
          }}
          className="cursor-pointer font-sans"
        />
        <Select.Content style={{ borderRadius: 0 }}>
          <Select.Item value="all">📋 Semua Status</Select.Item>
          <Select.Item value="active">✅ Aktif</Select.Item>
          <Select.Item value="inactive">⭕ Nonaktif</Select.Item>
        </Select.Content>
      </Select.Root>

      {/* Filter Tahun Ajaran */}
      <Select.Root value={filterTahunAjaran} onValueChange={setFilterTahunAjaran}>
        <Select.Trigger
          style={{
            borderRadius: 0,
            minWidth: '160px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff'
          }}
          className="cursor-pointer font-sans"
        />
        <Select.Content style={{ borderRadius: 0 }}>
          <Select.Item value="all">📅 Semua Tahun Ajaran</Select.Item>
          {tahunAjaranOptions.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {/* Filter Tingkat */}
      <Select.Root value={filterTingkat} onValueChange={setFilterTingkat}>
        <Select.Trigger
          style={{
            borderRadius: 0,
            minWidth: '140px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff'
          }}
          className="cursor-pointer font-sans"
        />
        <Select.Content style={{ borderRadius: 0 }}>
          <Select.Item value="all">🏷️ Semua Tingkat</Select.Item>
          {tingkatOptions.map((option) => (
            <Select.Item key={option} value={option}>
              Tingkat {option}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>

      {/* Filter Kelas */}
      <Select.Root value={filterKelas} onValueChange={setFilterKelas}>
        <Select.Trigger
          style={{
            borderRadius: 0,
            minWidth: '180px',
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff'
          }}
          className="cursor-pointer font-sans"
        />
        <Select.Content style={{ borderRadius: 0 }}>
          <Select.Item value="all">🏫 Semua Kelas</Select.Item>
          {filteredKelasOptions.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </>
  )
}
