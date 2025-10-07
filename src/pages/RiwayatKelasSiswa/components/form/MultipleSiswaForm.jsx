import { Text } from '@radix-ui/themes'
import { MultipleSiswaSearchInput } from './MultipleSiswaSearchInput'
import { SelectedSiswaTable } from './SelectedSiswaTable'
import { KelasFormFields } from './KelasFormFields'

export function MultipleSiswaForm({
  formData,
  setFormData,
  kelasList,
  tahunAjaranList,
  error,
  selectedSiswaList,
  searchQuery,
  setSearchQuery,
  isAutocompleteOpen,
  setIsAutocompleteOpen,
  searchedSiswaList,
  handleAddSiswa,
  handleRemoveSiswa,
  autocompleteRef,
  inputRef
}) {
  return (
    <div className="p-6 flex-1 flex flex-col overflow-hidden">
      <div className="grid gap-4 flex-1 overflow-hidden" style={{ gridTemplateColumns: '350px 1fr' }}>
        {/* Kolom 1: Data Kelas Tujuan */}
        <div className="border-r-2 border-slate-300 pr-4 space-y-4 flex flex-col overflow-hidden min-w-0">
          <div className="flex-1 overflow-auto space-y-4 px-4">
            <KelasFormFields
              formData={formData}
              setFormData={setFormData}
              kelasList={kelasList}
              tahunAjaranList={tahunAjaranList}
            />

            {error && (
              <div className="border border-red-200 bg-red-50 px-3 py-2">
                <Text size="1" weight="medium" className="text-red-800">
                  {error}
                </Text>
              </div>
            )}
          </div>
        </div>

        {/* Kolom 2: Siswa Terpilih */}
        <div className="flex flex-col overflow-hidden min-h-0 min-w-0">
          <div className="flex-shrink-0 px-4 pb-2">
            <MultipleSiswaSearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isAutocompleteOpen={isAutocompleteOpen}
              setIsAutocompleteOpen={setIsAutocompleteOpen}
              searchedSiswaList={searchedSiswaList}
              onAddSiswa={handleAddSiswa}
              autocompleteRef={autocompleteRef}
              inputRef={inputRef}
            />
          </div>

          <div className="flex-1 overflow-auto border border-slate-300 bg-white min-h-0 mx-4 mb-2">
            <SelectedSiswaTable
              selectedSiswaList={selectedSiswaList}
              onRemoveSiswa={handleRemoveSiswa}
            />
          </div>

          {selectedSiswaList.length > 0 && (
            <div className="border border-blue-200 bg-blue-50 px-3 py-2 mx-4 mt-2 flex-shrink-0">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <Text size="1" weight="medium" className="text-blue-800">
                    <span className="font-bold">{selectedSiswaList.length}</span> siswa akan ditambahkan
                  </Text>
                  {formData.id_kelas && (
                    <Text size="1" className="text-blue-700 block">
                      Kelas: {kelasList.find(k => k.id === formData.id_kelas)?.tingkat} {kelasList.find(k => k.id === formData.id_kelas)?.nama_sub_kelas}
                    </Text>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
