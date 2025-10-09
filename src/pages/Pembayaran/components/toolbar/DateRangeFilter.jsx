import { Select } from '@radix-ui/themes'
import { Calendar } from 'lucide-react'

export function DateRangeFilter({ selectedDateRange, onDateRangeChange }) {
  return (
    <div className="min-w-0 w-full">
      <Select.Root value={selectedDateRange} onValueChange={onDateRangeChange}>
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
          style={{ 
            borderRadius: 0, 
            minWidth: 'var(--radix-select-trigger-width)', 
            width: 'max-content', 
            maxHeight: '300px' 
          }}
          className="bg-white border-2 border-slate-300 shadow-lg"
          position="popper"
          sideOffset={4}
        >
          <Select.Item value="all" className="cursor-pointer hover:bg-slate-100">
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" />
              <span>Semua Waktu</span>
            </span>
          </Select.Item>
          <Select.Item value="today" className="cursor-pointer hover:bg-slate-100">
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" />
              <span>Hari Ini</span>
            </span>
          </Select.Item>
          <Select.Item value="3days" className="cursor-pointer hover:bg-slate-100">
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" />
              <span>3 Hari Terakhir</span>
            </span>
          </Select.Item>
          <Select.Item value="7days" className="cursor-pointer hover:bg-slate-100">
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" />
              <span>7 Hari Terakhir</span>
            </span>
          </Select.Item>
          <Select.Item value="30days" className="cursor-pointer hover:bg-slate-100">
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" />
              <span>30 Hari Terakhir</span>
            </span>
          </Select.Item>
          <Select.Item value="90days" className="cursor-pointer hover:bg-slate-100">
            <span className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 text-purple-600" aria-hidden="true" />
              <span>90 Hari Terakhir</span>
            </span>
          </Select.Item>
        </Select.Content>
      </Select.Root>
    </div>
  )
}
