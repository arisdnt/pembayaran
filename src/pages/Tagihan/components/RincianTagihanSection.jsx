import { Text, TextField, Badge } from '@radix-ui/themes'
import { ShoppingCart, Search, Plus, Trash2 } from 'lucide-react'

function formatCurrency(value) {
  if (!value) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

export function RincianTagihanSection({
  rincianItems,
  jenisPembayaranList,
  searchTerm,
  onSearchChange,
  showDropdown,
  onSearchFocus,
  onSearchBlur,
  onAddJenis,
  onRemoveRincian,
  onRincianChange,
  filteredJenisPembayaran,
  filterInfo,
  totalTagihan
}) {
  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col flex-1 min-h-0">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-slate-600" />
            <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
              Rincian Tagihan
            </Text>
          </div>
          <div className="flex items-center gap-2">
            <Badge color="blue">{rincianItems.length} item</Badge>
            {jenisPembayaranList.length > 0 && (
              <Badge color="green">{jenisPembayaranList.length} tersedia</Badge>
            )}
          </div>
        </div>
      </div>

      {/* Filter Info */}
      <div className="p-4 pb-0 shrink-0">
        {filterInfo}
      </div>

      {/* Search Bar */}
      <div className="px-4 pt-4 pb-0 shrink-0">
        <div className="relative">
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 z-10" />
            <TextField.Root
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={onSearchFocus}
              onBlur={onSearchBlur}
              placeholder="Cari dan pilih jenis pembayaran untuk ditambahkan..."
              style={{ borderRadius: 0, paddingLeft: '2.5rem' }}
              className="border-slate-300"
            />
            <Plus className="h-4 w-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          </div>

          {showDropdown && (
            <div className="absolute top-full left-0 right-0 bg-white border-2 border-slate-300 border-t-0 max-h-64 overflow-y-auto z-50 shadow-xl">
              {filteredJenisPembayaran.length === 0 ? (
                <div className="p-4 text-center">
                  <Text size="2" className="text-slate-500">Tidak ada jenis pembayaran yang ditemukan</Text>
                </div>
              ) : (
                filteredJenisPembayaran.map(jenis => (
                  <div
                    key={jenis.id}
                    onClick={() => onAddJenis(jenis)}
                    className="p-3 hover:bg-blue-50 cursor-pointer border-b border-slate-200 last:border-b-0"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Badge size="1" color="blue">{jenis.kode}</Badge>
                          <Text size="2" weight="medium">{jenis.nama}</Text>
                        </div>
                        <Text size="1" className="text-slate-500 mt-1">
                          {formatCurrency(jenis.jumlah_default)}
                        </Text>
                      </div>
                      <Plus className="h-4 w-4 text-blue-600" />
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Cart Items */}
      <div className="p-4 flex-1 overflow-y-auto">
        {rincianItems.length === 0 ? (
          <div className="text-center py-12 border-2 border-slate-200 bg-slate-50">
            <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-slate-300" />
            <Text size="3" weight="medium" className="text-slate-600">Keranjang Kosong</Text>
            <Text size="2" className="text-slate-500 mt-1">Gunakan pencarian di atas untuk menambahkan item</Text>
          </div>
        ) : (
          <div className="border-2 border-slate-300">
            <table className="w-full border-collapse">
              <thead className="bg-gradient-to-b from-slate-100 to-slate-50">
                <tr className="border-b-2 border-slate-300">
                  <th className="px-4 py-3 text-left border-r border-slate-200">
                    <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">No</Text>
                  </th>
                  <th className="px-4 py-3 text-left border-r border-slate-200">
                    <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">Kode</Text>
                  </th>
                  <th className="px-4 py-3 text-left border-r border-slate-200">
                    <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">Deskripsi</Text>
                  </th>
                  <th className="px-4 py-3 text-left border-r border-slate-200">
                    <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">Jumlah</Text>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">Aksi</Text>
                  </th>
                </tr>
              </thead>
              <tbody>
                {rincianItems.map((item, idx) => {
                  const jenis = jenisPembayaranList.find(j => j.id === item.id_jenis_pembayaran)
                  return (
                    <tr key={idx} className={`border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                      <td className="px-4 py-3 border-r border-slate-200">
                        <Text size="2" className="text-slate-700">{idx + 1}</Text>
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200">
                        <Badge color="blue">{jenis?.kode || '-'}</Badge>
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200">
                        <TextField.Root
                          value={item.deskripsi}
                          onChange={(e) => onRincianChange(idx, 'deskripsi', e.target.value)}
                          placeholder="Deskripsi item"
                          style={{ borderRadius: 0 }}
                          size="1"
                          className="border-slate-300"
                        />
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200">
                        <TextField.Root
                          type="number"
                          value={item.jumlah}
                          onChange={(e) => onRincianChange(idx, 'jumlah', e.target.value)}
                          placeholder="0"
                          style={{ borderRadius: 0 }}
                          size="1"
                          min="0"
                          step="1000"
                          className="border-slate-300"
                        />
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => onRemoveRincian(idx)}
                          className="h-7 w-7 inline-flex items-center justify-center border border-slate-300 bg-white hover:bg-red-50 hover:border-red-400 transition-colors"
                          type="button"
                        >
                          <Trash2 className="h-3.5 w-3.5 text-slate-600" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Total */}
            <div className="border-t-2 border-slate-300 bg-emerald-50 px-4 py-3">
              <div className="flex items-center justify-between">
                <Text size="3" weight="bold" className="text-emerald-900 uppercase tracking-wider">Total Tagihan</Text>
                <Text size="4" weight="bold" className="text-emerald-700 font-mono">
                  {formatCurrency(totalTagihan)}
                </Text>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
