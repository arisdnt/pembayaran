import { useEffect, useState } from 'react'

import { PageLayout } from '../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { useSiswa } from './hooks/useSiswa'
import { SiswaTable } from './components/SiswaTable'
import SiswaFormDialog from './components/SiswaFormDialog'
import { DeleteConfirmDialog } from '../../components/common/DeleteConfirmDialog'
import { DetailPanel } from './components/DetailPanel'
import { SiswaDetailModal } from './components/SiswaDetailModal'

function SiswaContent() {
  const {
    data,
    loading,
    isRefreshing,
    realtimeStatus,
    error,
    setError,
    toggleStatus,
    deleteItem,
    saveItem,
  } = useSiswa()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
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

      const found = data.find((item) => item.id === selectedItem.id)
      if (found && found !== selectedItem) {
        setSelectedItem(found)
      } else if (!found) {
        setSelectedItem(data[0])
      }
    }
  }, [data, loading, selectedItem])

  const handleOpenCreate = () => {
    setEditMode(false)
    setCurrentItem({
      id: '',
      nama_lengkap: '',
      nisn: '',
      tanggal_lahir: '',
      jenis_kelamin: '',
      alamat: '',
      nomor_whatsapp_wali: '',
      status_aktif: true,
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

  const handleOpenDetail = (item) => {
    // Navigate to detail page instead of opening modal
    window.location.href = `/siswa/${item.id}`
  }

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
              <Text size="2" className="text-red-600">
                {error}
              </Text>
            </div>
          </div>
        ) : null}

        {/* Tabel Full Width */}
        <div className="flex-1 min-h-0">
          <SiswaTable
            data={data}
            isLoading={loading}
            isRefreshing={isRefreshing}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onToggleStatus={toggleStatus}
            onAdd={handleOpenCreate}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onViewDetail={handleOpenDetail}
          />
        </div>
      </div>

      <SiswaFormDialog
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
        itemName={currentItem?.nama_lengkap || ''}
        title="Hapus Siswa"
        description="Apakah Anda yakin ingin menghapus siswa"
      />

      <SiswaDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        siswa={selectedItem}
      />
      </PageLayout>
  )
}

export function Siswa() {
  return <SiswaContent />
}
