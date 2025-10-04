import { TextField } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { X } from 'lucide-react'

export function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="flex-1 min-w-[240px] max-w-xs">
      <TextField.Root
        placeholder="Cari nama atau NISN..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="2"
        style={{
          borderRadius: 0,
          border: '1px solid #cbd5e1',
          backgroundColor: '#ffffff'
        }}
        className="font-sans"
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" />
        </TextField.Slot>
        {searchQuery && (
          <TextField.Slot>
            <button
              onClick={() => setSearchQuery('')}
              className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </TextField.Slot>
        )}
      </TextField.Root>
    </div>
  )
}
