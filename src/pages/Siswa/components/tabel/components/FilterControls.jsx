import { useMemo } from 'react'
import { Select } from '@radix-ui/themes'
import { Calendar, GraduationCap, Layers, ListFilter, CheckCircle, CircleSlash } from 'lucide-react'

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
  columnIndex = 0, // 0=Status, 1=Tahun Ajaran, 2=Tingkat, 3=Kelas
}) {
  const filteredKelasOptions = useMemo(() => {
    if (filterTingkat === 'all') return kelasOptions
    return kelasOptions.filter((option) => option.tingkat === filterTingkat)
  }, [kelasOptions, filterTingkat])

  // Render dropdown berdasarkan columnIndex
  if (columnIndex === 0) {
    // Filter Status
    return (
      <div className="min-w-0 w-full">
        <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
          <Select.Trigger 
            style={{ 
              borderRadius: 0,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              width: '100%',
              height: '36px'
            }}
            className="cursor-pointer font-sans truncate text-sm px-2"
          />
          <Select.Content 
            style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }}
            className="bg-white border-2 border-slate-300 shadow-lg"
            position="popper"
            sideOffset={4}
          >
            <Select.Item value="all" className="cursor-pointer hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <ListFilter className="h-3.5 w-3.5 text-slate-600" aria-hidden="true" />
                <span>Semua Status</span>
              </span>
            </Select.Item>
            <Select.Item value="active" className="cursor-pointer hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                <span>Aktif</span>
              </span>
            </Select.Item>
            <Select.Item value="inactive" className="cursor-pointer hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <CircleSlash className="h-3.5 w-3.5 text-rose-600" aria-hidden="true" />
                <span>Nonaktif</span>
              </span>
            </Select.Item>
          </Select.Content>
        </Select.Root>
      </div>
    )
  }

  if (columnIndex === 1) {
    // Filter Tahun Ajaran
    return (
      <div className="min-w-0 w-full">
        <Select.Root value={filterTahunAjaran} onValueChange={setFilterTahunAjaran}>
          <Select.Trigger
            style={{
              borderRadius: 0,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              width: '100%',
              height: '36px'
            }}
            className="cursor-pointer font-sans truncate text-sm px-2"
          />
          <Select.Content 
            style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }}
            className="bg-white border-2 border-slate-300 shadow-lg"
            position="popper"
            sideOffset={4}
          >
            <Select.Item value="all" className="cursor-pointer hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <Calendar className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                <span>Semua Tahun Ajaran</span>
              </span>
            </Select.Item>
            {tahunAjaranOptions.map((option) => (
              <Select.Item 
                key={option.value} 
                value={option.value}
                className="cursor-pointer hover:bg-slate-100"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                  <span>{option.label}</span>
                </span>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
    )
  }

  if (columnIndex === 2) {
    // Filter Tingkat
    return (
      <div className="min-w-0 w-full">
        <Select.Root value={filterTingkat} onValueChange={setFilterTingkat}>
          <Select.Trigger
            style={{
              borderRadius: 0,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              width: '100%',
              height: '36px'
            }}
            className="cursor-pointer font-sans truncate text-sm px-2"
          />
          <Select.Content 
            style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }}
            className="bg-white border-2 border-slate-300 shadow-lg"
            position="popper"
            sideOffset={4}
          >
            <Select.Item value="all" className="cursor-pointer hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                <span>Semua Tingkat</span>
              </span>
            </Select.Item>
            {tingkatOptions.map((option) => (
              <Select.Item 
                key={option} 
                value={option}
                className="cursor-pointer hover:bg-slate-100"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                  <span>Tingkat {option}</span>
                </span>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
    )
  }

  if (columnIndex === 3) {
    // Filter Kelas
    return (
      <div className="min-w-0 w-full">
        <Select.Root value={filterKelas} onValueChange={setFilterKelas}>
          <Select.Trigger
            style={{
              borderRadius: 0,
              border: '1px solid #cbd5e1',
              backgroundColor: '#ffffff',
              width: '100%',
              height: '36px'
            }}
            className="cursor-pointer font-sans truncate text-sm px-2"
          />
          <Select.Content 
            style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }}
            className="bg-white border-2 border-slate-300 shadow-lg"
            position="popper"
            sideOffset={4}
          >
            <Select.Item value="all" className="cursor-pointer hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <Layers className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" />
                <span>Semua Kelas</span>
              </span>
            </Select.Item>
            {filteredKelasOptions.map((option) => (
              <Select.Item 
                key={option.value} 
                value={option.value}
                className="cursor-pointer hover:bg-slate-100"
              >
                <span className="flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" />
                  <span>{option.label}</span>
                </span>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
    )
  }

  return null
}
