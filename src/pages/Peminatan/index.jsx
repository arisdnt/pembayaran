import { useEffect, useState } from 'react'
import { PageLayout } from '../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { usePeminatan } from './hooks/usePeminatan'
import { PeminatanTable } from './components/PeminatanTable'
import { PeminatanFormDialog } from './components/PeminatanFormDialog'
import { DeleteConfirmDialog } from '../../components/common/DeleteConfirmDialog'
import { DetailPanel } from './components/DetailPanel'

function PeminatanContent() {
  const {
    data,
    loading,
    isRefreshing,
    error,
    setError,
    deleteItem,
    saveItem,
    toggleAktif,
  } = usePeminatan()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editMode, setEditMode] = useState(false)
  const [currentItem, setCurrentItem] = useState(null)
  const [selectedItem, setSelectedItem] = useState(null)

  useEffect(() => {
    if (!loading && data.length === 0) {
      setSelectedItem(null)
      return
    }

    if (!loading && data.length > 0) {
      if (!selectedItem) {
        setSelectedItem(data[0])
        return
      }

      const updatedSelection = data.find((item) => item.id === selectedItem.id)
      if (updatedSelection && updatedSelection !== selectedItem) {
        setSelectedItem(updatedSelection)
      } else if (!updatedSelection) {
        setSelectedItem(data[0])
      }
    }
  }, [data, loading, selectedItem])

  const handleOpenCreate = () => {
    setEditMode(false)
    setCurrentItem({
      id: '',
      kode: '',
      nama: '',
      keterangan: '',
      tingkat_min: '',
      tingkat_max: '',
      aktif: true,
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
              <Text size="2" className="text-red-600">
                {error}
              </Text>
            </div>
          </div>
        ) : null}

        {/* Layout 2 Kolom: 75% Tabel | 25% Detail */}
        <div className="flex gap-4 flex-1 min-h-0">
          {/* Kolom Kiri: Tabel (75%) */}
          <div className="w-3/4 h-full">
            <PeminatanTable
              data={data}
              isLoading={loading}
              isRefreshing={isRefreshing}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onToggleAktif={toggleAktif}
              onAdd={handleOpenCreate}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
            />
          </div>

          {/* Kolom Kanan: Detail Panel (25%) */}
          <div className="w-1/4 h-full">
            <DetailPanel
              selectedItem={selectedItem}
              isLoading={loading}
              isRefreshing={isRefreshing}
            />
          </div>
        </div>
      </div>

      <PeminatanFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={saveItem}
        initialData={currentItem}
        isEdit={editMode}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        itemName={currentItem?.nama || ''}
        title="Hapus Peminatan"
        description="Apakah Anda yakin ingin menghapus peminatan"
      />
    </PageLayout>
  )
}

export function Peminatan() {
  return <PeminatanContent />
}
