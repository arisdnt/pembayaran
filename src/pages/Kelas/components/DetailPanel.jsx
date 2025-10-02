import { DetailPanelSkeleton } from './DetailPanelSkeleton'
import { DetailPanelEmpty } from './DetailPanelEmpty'
import { DetailPanelHeader } from './DetailPanelHeader'
import { DetailPanelInfoSection } from './DetailPanelInfoSection'
import { DetailPanelCapacity } from './DetailPanelCapacity'
import { DetailPanelMetadata } from './DetailPanelMetadata'
import { DetailPanelFooter } from './DetailPanelFooter'

export function DetailPanel({ selectedItem, isLoading = false, isRefreshing = false }) {
  const schoolName = import.meta.env.VITE_SCHOOL_NAME || 'Nama Sekolah'
  const schoolAddress = import.meta.env.VITE_SCHOOL_ADDRESS || ''
  const footerInfo = import.meta.env.VITE_SCHOOL_FOOTER || ''

  if (isLoading) {
    return <DetailPanelSkeleton />
  }

  if (!selectedItem) {
    return <DetailPanelEmpty />
  }

  return (
    <div className="relative h-full flex flex-col border-2 border-slate-300 bg-white shadow-lg">
      {isRefreshing ? (
        <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-blue-500/70 to-transparent animate-pulse" />
      ) : null}

      <DetailPanelHeader
        selectedItem={selectedItem}
        schoolName={schoolName}
        schoolAddress={schoolAddress}
      />

      <div className="flex-1 min-h-0 overflow-auto excel-scrollbar">
        <div className="p-4 space-y-3">
          <DetailPanelInfoSection selectedItem={selectedItem} />
          <DetailPanelCapacity selectedItem={selectedItem} />
          <DetailPanelMetadata selectedItem={selectedItem} />
        </div>
      </div>

      <DetailPanelFooter selectedItem={selectedItem} footerInfo={footerInfo} />

      {/* Excel-style scrollbar */}
      <style>{`
        .excel-scrollbar::-webkit-scrollbar {
          width: 12px;
        }
        
        .excel-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-left: 1px solid #cbd5e1;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border: 2px solid #e2e8f0;
          transition: background 0.2s;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  )
}
