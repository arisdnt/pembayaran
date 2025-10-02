import { useState, useEffect, useRef, useMemo } from 'react'
import { Text } from '@radix-ui/themes'
import { User, Search, X, ChevronDown } from 'lucide-react'

export function SiswaAutocomplete({ value, onChange, siswaList, required = false }) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const containerRef = useRef(null)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  const selectedSiswa = useMemo(
    () => siswaList.find((s) => s.id === value),
    [value, siswaList]
  )

  const filteredSiswa = useMemo(() => {
    if (!searchQuery.trim()) return siswaList

    const query = searchQuery.toLowerCase()
    return siswaList.filter((siswa) => {
      const matchName = siswa.nama_lengkap.toLowerCase().includes(query)
      const matchNisn = siswa.nisn && siswa.nisn.toLowerCase().includes(query)
      return matchName || matchNisn
    })
  }, [siswaList, searchQuery])

  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchQuery('')
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (siswa) => {
    onChange(siswa.id)
    setIsOpen(false)
    setSearchQuery('')
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange('')
    setSearchQuery('')
    inputRef.current?.focus()
  }

  const handleInputClick = () => {
    setIsOpen(true)
    inputRef.current?.select()
  }

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text

    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 font-semibold">
              {part}
            </mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    )
  }

  return (
    <div ref={containerRef} className="relative">
      <div
        onClick={handleInputClick}
        className="flex items-center gap-2 w-full h-10 px-3 border border-slate-300 bg-white cursor-text hover:border-slate-400 transition-colors"
        style={{ borderRadius: 0 }}
      >
        <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={isOpen ? searchQuery : (selectedSiswa?.nama_lengkap || '')}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Cari nama atau NISN siswa..."
          className="flex-1 outline-none bg-transparent text-sm"
          autoComplete="off"
        />
        {selectedSiswa && !isOpen ? (
          <button
            type="button"
            onClick={handleClear}
            className="flex-shrink-0 p-1 hover:bg-slate-100 rounded transition-colors"
          >
            <X className="h-3.5 w-3.5 text-slate-500 hover:text-slate-700" />
          </button>
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
        )}
      </div>

      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border-2 border-slate-300 shadow-xl max-h-80 overflow-auto"
          style={{ borderRadius: 0 }}
        >
          {filteredSiswa.length === 0 ? (
            <div className="px-4 py-8 text-center">
              <Search className="h-8 w-8 text-slate-300 mx-auto mb-2" />
              <Text size="2" className="text-slate-500">
                {searchQuery
                  ? 'Tidak ada siswa yang sesuai dengan pencarian'
                  : 'Tidak ada data siswa'}
              </Text>
            </div>
          ) : (
            <div>
              {filteredSiswa.map((siswa, index) => (
                <button
                  key={siswa.id}
                  type="button"
                  onClick={() => handleSelect(siswa)}
                  className={`w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors border-b border-slate-200 ${
                    siswa.id === value ? 'bg-blue-100 border-l-4 border-l-blue-600' : ''
                  } ${index === 0 ? '' : ''}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Text size="2" weight="medium" className="text-slate-900 block truncate">
                        {highlightMatch(siswa.nama_lengkap, searchQuery)}
                      </Text>
                      {siswa.nisn && (
                        <Text size="1" className="text-slate-500 font-mono">
                          NISN: {highlightMatch(siswa.nisn, searchQuery)}
                        </Text>
                      )}
                    </div>
                    {siswa.id === value && (
                      <div className="flex-shrink-0 w-5 h-5 bg-blue-600 flex items-center justify-center">
                        <svg
                          className="w-3 h-3 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        div[ref="dropdownRef"] {
          animation: slideDown 0.15s ease-out;
        }
      `}</style>
    </div>
  )
}
