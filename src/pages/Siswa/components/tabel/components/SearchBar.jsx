import { TextField } from '@radix-ui/themes'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { X } from 'lucide-react'

export function SearchBar({ searchQuery, setSearchQuery }) {
  return (
    <div className="w-full min-w-0">
      <TextField.Root
        placeholder="Cari..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        size="2"
        style={{
          borderRadius: 0,
          border: '1px solid #cbd5e1',
          backgroundColor: '#ffffff',
          height: '36px'
        }}
        className="font-sans w-full"
      >
        <TextField.Slot>
          <MagnifyingGlassIcon height="16" width="16" className="flex-shrink-0" />
        </TextField.Slot>
        {searchQuery && (
          <TextField.Slot>
            <button
              onClick={() => setSearchQuery('')}
              className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </button>
          </TextField.Slot>
        )}
      </TextField.Root>
    </div>
  )
}
