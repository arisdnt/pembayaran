import { useEffect, useMemo, useState } from 'react'
import { db } from '../../offline/db'
import { bulkInsertKirimPesan, deleteKirimPesanByContent } from '../../offline/actions/kirimPesan'
import { Card, Text as RadixText } from '@radix-ui/themes'
import Notification from './components/Notification'
import DeleteDialog from './components/DeleteDialog'
import LogViewer from './components/LogViewer'
import FilterControls from './components/FilterControls'
import MessageTable from './components/MessageTable'
import SettingsModal from './components/SettingsModal'
import { useMessageData } from './hooks/useMessageData'
import { useMessageGenerator } from './hooks/useMessageGenerator'
import { useMessageSender } from './hooks/useMessageSender'

export default function KirimPesan() {
  const [tahunAjaranList, setTahunAjaranList] = useState([])
  const [kelasList, setKelasList] = useState([])
  const [tingkatList, setTingkatList] = useState([])
  const [selectedTA, setSelectedTA] = useState('')
  const [selectedTingkat, setSelectedTingkat] = useState('_all')
  const [selectedKelas, setSelectedKelas] = useState('_all')
  const [rateMs, setRateMs] = useState(10000)
  const [notification, setNotification] = useState(null)
  const [deleteDialog, setDeleteDialog] = useState({ open: false, index: null })
  const [settingsModalOpen, setSettingsModalOpen] = useState(false)

  const handleOpenSettings = () => {
    console.log('[KirimPesan] Opening settings modal')
    setSettingsModalOpen(true)
  }

  const handleCloseSettings = (open) => {
    console.log('[KirimPesan] Settings modal state changed:', open)
    setSettingsModalOpen(open)
  }

  const { kirimPesanData, kirimPesanLoading, forceRefresh } = useMessageData()
  
  const filteredKelas = useMemo(() => {
    if (!selectedTingkat || selectedTingkat === '_all') return kelasList
    return kelasList.filter(k => String(k.tingkat) === String(selectedTingkat))
  }, [kelasList, selectedTingkat])

  const { loading, generatePreview } = useMessageGenerator(
    selectedTA,
    selectedTingkat,
    selectedKelas,
    tahunAjaranList,
    kelasList,
    filteredKelas
  )
  
  const { sending, logLines, handleKirim } = useMessageSender(rateMs, forceRefresh)

  useEffect(() => {
    ;(async () => {
      const [ta, kk] = await Promise.all([
        db.tahun_ajaran.orderBy('tanggal_mulai').reverse().toArray(),
        db.kelas.orderBy('tingkat').toArray(),
      ])
      setTahunAjaranList(ta)
      setKelasList(kk)
      const uniqueTingkat = Array.from(new Set((kk || []).map(k => String(k.tingkat)))).sort((a,b) => (a.localeCompare(b, 'id', { numeric: true })))
      setTingkatList(uniqueTingkat)
      const aktif = ta.find(x => x.status_aktif)
      if (aktif) setSelectedTA(aktif.id)
    })()
  }, [])

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleGenerate = async () => {
    const rows = await generatePreview()
    if (!rows || rows.length === 0) {
      showNotification('error', 'Tidak ada data pesan untuk digenerate. Periksa filter atau pastikan siswa memiliki nomor WhatsApp wali.')
      return
    }
    try {
      await bulkInsertKirimPesan(rows)
      showNotification('success', `Berhasil generate ${rows.length} pesan ke database.`)
    } catch (e) {
      console.error(e)
      showNotification('error', 'Gagal generate data kirim pesan: ' + e.message)
    }
  }

  const handleDeleteRow = (index) => {
    setDeleteDialog({ open: true, index })
  }

  const confirmDelete = async () => {
    if (deleteDialog.index !== null) {
      const rowToDelete = kirimPesanData[deleteDialog.index]
      try {
        await deleteKirimPesanByContent(rowToDelete.nomor_whatsapp, rowToDelete.isi_pesan)
        setDeleteDialog({ open: false, index: null })
        showNotification('success', 'Data berhasil dihapus dari database.')
      } catch (e) {
        console.error('Error deleting from database:', e)
        showNotification('error', 'Gagal menghapus data dari database: ' + e.message)
        setDeleteDialog({ open: false, index: null })
      }
    }
  }

  const handleSendMessages = async () => {
    try {
      const results = await handleKirim()
      if (results) {
        showNotification('success', `Berhasil: ${results.success}, Gagal: ${results.failed} dari ${results.total} pesan`)
      }
    } catch (e) {
      const errorMsg = e?.message || String(e) || 'Unknown error'
      showNotification('error', 'Gagal mengirim pesan: ' + errorMsg)
    }
  }

  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      <Notification 
        notification={notification} 
        onClose={() => setNotification(null)} 
      />

      {/* Main Content Area - Fixed Height with Padding */}
      <div className="flex-1 flex flex-col p-6 overflow-hidden min-h-0">
        <div className="grid grid-cols-12 gap-4 flex-1 overflow-hidden min-h-0">
          {/* Left Column - Message Table (75%) */}
          <div className="col-span-9 flex flex-col overflow-hidden min-h-0">
            <Card className="p-4 flex flex-col h-full overflow-hidden" style={{ borderRadius: 0 }}>
              <FilterControls
                tahunAjaranList={tahunAjaranList}
                tingkatList={tingkatList}
                filteredKelas={filteredKelas}
                selectedTA={selectedTA}
                selectedTingkat={selectedTingkat}
                selectedKelas={selectedKelas}
                rateMs={rateMs}
                loading={loading}
                sending={sending}
                onTAChange={setSelectedTA}
                onTingkatChange={setSelectedTingkat}
                onKelasChange={setSelectedKelas}
                onRateMsChange={setRateMs}
                onGenerate={handleGenerate}
                onKirim={handleSendMessages}
                onSettings={handleOpenSettings}
                messageCount={kirimPesanData.length}
              />

              <RadixText weight="bold" className="mb-2 block flex-shrink-0">
                Preview ({kirimPesanData.length})
              </RadixText>
              
              {/* Table with flex-1 to fill remaining space */}
              <div className="flex-1 min-h-0">
                <MessageTable 
                  data={kirimPesanData} 
                  loading={kirimPesanLoading}
                  onDelete={handleDeleteRow} 
                />
              </div>
            </Card>
          </div>

          {/* Right Column - Log Viewer (25%) */}
          <div className="col-span-3 flex flex-col overflow-hidden min-h-0">
            <LogViewer logLines={logLines} />
          </div>
        </div>
      </div>

      <DeleteDialog
        open={deleteDialog.open}
        onOpenChange={(open) => setDeleteDialog({ open, index: null })}
        onConfirm={confirmDelete}
      />

      <SettingsModal
        open={settingsModalOpen}
        onOpenChange={handleCloseSettings}
      />
    </div>
  )
}
