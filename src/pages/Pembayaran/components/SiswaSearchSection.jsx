import { useState } from 'react'
import { TextField, Text } from '@radix-ui/themes'
import { User } from 'lucide-react'

export function SiswaSearchSection({ siswaList, selectedSiswa, onSelect }) {
  const [query, setQuery] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const suggestions = query
    ? siswaList.filter(s =>
        (s.nama_lengkap || '').toLowerCase().includes(query.toLowerCase()) ||
        (s.nisn || '').toLowerCase().includes(query.toLowerCase())
      ).slice(0, 10)
    : []

  const handleSelect = (siswa) => {
    setQuery(`${siswa.nama_lengkap} • ${siswa.nisn || '-'}`)
    setShowSuggestions(false)
    onSelect(siswa)
  }

  const handleClear = () => {
    setQuery('')
    onSelect(null)
  }

  return (
    <div>
      <label className="flex items-center gap-1.5 mb-2">
        <User className="h-3.5 w-3.5 text-slate-600" />
        <Text size="2" weight="medium" className="text-slate-700">
          Cari Siswa <span className="text-red-500">*</span>
        </Text>
      </label>

      <div className="relative">
        <TextField.Root
          placeholder="Ketik nama atau NISN siswa..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setShowSuggestions(true)
          }}
          onFocus={() => setShowSuggestions(!!query)}
          style={{ borderRadius: 0 }}
        />

        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 px-2"
          >
            ✕
          </button>
        )}

        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-20 bg-white border-2 border-slate-300 w-full max-h-64 overflow-auto shadow-xl mt-1">
            {suggestions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => handleSelect(s)}
                className="w-full text-left px-4 py-2.5 hover:bg-blue-50 border-b border-slate-100 transition-colors"
              >
                <div className="text-slate-800 font-medium">{s.nama_lengkap}</div>
                <div className="text-xs text-slate-500 mt-0.5">
                  NISN: {s.nisn || '-'} • Wali: {s.nama_wali_siswa || '-'}
                </div>
              </button>
            ))}
          </div>
        )}

        {showSuggestions && query && suggestions.length === 0 && (
          <div className="absolute z-20 bg-white border-2 border-slate-300 w-full shadow-xl mt-1">
            <div className="px-4 py-3 text-slate-500 text-sm">
              Tidak ada siswa yang cocok dengan pencarian "{query}"
            </div>
          </div>
        )}
      </div>

      {selectedSiswa && (
        <div className="mt-3 p-3 bg-blue-50 border-2 border-blue-200">
          <Text size="2" className="text-blue-900 font-medium">
            ✓ Siswa dipilih: {selectedSiswa.nama_lengkap}
          </Text>
          <Text size="1" className="text-blue-700 block mt-1">
            NISN: {selectedSiswa.nisn || '-'}
          </Text>
        </div>
      )}
    </div>
  )
}
