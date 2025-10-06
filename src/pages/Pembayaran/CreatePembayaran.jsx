import { useState } from 'react'
import { PageLayout } from '../../layout/PageLayout'
import { Text } from '@radix-ui/themes'
import { AlertCircle, ArrowLeft, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePaymentFlow } from './hooks/usePaymentFlow'
import { SiswaSearchSection } from './components/SiswaSearchSection'
import { UnpaidTagihanList } from './components/UnpaidTagihanList'
import { PaymentInputModal } from './components/PaymentInputModal'
import { SelectedPaymentList } from './components/SelectedPaymentList'
import { PaymentConfirmationModal } from './components/PaymentConfirmationModal'

export function CreatePembayaran() {
  const navigate = useNavigate()
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)

  const {
    siswaList,
    selectedSiswa,
    setSelectedSiswa,
    unpaidTagihan,
    selectedPayments,
    modalOpen,
    setModalOpen,
    currentTagihan,
    currentSummary,
    handlePayClick,
    handleAddPayment,
    handleRemovePayment,
    handleEditPayment,
    handleSubmit,
    totalAmount,
    selectedTagihanIds,
    submitting,
    error,
  } = usePaymentFlow()

  const handleSaveClick = () => {
    if (selectedPayments.length > 0) {
      setConfirmModalOpen(true)
    }
  }

  const handleConfirmSubmit = async () => {
    await handleSubmit()
    setConfirmModalOpen(false)
  }

  return (
    <PageLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="shrink-0 border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/pembayaran')}
                className="flex h-9 w-9 items-center justify-center border-2 border-slate-300 hover:bg-slate-200 transition-colors"
                type="button"
              >
                <ArrowLeft className="h-4 w-4 text-slate-700" />
              </button>
              <div>
                <Text size="4" weight="bold" className="text-slate-800 uppercase tracking-wider">
                  Buat Pembayaran Baru
                </Text>
                <Text size="2" className="text-slate-600">
                  Pilih siswa, pilih tagihan, dan lakukan pembayaran
                </Text>
              </div>
            </div>
            <button
              onClick={handleSaveClick}
              disabled={submitting || selectedPayments.length === 0}
              className={`flex items-center gap-2 px-5 py-2.5 border-2 font-medium uppercase tracking-wider transition-all ${
                submitting || selectedPayments.length === 0
                  ? 'bg-slate-300 border-slate-400 text-slate-500 cursor-not-allowed'
                  : 'bg-green-600 border-green-700 text-white hover:bg-green-700 cursor-pointer'
              }`}
              type="button"
            >
              <Save className="h-4 w-4" />
              Simpan Pembayaran
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="shrink-0 mx-6 mt-4 flex items-start gap-3 bg-red-50 border-2 border-red-200 px-4 py-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <Text size="2" weight="medium" className="text-red-700 mb-1">
                Error
              </Text>
              <Text size="2" className="text-red-600">
                {error}
              </Text>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden px-6 pb-6 pt-4">
          <div className="grid grid-cols-4 gap-4 h-full">
            {/* Left Column (75%) - Siswa & Tagihan */}
            <div className="col-span-3 flex flex-col h-full overflow-hidden">
              <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="border-b-2 border-slate-300 bg-gradient-to-b from-blue-600 to-blue-700 px-4 py-3 shrink-0">
                  <Text size="2" weight="bold" className="text-white uppercase tracking-wider">
                    Pilih Siswa & Tagihan
                  </Text>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-auto p-4">
                  <SiswaSearchSection
                    siswaList={siswaList}
                    selectedSiswa={selectedSiswa}
                    onSelect={setSelectedSiswa}
                  />

                  {selectedSiswa && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-3">
                        <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                          Tagihan Belum Lunas
                        </Text>
                        <Text size="1" className="text-slate-500">
                          {unpaidTagihan.length} tagihan ditemukan
                        </Text>
                      </div>

                      <div className="border-2 border-slate-300 overflow-hidden">
                        <UnpaidTagihanList
                          tagihanList={unpaidTagihan}
                          onPayClick={handlePayClick}
                          selectedIds={selectedTagihanIds}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column (25%) - Daftar Pembayaran */}
            <div className="col-span-1 flex flex-col h-full overflow-hidden">
              <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col h-full overflow-hidden">
                {/* Header */}
                <div className="border-b-2 border-slate-300 bg-gradient-to-b from-green-600 to-green-700 px-4 py-3 shrink-0">
                  <Text size="2" weight="bold" className="text-white uppercase tracking-wider">
                    Daftar Pembayaran
                  </Text>
                </div>

                {/* Content */}
                <SelectedPaymentList
                  payments={selectedPayments}
                  onRemove={handleRemovePayment}
                  onEdit={handleEditPayment}
                  totalAmount={totalAmount}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Input Pembayaran */}
      <PaymentInputModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSubmit={handleAddPayment}
        tagihan={currentTagihan}
        summary={currentSummary}
      />

      {/* Modal Konfirmasi Pembayaran */}
      <PaymentConfirmationModal
        open={confirmModalOpen}
        onOpenChange={setConfirmModalOpen}
        onConfirm={handleConfirmSubmit}
        payments={selectedPayments}
        totalAmount={totalAmount}
        siswaInfo={selectedSiswa}
        submitting={submitting}
      />
    </PageLayout>
  )
}
