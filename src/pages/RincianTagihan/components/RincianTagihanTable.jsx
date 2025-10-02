import { useRincianTagihanFilters } from '../hooks/useRincianTagihanFilters'
import { RincianTagihanTableHeader } from './RincianTagihanTableHeader'
import { RincianTagihanTableRow } from './RincianTagihanTableRow'
import { RincianTagihanEmptyState } from './RincianTagihanEmptyState'

export function RincianTagihanTable({ data, onEdit, onDelete, onAdd, selectedItem, onSelectItem }) {
  const {
    searchQuery,
    setSearchQuery,
    filteredData,
    stats,
    hasActiveFilters,
    handleClearFilters,
  } = useRincianTagihanFilters(data)

  const isEmpty = filteredData.length === 0

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur">
        <RincianTagihanTableHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          stats={stats}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={handleClearFilters}
          onAdd={onAdd}
        />

        <div className="relative flex-1 min-h-0">
          <div className="h-full overflow-auto">
            <table className="min-w-full table-fixed text-sm">
              <colgroup>{[
                <col key="col-1" style={{ width: '15%' }} />,
                <col key="col-2" style={{ width: '15%' }} />,
                <col key="col-3" style={{ width: '12%' }} />,
                <col key="col-4" style={{ width: '25%' }} />,
                <col key="col-5" style={{ width: '13%' }} />,
                <col key="col-6" style={{ width: '8%' }} />,
                <col key="col-7" style={{ width: '7%' }} />,
              ]}</colgroup>
              <thead>
                <tr className="bg-white/95 backdrop-blur sticky top-0 z-10 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    No. Tagihan
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Jenis Pembayaran
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Jumlah
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Deskripsi
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Dibuat
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Urutan
                  </th>
                  <th className="px-6 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <RincianTagihanTableRow
                    key={item.id}
                    item={item}
                    isSelected={selectedItem?.id === item.id}
                    onSelect={onSelectItem}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
                {isEmpty && (
                  <RincianTagihanEmptyState
                    hasActiveFilters={hasActiveFilters}
                    onClearFilters={handleClearFilters}
                  />
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
