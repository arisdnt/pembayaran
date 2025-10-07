import { useState } from 'react'
import { PageLayout } from '../../layout/PageLayout'
import { db } from '../../offline/db'
import { retryOutboxItem, retryAllErrorOutbox } from '../../offline/outbox'
import { useSyncStatusData } from './hooks/useSyncStatusData'
import { FilterControls } from './components/FilterControls'
import { SyncStatusTable } from './components/SyncStatusTable'
import { PayloadDetailDialog } from './components/PayloadDetailDialog'

export function SyncStatus() {
  const {
    filteredItems,
    loading,
    statusFilter,
    setStatusFilter,
    tableFilter,
    setTableFilter,
    searchTerm,
    setSearchTerm,
    globalStats,
    filteredStats,
    tableOptions,
    load,
  } = useSyncStatusData()

  const [selectedItem, setSelectedItem] = useState(null)
  const [retrying, setRetrying] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [copiedErrorId, setCopiedErrorId] = useState(null)

  const handleRetryAll = async () => {
    setRetrying(true)
    try {
      await retryAllErrorOutbox()
      await load()
    } catch (err) {
      console.error('Error retrying all:', err)
    } finally {
      setRetrying(false)
    }
  }

  const handleRetryItem = async (itemId) => {
    setRetrying(true)
    try {
      await retryOutboxItem(itemId)
      await load()
    } catch (err) {
      console.error('Error retrying item:', err)
    } finally {
      setRetrying(false)
    }
  }

  const handleDeleteItem = async (itemId) => {
    setDeletingId(itemId)
    try {
      await db.outbox.delete(itemId)
      await load()
    } catch (err) {
      console.error('Error deleting item:', err)
    } finally {
      setDeletingId(null)
    }
  }

  const handleCopyError = async (errorMessage, itemId) => {
    try {
      await navigator.clipboard.writeText(errorMessage)
      setCopiedErrorId(itemId)
      setTimeout(() => setCopiedErrorId(null), 2000)
    } catch (err) {
      console.error('Error copying to clipboard:', err)
    }
  }

  return (
    <PageLayout>
      <div className="flex flex-col h-full gap-4">
        <div className="border-2 border-slate-300 bg-white shadow-lg flex-1 flex flex-col min-h-0">
          <FilterControls
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            tableFilter={tableFilter}
            setTableFilter={setTableFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            tableOptions={tableOptions}
            filteredStats={filteredStats}
            globalStats={globalStats}
            loading={loading}
            retrying={retrying}
            onRefresh={load}
            onRetryAll={handleRetryAll}
          />

          <SyncStatusTable
            filteredItems={filteredItems}
            loading={loading}
            retrying={retrying}
            deletingId={deletingId}
            copiedErrorId={copiedErrorId}
            onRetryItem={handleRetryItem}
            onDeleteItem={handleDeleteItem}
            onCopyError={handleCopyError}
            onShowDetail={setSelectedItem}
          />
        </div>

        <style>{`
          .excel-scrollbar::-webkit-scrollbar {
            width: 16px;
            height: 16px;
          }

          .excel-scrollbar::-webkit-scrollbar-track {
            background: #f1f5f9;
            border-left: 1px solid #cbd5e1;
            border-top: 1px solid #cbd5e1;
          }

          .excel-scrollbar::-webkit-scrollbar-thumb {
            background: #94a3b8;
            border: 3px solid #f1f5f9;
          }

          .excel-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #64748b;
          }

          .excel-scrollbar::-webkit-scrollbar-corner {
            background: #f1f5f9;
          }
        `}</style>
      </div>

      <PayloadDetailDialog
        selectedItem={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    </PageLayout>
  )
}

export default SyncStatus
