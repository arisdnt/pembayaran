import { Select } from '@radix-ui/themes'
import { ListFilter, CheckCircle, CircleSlash, Calendar, GraduationCap } from 'lucide-react'

export function FilterControls({
  filterStatus,
  setFilterStatus,
  filterTahunId,
  setFilterTahunId,
  filterTingkat,
  setFilterTingkat,
  tahunList,
  tingkatList,
  columnIndex = 0, // 0=Status, 1=Tahun Ajaran, 2=Tingkat
}) {
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
        <Select.Root value={filterTahunId} onValueChange={setFilterTahunId}>
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
            {tahunList.map((tahun) => (
              <Select.Item 
                key={tahun.id} 
                value={tahun.id}
                className="cursor-pointer hover:bg-slate-100"
              >
                <span className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-blue-600" aria-hidden="true" />
                  <span>{tahun.nama}</span>
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
            {tingkatList.map((tingkat) => (
              <Select.Item 
                key={tingkat} 
                value={tingkat}
                className="cursor-pointer hover:bg-slate-100"
              >
                <span className="flex items-center gap-2">
                  <GraduationCap className="h-3.5 w-3.5 text-indigo-600" aria-hidden="true" />
                  <span>Tingkat {tingkat}</span>
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
