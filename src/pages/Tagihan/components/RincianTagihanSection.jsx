import { Text, Badge, Button } from '@radix-ui/themes'
import { ShoppingCart, Plus, Trash2, Edit } from 'lucide-react'
import { AddRincianModal } from './AddRincianModal'
import { EditRincianModal } from './EditRincianModal'
import { useState } from 'react'

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
  onAddItem,
  onRemoveRincian,
  onEditItem,
  filterInfo,
  totalTagihan
}) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)

  const handleEditItem = (index, item) => {
    setEditingItem({ ...item, index })
    setShowEditModal(true)
  }

  const handleUpdateItem = (updatedItem) => {
    if (onEditItem && editingItem) {
      onEditItem(editingItem.index, updatedItem)
    }
    setEditingItem(null)
  }
  return (
    <div className="flex flex-col">
      {/* Filter Info */}
      <div className="mb-4 shrink-0">
        {filterInfo}
      </div>

      {/* Unified Table Structure with Fixed Height */}
      <div className="border-2 border-slate-300 bg-white shadow-lg h-96 flex flex-col">
        {/* Fixed Header Section */}
        <div className="shrink-0">
          {/* Title Header */}
          <div className="bg-gradient-to-b from-slate-100 to-slate-50 border-b-2 border-slate-300 px-4 py-3">
            <div className="flex items-center justify-between w-full">
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
                <button
                  onClick={() => setShowAddModal(true)}
                  disabled={jenisPembayaranList.length === 0}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                  type="button"
                >
                  <Plus className="h-4 w-4" />
                  <Text size="2" weight="medium" className="text-white">
                    Tambah Item
                  </Text>
                </button>
              </div>
            </div>
          </div>

          {/* Column Headers - Only show when there's data */}
          {rincianItems.length > 0 && (
            <div className="bg-gradient-to-b from-slate-100 to-slate-50 border-b-2 border-slate-300">
              <table className="w-full border-collapse table-fixed">
                <colgroup>
                  <col style={{width: '8%'}} />   {/* No */}
                  <col style={{width: '15%'}} />  {/* Kode */}
                  <col style={{width: '45%'}} />  {/* Deskripsi */}
                  <col style={{width: '20%'}} />  {/* Jumlah */}
                  <col style={{width: '12%'}} />  {/* Aksi */}
                </colgroup>
                <thead>
                  <tr>
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
              </table>
            </div>
          )}
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          {rincianItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 mx-auto mb-4 text-slate-300" />
              <Text size="3" weight="medium" className="text-slate-600 block">Belum Ada Item Tagihan</Text>
              <Text size="2" className="text-slate-500 mt-1 block">Klik tombol "Tambah Item" untuk menambahkan item tagihan</Text>
            </div>
          ) : (
            <table className="w-full border-collapse table-fixed">
              <colgroup>
                <col style={{width: '8%'}} />   {/* No */}
                <col style={{width: '15%'}} />  {/* Kode */}
                <col style={{width: '45%'}} />  {/* Deskripsi */}
                <col style={{width: '20%'}} />  {/* Jumlah */}
                <col style={{width: '12%'}} />  {/* Aksi */}
              </colgroup>
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
                        <Text size="2" className="text-slate-700">{item.deskripsi || '-'}</Text>
                      </td>
                      <td className="px-4 py-3 border-r border-slate-200">
                        <Text size="2" weight="medium" className="text-slate-900 font-mono">
                          {formatCurrency(item.jumlah)}
                        </Text>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => handleEditItem(idx, item)}
                            className="h-7 w-7 inline-flex items-center justify-center border border-slate-300 bg-white hover:bg-blue-50 hover:border-blue-400 transition-colors"
                            type="button"
                            title="Edit item"
                          >
                            <Edit className="h-3.5 w-3.5 text-slate-600" />
                          </button>
                          <button
                            onClick={() => onRemoveRincian(idx)}
                            className="h-7 w-7 inline-flex items-center justify-center border border-slate-300 bg-white hover:bg-red-50 hover:border-red-400 transition-colors"
                            type="button"
                            title="Hapus item"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-slate-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Total Footer */}
        {rincianItems.length > 0 && (
          <div className="border-t-2 border-slate-300 bg-emerald-50 px-4 py-3 shrink-0">
            <div className="flex items-center justify-between">
              <Text size="3" weight="bold" className="text-emerald-900 uppercase tracking-wider">Total Tagihan</Text>
              <Text size="4" weight="bold" className="text-emerald-700 font-mono">
                {formatCurrency(totalTagihan)}
              </Text>
            </div>
          </div>
        )}
      </div>

      {/* Add Item Modal */}
      <AddRincianModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        jenisPembayaranList={jenisPembayaranList}
        onAddItem={onAddItem}
        existingItems={rincianItems}
      />

      {/* Edit Item Modal */}
      <EditRincianModal
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open)
          if (!open) setEditingItem(null)
        }}
        item={editingItem}
        jenisPembayaranList={jenisPembayaranList}
        onUpdateItem={handleUpdateItem}
      />
    </div>
  )
}
