import { Select } from '@radix-ui/themes'
import { BookOpen, GraduationCap, School } from 'lucide-react'

export function FilterControls({
  tahunAjaranList,
  tingkatList,
  filteredKelas,
  selectedTA,
  selectedTingkat,
  selectedKelas,
  onTAChange,
  onTingkatChange,
  onKelasChange,
  columnIndex = 0, // 0=Tahun Ajaran, 1=Tingkat, 2=Kelas
}) {
  // Render dropdown berdasarkan columnIndex
  if (columnIndex === 0) {
    // Filter Tahun Ajaran
    return (
      <div className="min-w-0 w-full">
        <Select.Root value={selectedTA} onValueChange={onTAChange}>
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
            {tahunAjaranList.map((ta) => (
              <Select.Item 
                key={ta.id} 
                value={ta.id}
                className="cursor-pointer hover:bg-slate-100"
              >
                <span className="flex items-center gap-2">
                  <BookOpen className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                  <span>{ta.nama} {ta.status_aktif && '(Aktif)'}</span>
                </span>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
    )
  }

  if (columnIndex === 1) {
    // Filter Tingkat
    return (
      <div className="min-w-0 w-full">
        <Select.Root value={selectedTingkat} onValueChange={onTingkatChange}>
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
            <Select.Item value="_all" className="cursor-pointer hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <GraduationCap className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                <span>Semua Tingkat</span>
              </span>
            </Select.Item>
            {tingkatList.map((t) => (
              <Select.Item 
                key={t} 
                value={t}
                className="cursor-pointer hover:bg-slate-100"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                  <span>Tingkat {t}</span>
                </span>
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Root>
      </div>
    )
  }

  if (columnIndex === 2) {
    // Filter Kelas
    return (
      <div className="min-w-0 w-full">
        <Select.Root value={selectedKelas} onValueChange={onKelasChange}>
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
            <Select.Item value="_all" className="cursor-pointer hover:bg-slate-100">
              <span className="flex items-center gap-2">
                <School className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
                <span>Semua Kelas</span>
              </span>
            </Select.Item>
            {filteredKelas.map((k) => (
              <Select.Item 
                key={k.id} 
                value={k.id}
                className="cursor-pointer hover:bg-slate-100"
              >
                <span className="flex items-center gap-2">
                  <School className="h-3.5 w-3.5 text-green-600" aria-hidden="true" />
                  <span>{k.tingkat} - {k.nama_sub_kelas}</span>
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
