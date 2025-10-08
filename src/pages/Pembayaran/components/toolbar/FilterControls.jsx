import { Select } from '@radix-ui/themes'
import { Calendar, GraduationCap } from 'lucide-react'

export function FilterControls({
  selectedTahunAjaran,
  onTahunAjaranChange,
  tahunAjaranOptions,
  selectedTingkat,
  onTingkatChange,
  tingkatOptions,
  columnIndex = 0, // 0=Tahun Ajaran, 1=Tingkat
}) {
  // Render dropdown berdasarkan columnIndex
  if (columnIndex === 0) {
    // Filter Tahun Ajaran
    return (
      <div className="min-w-0 w-full">
        <Select.Root value={selectedTahunAjaran} onValueChange={onTahunAjaranChange}>
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
                key={option.id} 
                value={option.id}
                className="cursor-pointer hover:bg-slate-100"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                  <span>{option.nama}</span>
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

  return null
}
