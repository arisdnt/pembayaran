import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { usePembayaran } from './hooks/usePembayaran'
import { PembayaranTable } from './components/table/PembayaranTable'
import { DeleteConfirmDialog } from '../../components/common/DeleteConfirmDialog'
import { RingkasanModal } from './components/modals/RingkasanModal'

function PembayaranContent() {
  const navigate = useNavigate()
  const {
    data,
    loading,
    realtimeStatus,
    error,
    deleteItem,
    saveItem,
    isRefreshing,
  } = usePembayaran()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [ringkasanModalOpen, setRingkasanModalOpen] = useState(false)

  const handleOpenCreate = () => {
    navigate('/pembayaran/create')
  }

  const handleOpenRingkasan = () => {
    setRingkasanModalOpen(true)
  }

  const handleOpenEdit = (item) => {
    // Navigate to edit page
    navigate(`/pembayaran/edit/${item.id}`)
  }

  const handleOpenDetail = (item) => {
    // Navigate to detail page
    navigate(`/pembayaran/detail/${item.id}`)
  }

  const handleOpenDelete = (item) => {
    setCurrentItem(item)
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (currentItem) {
      await deleteItem(currentItem.id)
      setCurrentItem(null)
    }
  }

  // Hindari loader layar penuh; render tabel kosong saat memuat

  return (
      <PageLayout>
        <div className="flex flex-col h-full">
        {error ? (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-3 shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <Text size="2" weight="medium" className="text-red-700">
                Terjadi kesalahan
              </Text>
              <Text size="2" className="text-red-600">{error}</Text>
            </div>
          </div>
        ) : null}

        {/* Tabel Full Width */}
        <div className="flex-1 min-h-0">
          <PembayaranTable
            data={data}
            isLoading={loading}
            isRefreshing={isRefreshing}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onAdd={handleOpenCreate}
            onViewDetail={handleOpenDetail}
            onRingkasan={handleOpenRingkasan}
          />
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        itemName={currentItem?.nomor_pembayaran || ''}
        title="Hapus Pembayaran"
        description="Apakah Anda yakin ingin menghapus pembayaran"
      />

      <RingkasanModal
        open={ringkasanModalOpen}
        onOpenChange={setRingkasanModalOpen}
      />
      </PageLayout>
  )
}

export function Pembayaran() {
  return <PembayaranContent />
}
