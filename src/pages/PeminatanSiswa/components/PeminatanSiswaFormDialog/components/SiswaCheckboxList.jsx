import { Text, TextField, Button, Checkbox } from '@radix-ui/themes'
import { Users, Search, X } from 'lucide-react'

export function SiswaCheckboxList({
  selectedKelas,
  searchedSiswaList,
  filteredSiswaList,
  selectedSiswaIds,
  searchSiswa,
  siswaWithPeminatan,
  onSearchChange,
  onToggleSiswa,
  onSelectAll,
}) {
  return (
    <div className="border-r-2 border-slate-300 pr-6 flex flex-col">
      <div className="bg-slate-50 border border-slate-300 px-4 py-3 mb-4">
        <div className="flex items-center justify-between">
          <Text size="2" weight="bold" className="text-slate-700">
            Pilih Siswa
          </Text>
          <Text size="1" className="text-slate-600">
            {selectedSiswaIds.length} dipilih
          </Text>
        </div>
      </div>

      <div className="mb-4">
        <TextField.Root
          placeholder="Cari siswa..."
          value={searchSiswa}
          onChange={(e) => onSearchChange(e.target.value)}
          size="2"
          style={{ borderRadius: 0 }}
        >
          <TextField.Slot>
            <Search className="h-4 w-4" />
          </TextField.Slot>
          {searchSiswa && (
            <TextField.Slot>
              <button onClick={() => onSearchChange('')} className="cursor-pointer text-slate-400 hover:text-slate-700" type="button">
                <X className="h-4 w-4" />
              </button>
            </TextField.Slot>
          )}
        </TextField.Root>
      </div>

      {searchedSiswaList.length > 0 && (
        <div className="mb-3">
          <Button
            type="button"
            onClick={onSelectAll}
            variant="soft"
            size="2"
            style={{ borderRadius: 0, width: '100%' }}
            className="cursor-pointer"
          >
            {selectedSiswaIds.length === searchedSiswaList.length ? 'Batal Pilih Semua' : 'Pilih Semua'}
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-auto border border-slate-300 bg-white min-h-0">
        {!selectedKelas ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Users className="h-12 w-12 text-slate-300 mb-2" />
            <Text size="2" className="text-slate-500">
              Pilih kelas untuk melihat daftar siswa
            </Text>
          </div>
        ) : searchedSiswaList.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <Users className="h-12 w-12 text-slate-300 mb-2" />
            <Text size="2" className="text-slate-500">
              {filteredSiswaList.length === 0 ? 'Tidak ada siswa di kelas ini' : 'Tidak ada siswa yang cocok'}
            </Text>
          </div>
        ) : (
          <div className="p-3">
            {searchedSiswaList.map((siswa, index) => {
              const hasPeminatan = siswaWithPeminatan.has(siswa.id)
              return (
                <label
                  key={`${siswa.id}-${index}`}
                  className={`flex items-start gap-3 p-3 mb-2 border transition-colors ${
                    hasPeminatan
                      ? 'bg-orange-50 border-orange-300 cursor-not-allowed opacity-60'
                      : selectedSiswaIds.includes(siswa.id)
                      ? 'bg-blue-50 border-blue-300 cursor-pointer hover:bg-blue-50'
                      : 'bg-white border-slate-200 cursor-pointer hover:bg-blue-50'
                  }`}
                >
                  <Checkbox
                    checked={selectedSiswaIds.includes(siswa.id)}
                    onCheckedChange={() => !hasPeminatan && onToggleSiswa(siswa.id)}
                    disabled={hasPeminatan}
                    style={{ marginTop: '2px' }}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Text size="2" weight="medium" className={hasPeminatan ? 'text-slate-500' : 'text-slate-900'}>
                        {siswa.nama_lengkap}
                      </Text>
                      {hasPeminatan && (
                        <Text size="1" className="text-orange-600 font-medium">
                          (Sudah ada)
                        </Text>
                      )}
                    </div>
                    {siswa.nisn && (
                      <Text size="1" className="text-slate-500 block">
                        NISN: {siswa.nisn}
                      </Text>
                    )}
                  </div>
                </label>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
