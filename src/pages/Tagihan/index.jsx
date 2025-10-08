import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { PageLayout } from '../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'
import { useTagihan } from './hooks/useTagihan'
import { TagihanTable } from './components/TagihanTable'
import { DeleteConfirmDialog } from '../../components/common/DeleteConfirmDialog'
import { TagihanDetailModal } from './components/TagihanDetailModal'
import { ErrorModal } from '../../components/modals/ErrorModal'
import { db } from '../../offline/db'

function TagihanContent() {
  const navigate = useNavigate()
  const {
    data,
    loading,
    realtimeStatus,
    error,
    deleteItem,
    kelasList,
    tahunAjaranList,
  } = useTagihan()

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
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
    // Redirect ke halaman create tagihan
    navigate('/tagihan/create')
  }

  const handleOpenEdit = (item) => {
    // Redirect ke halaman edit tagihan
    navigate(`/tagihan/edit/${item.id}`)
  }

  const [errorModalOpen, setErrorModalOpen] = useState(false)
  const [errorModalData, setErrorModalData] = useState({ title: '', message: '', details: '', variant: 'error' })

  const handleOpenDelete = async (item) => {
    setCurrentItem(item)
    if (item?.has_relasi) {
      let rCount = 0, pCount = 0
      try { rCount = await db.rincian_tagihan.where('id_tagihan').equals(item.id).count() } catch {}
      try { pCount = await db.pembayaran.where('id_tagihan').equals(item.id).count() } catch {}
      const parts = []
      if (rCount) parts.push(`${rCount} rincian tagihan`)
      if (pCount) parts.push(`${pCount} pembayaran`)
      const refs = parts.length ? ` (${parts.join(' dan ')})` : ''
      setErrorModalData({
        title: 'Tidak Dapat Menghapus',
        message: 'Tagihan ini masih memiliki data terkait',
        details: `Hapus data terkait${refs} terlebih dahulu sebelum menghapus tagihan.`,
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
      setSelectedItem(null)
    } catch (e) {
      setDeleteDialogOpen(false)
      setErrorModalData({
        title: 'Tidak Dapat Menghapus',
        message: 'Tagihan ini masih memiliki data terkait',
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
              <Text size="2" className="text-red-600">{error}</Text>
            </div>
          </div>
        ) : null}

        {/* Tabel Full Width */}
        <div className="flex-1 min-h-0">
          <TagihanTable
            data={data}
            isLoading={loading}
            onEdit={handleOpenEdit}
            onDelete={handleOpenDelete}
            onAdd={handleOpenCreate}
            selectedItem={selectedItem}
            onSelectItem={setSelectedItem}
            onViewDetail={handleOpenDetail}
            kelasList={kelasList}
            tahunAjaranList={tahunAjaranList}
          />
        </div>
      </div>

      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        itemName={currentItem?.nomor_tagihan || currentItem?.judul || ''}
        title="Hapus Tagihan"
        description="Apakah Anda yakin ingin menghapus tagihan"
      />

      <TagihanDetailModal
        open={detailModalOpen}
        onOpenChange={setDetailModalOpen}
        tagihan={selectedItem}
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

export function Tagihan() {
  return <TagihanContent />
}
