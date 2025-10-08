import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageLayout } from '../../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { useSiswa } from '../hooks/useSiswa'
import { SiswaTable } from '../components/tabel'
import SiswaFormDialog from '../components/form'
import { DeleteConfirmDialog } from '../../../components/common/DeleteConfirmDialog'
import { ErrorModal } from '../../../components/modals/ErrorModal'
import { db } from '../../../offline/db'

function SiswaContent() {
  const navigate = useNavigate()
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

  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorModalData, setErrorModalData] = useState({ title: '', message: '', details: '', variant: 'error' })

  const handleOpenDelete = async (item) => {
    setCurrentItem(item)
    // Derive relations live for accuracy
    let rksCount = 0, pemCount = 0, tagihanCount = 0
    try { rksCount = await db.riwayat_kelas_siswa.where('id_siswa').equals(item.id).count() } catch {}
    try { pemCount = await db.peminatan_siswa.where('id_siswa').equals(item.id).count() } catch {}
    try {
      if (rksCount > 0) {
        const rksRows = await db.riwayat_kelas_siswa.where('id_siswa').equals(item.id).toArray()
        const rksIds = rksRows.map(r => r.id)
        const allTagihan = await db.tagihan.toArray()
        tagihanCount = allTagihan.filter(t => rksIds.includes(t.id_riwayat_kelas_siswa)).length
      }
    } catch {}

    if (rksCount + pemCount + tagihanCount > 0) {
      const parts = []
      if (rksCount) parts.push(`${rksCount} riwayat kelas`)
      if (tagihanCount) parts.push(`${tagihanCount} tagihan`)
      if (pemCount) parts.push(`${pemCount} peminatan siswa`)
      const refs = parts.length ? ` (${parts.join(' dan ')})` : ''
      setErrorModalData({
        title: 'Tidak Dapat Menghapus',
        message: 'Siswa ini masih memiliki data terkait',
        details: `Pindahkan atau hapus data terkait${refs} terlebih dahulu sebelum menghapus siswa.`,
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
        message: 'Siswa ini masih memiliki data terkait',
        details: e?.message || 'Pindahkan atau hapus data terkait terlebih dahulu.',
        variant: 'error'
      })
      setErrorModalOpen(true)
    }
  }

  const handleOpenDetail = (item) => {
    // Navigate to detail page instead of opening modal
    navigate(`/siswa/${item.id}`)
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

export function Siswa() {
  return <SiswaContent />
}
