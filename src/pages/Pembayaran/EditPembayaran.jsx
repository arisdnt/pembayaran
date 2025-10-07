import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../../layout/PageLayout'
import { InformasiPembayaranSection } from './components/sections/InformasiPembayaranSection'
import { RincianPembayaranFormSection } from './components/forms/RincianPembayaranFormSection'
import { IdentitasSiswaCard } from './components/panels/IdentitasSiswaCard'
import { RingkasanTagihanCard } from './components/panels/RingkasanTagihanCard'
import { EditPembayaranHeader } from './components/headers/EditPembayaranHeader'
import { ErrorAlert } from './components/headers/ErrorAlert'
import { LoadingState } from './components/LoadingState'
import { NotFoundState } from './components/NotFoundState'
import { usePembayaranDetailData } from './hooks/usePembayaranDetailData'
import { useEditPembayaranHandlers } from './hooks/useEditPembayaranHandlers'

function EditPembayaranContent() {
  const navigate = useNavigate()

  const {
    loading,
    notFound,
    error: fetchError,
    formData,
    setFormData,
    rincianItems,
    setRincianItems,
    siswaInfo,
    tagihanInfo,
    totalPembayaran,
    summary,
    getNextCicilanKe,
  } = usePembayaranDetailData()

  const {
    error,
    submitting,
    validationErrors,
    canSubmit,
    handleInfoChange,
    handleAddRincian,
    handleRemoveRincian,
    handleRincianChange,
    handleSubmit,
  } = useEditPembayaranHandlers(formData, setFormData, rincianItems, setRincianItems, tagihanInfo)

  if (loading) return <LoadingState message="Memuat data pembayaran..." />
  if (notFound) return <NotFoundState message={fetchError} onBack={() => navigate('/pembayaran')} />

  return (
    <PageLayout>
      <div className="flex flex-col h-full">
        <EditPembayaranHeader
          onBack={() => navigate('/pembayaran')}
          onSave={handleSubmit}
          canSubmit={canSubmit}
          submitting={submitting}
        />
        <ErrorAlert error={error} />

        {/* Content */}
        <div className="flex-1 overflow-hidden px-6 pb-6 pt-4">
          <div className="grid grid-cols-[3fr_1fr] gap-4 h-full" style={{ gridTemplateRows: 'auto 1fr' }}>
            {/* Row 1, Col 1: Informasi Pembayaran */}
            <div className="overflow-hidden">
              <InformasiPembayaranSection
                formData={formData}
                onChange={handleInfoChange}
                errors={validationErrors}
                disabled={submitting}
              />
            </div>

            {/* Row 1, Col 2: Identitas Siswa */}
            <div className="overflow-hidden">
              <IdentitasSiswaCard siswaInfo={siswaInfo} />
            </div>

            {/* Row 2, Col 1: Rincian Pembayaran */}
            <div className="overflow-hidden">
              <RincianPembayaranFormSection
                rincianItems={rincianItems}
                totalPembayaran={totalPembayaran}
                onAdd={handleAddRincian}
                onRemove={handleRemoveRincian}
                onChange={handleRincianChange}
                summary={summary}
                errors={validationErrors}
                disableAdd={submitting}
                getNextCicilanKe={getNextCicilanKe}
              />
            </div>

            {/* Row 2, Col 2: Ringkasan Tagihan */}
            <div className="overflow-hidden">
              <RingkasanTagihanCard tagihanInfo={tagihanInfo} summary={summary} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export function EditPembayaran() {
  return <EditPembayaranContent />
}

