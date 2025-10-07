import { TextField } from '@radix-ui/themes'
import { Search, X } from 'lucide-react'

export function SearchField({ value, onChange, placeholder = "Cari..." }) {
  return (
    <div className="flex-1 min-w-[240px] max-w-xs">
      <TextField.Root
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        size="2"
        style={{
          borderRadius: 0,
          border: '1px solid #cbd5e1',
          backgroundColor: '#ffffff'
        }}
        className="font-sans"
      >
        <TextField.Slot>
          <Search className="h-4 w-4" />
        </TextField.Slot>
        {value && (
          <TextField.Slot>
            <button
              onClick={() => onChange('')}
              className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
              type="button"
            >
              <X className="h-4 w-4" />
            </button>
          </TextField.Slot>
        )}
      </TextField.Root>
    </div>
  )
}
