import { useState } from 'react'
 
import { PageLayout } from '../../layout/PageLayout'
import { Loader } from '../../components/Loader'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { useRincianTagihan } from './hooks/useRincianTagihan'
import { RincianTagihanTable } from './components/RincianTagihanTable'
import RincianTagihanFormDialog from './components/RincianTagihanFormDialog'
import { DeleteConfirmDialog } from './components/DeleteConfirmDialog'
import { DetailPanel } from './components/DetailPanel'

function RincianTagihanContent() {
  const {
    data,
    loading,
    realtimeStatus,
    error,
    setError,
    deleteItem,
    saveItem,
    tagihanList,
    jenisPembayaranList,
  } = useRincianTagihan()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  const handleOpenCreate = () => {
    setEditMode(false)
    setCurrentItem({
      id: '',
      id_tagihan: undefined,
      id_jenis_pembayaran: undefined,
      deskripsi: '',
      jumlah: '',
      urutan: 1,
    })
    setError('')
    setDialogOpen(true)
  }

  const handleOpenEdit = (item) => {
    setEditMode(true)
    setCurrentItem(item)
    setError('')
    setDialogOpen(true)
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

  // Hindari loader layar penuh

  return (
    <PageLayout>
      <div className="flex flex-col h-full">
        {error ? (
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 mb-4 shrink-0">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <Text size="2" weight="medium" className="text-red-700">
                Terjadi kesalahan
              </Text>
              <Text size="2" className="text-red-600">{error}</Text>
            </div>
          </div>
        ) : null}

        <div className="flex gap-4 flex-1 min-h-0">
          <div className="w-3/4 h-full">
            <RincianTagihanTable
              data={data}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onAdd={handleOpenCreate}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
            />
          </div>

          <div className="w-1/4 h-full">
            <DetailPanel selectedItem={selectedItem} />
          </div>
        </div>
      </div>

      <RincianTagihanFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={saveItem}
        initialData={currentItem}
        isEdit={editMode}
        tagihanList={tagihanList}
        jenisPembayaranList={jenisPembayaranList}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
      />
    </PageLayout>
  )
}

export function RincianTagihan() {
  return <RincianTagihanContent />
}
