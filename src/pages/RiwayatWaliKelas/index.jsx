import { useState, useEffect } from 'react'

import { PageLayout } from '../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { useRiwayatWaliKelas } from './hooks/useRiwayatWaliKelas'
import { RiwayatWaliKelasTable } from './components/RiwayatWaliKelasTable'
import RiwayatWaliKelasFormDialog from './components/RiwayatWaliKelasFormDialog'
import { DeleteConfirmDialog } from '../../components/common/DeleteConfirmDialog'
import { DetailPanel } from './components/DetailPanel'
import { RiwayatWaliKelasDetailModal } from './components/RiwayatWaliKelasDetailModal'

function RiwayatWaliKelasContent() {
  const {
    data,
    loading,
    realtimeStatus,
    error,
    setError,
    deleteItem,
    saveItem,
    waliKelasList,
    kelasList,
    tahunAjaranList,
  } = useRiwayatWaliKelas()

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
      id_wali_kelas: '',
      id_kelas: '',
      id_tahun_ajaran: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      status: 'aktif',
      catatan: '',
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
    setSelectedItem(item)
    setDetailModalOpen(true)
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

        {/* Layout 2 Kolom: 75% Tabel | 25% Detail */}
        <div className="flex gap-3 flex-1 min-h-0">
          {/* Kolom Kiri: Tabel (75%) */}
          <div className="w-3/4 h-full">
            <RiwayatWaliKelasTable
              data={data}
              isLoading={loading}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onAdd={handleOpenCreate}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
              onViewDetail={handleOpenDetail}
              tahunAjaranList={tahunAjaranList}
            />
          </div>

          {/* Kolom Kanan: Detail Panel (25%) */}
          <div className="w-1/4 h-full">
            <DetailPanel
              selectedItem={selectedItem}
              isLoading={loading}
            />
          </div>
        </div>
      </div>

      <RiwayatWaliKelasFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={saveItem}
        initialData={currentItem}
        isEdit={editMode}
        waliKelasList={waliKelasList}
        kelasList={kelasList}
        tahunAjaranList={tahunAjaranList}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        itemName={currentItem?.wali_kelas?.nama_lengkap || currentItem?.id || ''}
        title="Hapus Riwayat Wali Kelas"
        description="Apakah Anda yakin ingin menghapus riwayat penugasan wali kelas"
      />

      <RiwayatWaliKelasDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        riwayat={selectedItem}
      />
      </PageLayout>
  )
}

export function RiwayatWaliKelas() {
  return <RiwayatWaliKelasContent />
}
