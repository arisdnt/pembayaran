import { useEffect } from 'react'
import { Text } from '@radix-ui/themes'
import { Search, X, UserPlus } from 'lucide-react'

export function MultipleSiswaSearchInput({
  searchQuery,
  setSearchQuery,
  isAutocompleteOpen,
  setIsAutocompleteOpen,
  searchedSiswaList,
  onAddSiswa,
  autocompleteRef,
  inputRef
}) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(event.target)) {
        setIsAutocompleteOpen(false)
      }
    }
    if (isAutocompleteOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isAutocompleteOpen, autocompleteRef, setIsAutocompleteOpen])

  const highlightMatch = (text, query) => {
    if (!query.trim()) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return (
      <span>
        {parts.map((part, i) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <mark key={i} className="bg-yellow-200 font-semibold">{part}</mark>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </span>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-1.5 mb-1">
        <UserPlus className="h-3.5 w-3.5 text-green-500" />
        <Text as="div" size="2" weight="medium">
          Tambah Siswa <span className="text-red-600">*</span>
        </Text>
      </div>
      <div ref={autocompleteRef} className="relative">
        <div className="flex items-center gap-2 w-full h-10 px-3 border border-slate-300 bg-white cursor-text hover:border-slate-400 transition-colors">
          <Search className="h-4 w-4 text-slate-400 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsAutocompleteOpen(true)
            }}
            onFocus={() => setIsAutocompleteOpen(true)}
            placeholder="Cari nama atau NISN siswa..."
            className="flex-1 outline-none bg-transparent text-sm"
            autoComplete="off"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('')
                setIsAutocompleteOpen(false)
              }}
              className="flex-shrink-0 p-1 hover:bg-slate-100 rounded transition-colors"
            >
              <X className="h-3.5 w-3.5 text-slate-500 hover:text-slate-700" />
            </button>
          )}
        </div>

        {isAutocompleteOpen && searchedSiswaList.length > 0 && (
          <div className="absolute z-50 w-full mt-1 bg-white border-2 border-slate-300 shadow-xl max-h-60 overflow-auto">
            {searchedSiswaList.map((siswa) => (
              <button
                key={siswa.id}
                type="button"
                onClick={() => onAddSiswa(siswa)}
                className="w-full px-4 py-2.5 text-left hover:bg-blue-50 transition-colors border-b border-slate-200"
              >
                <Text size="2" weight="medium" className="text-slate-900 block truncate">
                  {highlightMatch(siswa.nama_lengkap, searchQuery)}
                </Text>
                {siswa.nisn && (
                  <Text size="1" className="text-slate-500 font-mono">
                    NISN: {highlightMatch(siswa.nisn, searchQuery)}
                  </Text>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      <Text size="1" className="text-slate-500 mt-1 block">
        Ketik untuk mencari dan memilih siswa
      </Text>
    </div>
  )
}
