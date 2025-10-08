import { useEffect, useState } from 'react'
 
import { PageLayout } from '../../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { useKelas } from '../hooks/useKelas'
import { KelasTable } from '../components/tabel/KelasTable'
import KelasFormDialog from '../components/form/KelasFormDialog'
import { DeleteConfirmDialog } from '../../../components/common/DeleteConfirmDialog'
import { DetailPanel } from '../components/detail/DetailPanel'
import { KelasDetailModal } from '../components/detail/KelasDetailModal'
import { ErrorModal } from '../../../components/modals/ErrorModal'
import { db } from '../../../offline/db'

function KelasContent() {
  const {
    data,
    loading,
    isRefreshing,
    realtimeStatus,
    error,
    setError,
    deleteItem,
    saveItem,
    tahunAjaranOptions,
    selectedYearId,
    setSelectedYearId,
  } = useKelas()

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

      const updatedSelection = data.find((item) => item.id === selectedItem.id)
      if (updatedSelection && updatedSelection !== selectedItem) {
        setSelectedItem(updatedSelection)
      } else if (!updatedSelection) {
        setSelectedItem(data[0])
      }
    }
  }, [data, loading, selectedItem])

  useEffect(() => {
    if (!currentItem) return
    const updated = data.find((item) => item.id === currentItem.id)
    if (updated && updated !== currentItem) {
      setCurrentItem(updated)
    }
  }, [data, currentItem])

  const handleOpenCreate = () => {
    setEditMode(false)
    setCurrentItem({
      id: '',
      tingkat: '',
      nama_sub_kelas: '',
      kapasitas_maksimal: '',
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

  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorModalData, setErrorModalData] = useState({ title: '', message: '', details: '', variant: 'error' })

  const handleOpenDelete = async (item) => {
    setCurrentItem(item)
    // If item has relations, show a friendly error modal instead of opening confirm dialog
    if (item?.has_relasi) {
      // Count related records for clearer message
      let rksCount = 0
      let rwkCount = 0
      try {
        rksCount = await db.riwayat_kelas_siswa.where('id_kelas').equals(item.id).count()
      } catch {}
      try {
        if (db.riwayat_wali_kelas?.where) {
          rwkCount = await db.riwayat_wali_kelas.where('id_kelas').equals(item.id).count()
        }
      } catch {}

      const parts = []
      if (rksCount > 0) parts.push(`${rksCount} riwayat kelas siswa`)
      if (rwkCount > 0) parts.push(`${rwkCount} riwayat wali kelas`)
      const refs = parts.length ? ` (${parts.join(' dan ')})` : ''

      setErrorModalData({
        title: 'Tidak Dapat Menghapus',
        message: 'Kelas ini masih memiliki data terkait',
        details: `Hapus atau pindahkan data terkait${refs} terlebih dahulu sebelum menghapus kelas.`,
        variant: 'error'
      })
      setErrorModalOpen(true)
      return
    }

    setDeleteDialogOpen(true)
  }

  const handleViewDetail = (item) => {
    setCurrentItem(item)
    setDetailModalOpen(true)
  }

  const handleDelete = async () => {
    if (!currentItem) return
    try {
      await deleteItem(currentItem.id)
      setCurrentItem(null)
      // Dialog will be closed by DeleteConfirmDialog on success
    } catch (e) {
      // Close dialog so the error banner is visible
      setDeleteDialogOpen(false)
      setErrorModalData({
        title: 'Tidak Dapat Menghapus',
        message: 'Kelas ini masih memiliki data terkait',
        details: e?.message || 'Pindahkan atau hapus data terkait terlebih dahulu.',
        variant: 'error'
      })
      setErrorModalOpen(true)
    }
  }

  const selectedYearLabel = tahunAjaranOptions.find((item) => item.id === selectedYearId)?.nama || '—'

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
            <KelasTable
              data={data}
              isLoading={loading}
              isRefreshing={isRefreshing}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onViewDetail={handleViewDetail}
              onAdd={handleOpenCreate}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
              tahunAjaranOptions={tahunAjaranOptions}
              selectedYearId={selectedYearId}
              onSelectYear={setSelectedYearId}
            />
          </div>

          {/* Kolom Kanan: Detail Panel (25%) */}
          <div className="w-1/4 h-full">
            <DetailPanel
              selectedItem={selectedItem}
              isLoading={loading}
              isRefreshing={isRefreshing}
              selectedYearLabel={selectedYearLabel}
            />
          </div>
        </div>
      </div>

      <KelasFormDialog
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
        itemName={currentItem ? `${currentItem.tingkat} ${currentItem.nama_sub_kelas}` : ''}
      />

      <KelasDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        kelas={currentItem}
        selectedYearLabel={selectedYearLabel}
      />

      <ErrorModal
        open={errorModalOpen}
        onOpenChange={setErrorModalOpen}
        title={errorModalData.title}
        message={errorModalData.message}
        details={errorModalData.details}
        variant={errorModalData.variant}
      />
      </PageLayout>
  )
}

export function Kelas() {
  return <KelasContent />
}
