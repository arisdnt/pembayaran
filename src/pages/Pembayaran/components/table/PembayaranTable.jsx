import { Text } from '@radix-ui/themes'
import { usePembayaranFilters } from '../../hooks/usePembayaranFilters'
import { PembayaranTableHeader } from './PembayaranTableHeader'
import { PembayaranTableRow } from './PembayaranTableRow'
import { PembayaranEmptyState } from './PembayaranEmptyState'

export function PembayaranTable({ data, isLoading, isRefreshing, onEdit, onDelete, onAdd, onViewDetail, selectedItem, onSelectItem }) {
  const {
    searchQuery,
    setSearchQuery,
    selectedTahunAjaran,
    setSelectedTahunAjaran,
    selectedTingkat,
    setSelectedTingkat,
    tahunAjaranOptions,
    tingkatOptions,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  } = usePembayaranFilters(data)

  const isEmpty = filteredData.length === 0

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col border border-slate-300 bg-white shadow-lg">
        <PembayaranTableHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedTahunAjaran={selectedTahunAjaran}
          onTahunAjaranChange={setSelectedTahunAjaran}
          tahunAjaranOptions={tahunAjaranOptions}
          selectedTingkat={selectedTingkat}
          onTingkatChange={setSelectedTingkat}
          tingkatOptions={tingkatOptions}
          stats={stats}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onAdd={onAdd}
        />

        <div className="flex-1 overflow-auto min-h-0">
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10">
              <tr className="border-b-2 border-slate-300">
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    No. Pembayaran
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Nama Tagihan
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Siswa
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Tahun Ajaran
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Kelas
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Catatan
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Dibuat
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Nominal
                  </Text>
                </th>
                <th className="px-4 py-3 text-center">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Aksi
                  </Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <PembayaranTableRow
                  key={item.id}
                  item={item}
                  index={index}
                  isSelected={selectedItem?.id === item.id}
                  onSelect={onSelectItem}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onViewDetail={onViewDetail}
                />
              ))}
              {isEmpty && (
                <PembayaranEmptyState
                  hasActiveFilters={hasActiveFilters}
                  onClearFilters={handleClearFilters}
                />
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
