import { useEffect, useState } from 'react'

import { PageLayout } from '../../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { useTahunAjaran } from '../hooks/useTahunAjaran'
import { TahunAjaranTable } from '../components/tabel/TahunAjaranTable'
import TahunAjaranFormDialog from '../components/form/TahunAjaranFormDialog'
import { DeleteConfirmDialog } from '../../../components/common/DeleteConfirmDialog'
import { DetailPanel } from '../components/detail/DetailPanel'
import { TahunAjaranDetailModal } from '../components/detail/TahunAjaranDetailModal'
import { ErrorModal } from '../../../components/modals/ErrorModal'
import { db } from '../../../offline/db'

function TahunAjaranContent() {
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
  } = useTahunAjaran()

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
      nama: '',
      tanggal_mulai: '',
      tanggal_selesai: '',
      status_aktif: false,
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
    if (item?.has_relasi) {
      let cRks = 0, cRwk = 0, cJp = 0, cPem = 0
      try { cRks = await db.riwayat_kelas_siswa.where('id_tahun_ajaran').equals(item.id).count() } catch {}
      try { cRwk = await db.riwayat_wali_kelas.where('id_tahun_ajaran').equals(item.id).count() } catch {}
      try { cJp = await db.jenis_pembayaran.where('id_tahun_ajaran').equals(item.id).count() } catch {}
      try { cPem = await db.peminatan_siswa.where('id_tahun_ajaran').equals(item.id).count() } catch {}

      const parts = []
      if (cRks) parts.push(`${cRks} riwayat kelas siswa`)
      if (cRwk) parts.push(`${cRwk} riwayat wali kelas`)
      if (cJp) parts.push(`${cJp} jenis pembayaran`)
      if (cPem) parts.push(`${cPem} peminatan siswa`)
      const refs = parts.length ? ` (${parts.join(' dan ')})` : ''

      setErrorModalData({
        title: 'Tidak Dapat Menghapus',
        message: 'Tahun ajaran ini masih memiliki data terkait',
        details: `Hapus atau pindahkan data terkait${refs} terlebih dahulu sebelum menghapus tahun ajaran.`,
        variant: 'error'
      })
      setErrorModalOpen(true)
      return
    }
    setDeleteDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!currentItem) return
    try {
      await deleteItem(currentItem.id)
      setCurrentItem(null)
    } catch (e) {
      setDeleteDialogOpen(false)
      setErrorModalData({
        title: 'Tidak Dapat Menghapus',
        message: 'Tahun ajaran ini masih memiliki data terkait',
        details: e?.message || 'Pindahkan atau hapus data terkait terlebih dahulu.',
        variant: 'error'
      })
      setErrorModalOpen(true)
    }
  }

  const handleOpenDetailModal = (item) => {
    setCurrentItem(item)
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
            <TahunAjaranTable
              data={data}
              isLoading={loading}
              isRefreshing={isRefreshing}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onToggleStatus={toggleStatus}
              onAdd={handleOpenCreate}
              onViewDetail={handleOpenDetailModal}
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

      <TahunAjaranFormDialog
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
        title="Hapus Tahun Ajaran"
        description="Apakah Anda yakin ingin menghapus tahun ajaran"
      />

      <TahunAjaranDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        item={currentItem}
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

export function TahunAjaran() {
  return <TahunAjaranContent />
}
