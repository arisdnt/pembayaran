import { useState, useEffect } from 'react'

import { PageLayout } from '../../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { useRiwayatKelasSiswa } from '../hooks/useRiwayatKelasSiswa'
import { RiwayatKelasSiswaTable } from '../components/tabel/RiwayatKelasSiswaTable'
import RiwayatKelasSiswaFormDialog from '../components/form/RiwayatKelasSiswaFormDialog'
import { DeleteConfirmDialog } from '../../../components/common/DeleteConfirmDialog'
import { DetailPanel } from '../components/detail/DetailPanel'
import { RiwayatDetailModal } from '../components/detail/components/RiwayatDetailModal'
import { ErrorModal } from '../../../components/modals/ErrorModal'
import { db } from '../../../offline/db'

function RiwayatKelasSiswaContent() {
  const {
    data,
    loading,
    realtimeStatus,
    error,
    setError,
    deleteItem,
    saveItem,
    siswaList,
    kelasList,
    tahunAjaranList,
  } = useRiwayatKelasSiswa()

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
      id_siswa: undefined,
      id_kelas: undefined,
      id_tahun_ajaran: undefined,
      tanggal_masuk: '',
      tanggal_keluar: '',
      status: 'aktif',
      catatan: '',
    })
    setError('')
    setDialogOpen(true)
  }

  const handleOpenEdit = (item) => {
    setEditMode(true)
    // Create a new object to trigger useEffect in form hook
    setCurrentItem({
      id: item.id,
      id_siswa: item.id_siswa,
      id_kelas: item.id_kelas,
      id_tahun_ajaran: item.id_tahun_ajaran,
      tanggal_masuk: item.tanggal_masuk,
      tanggal_keluar: item.tanggal_keluar,
      status: item.status,
      catatan: item.catatan,
    })
    setError('')
    setDialogOpen(true)
  }

  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorModalData, setErrorModalData] = useState({ title: '', message: '', details: '', variant: 'error' })

  const handleOpenDelete = async (item) => {
    setCurrentItem(item)
    let tCount = 0
    try { tCount = await db.tagihan.where('id_riwayat_kelas_siswa').equals(item.id).count() } catch {}
    if (tCount > 0) {
      setErrorModalData({
        title: 'Tidak Dapat Menghapus',
        message: 'Riwayat kelas ini masih memiliki data terkait',
        details: `Terdapat ${tCount} tagihan terkait. Hapus tagihan tersebut terlebih dahulu sebelum menghapus riwayat kelas.`,
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
        message: 'Riwayat kelas ini masih memiliki data terkait',
        details: e?.message || 'Hapus data terkait terlebih dahulu.',
        variant: 'error'
      })
      setErrorModalOpen(true)
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
            <RiwayatKelasSiswaTable
              data={data}
              isLoading={loading}
              onEdit={handleOpenEdit}
              onDelete={handleOpenDelete}
              onAdd={handleOpenCreate}
              selectedItem={selectedItem}
              onSelectItem={setSelectedItem}
              onViewDetail={handleOpenDetail}
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

      <RiwayatKelasSiswaFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={saveItem}
        initialData={currentItem}
        isEdit={editMode}
        siswaList={siswaList}
        kelasList={kelasList}
        tahunAjaranList={tahunAjaranList}
      />

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        itemName={currentItem?.siswa?.nama_lengkap || currentItem?.id || ''}
        title="Hapus Riwayat Kelas"
        description="Apakah Anda yakin ingin menghapus riwayat kelas siswa"
      />

      <RiwayatDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        riwayat={selectedItem}
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

export function RiwayatKelasSiswa() {
  return <RiwayatKelasSiswaContent />
}
