import { useState } from 'react'
import { PageLayout } from '../../layout/PageLayout'
import { Text, Badge } from '@radix-ui/themes'
import { AlertCircle, ArrowLeft, Save } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { usePaymentFlow } from './hooks/usePaymentFlow'
import { SiswaSearchSection } from './components/SiswaSearchSection'
import { UnpaidTagihanList } from './components/UnpaidTagihanList'
import { PaymentInputModal } from './components/PaymentInputModal'
import { SelectedPaymentList } from './components/SelectedPaymentList'
import { PaymentConfirmationModal } from './components/PaymentConfirmationModal'
import { PaymentInvoiceModal } from './components/PaymentInvoiceModal'

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
    invoiceData,
    setInvoiceData,
    pendingGeneration,
    preparePaymentNumbers,
  } = usePaymentFlow()

  const handleSaveClick = async () => {
    if (selectedPayments.length > 0) {
      const prepared = await preparePaymentNumbers()
      if (prepared) {
        setConfirmModalOpen(true)
      }
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
        <div className="shrink-0 bg-white px-6 py-3">
          <div className="flex items-center justify-between">
            <div>
              <Text size="4" weight="bold" className="text-slate-900 block mb-1">
                Buat Pembayaran Baru
              </Text>
              <Text size="1" className="text-slate-500">
                Pilih siswa, pilih tagihan, dan lakukan pembayaran
              </Text>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate('/pembayaran')}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                type="button"
              >
                <ArrowLeft className="h-4 w-4 text-slate-600" />
                <Text size="2" weight="medium" className="text-slate-700">
                  Kembali
                </Text>
              </button>
              <button
                onClick={handleSaveClick}
                disabled={submitting || selectedPayments.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                type="button"
              >
                <Save className="h-4 w-4" />
                <Text size="2" weight="medium" className="text-white">
                  {submitting ? 'Menyimpan...' : 'Simpan Pembayaran'}
                </Text>
              </button>
            </div>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="shrink-0 mx-6 mt-4 flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3">
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
            <div className="col-span-3 flex flex-col gap-4 h-full overflow-hidden">
              {/* Siswa Search Section */}
              <div className="border-2 border-slate-300 bg-white shadow-lg shrink-0">
                <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3">
                  <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Pilih Siswa
                  </Text>
                </div>
                <div className="p-4">
                  <SiswaSearchSection
                    siswaList={siswaList}
                    selectedSiswa={selectedSiswa}
                    onSelect={setSelectedSiswa}
                  />
                </div>
              </div>

              {/* Tagihan Section */}
              <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col flex-1 overflow-hidden">
                <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
                  <div className="flex items-center justify-between">
                    <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                      Tagihan Belum Lunas
                    </Text>
                    {selectedSiswa && (
                      <Badge color="blue" size="2" style={{ borderRadius: 0 }}>
                        {unpaidTagihan.length} tagihan
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="flex-1 overflow-auto">
                  <UnpaidTagihanList
                    tagihanList={unpaidTagihan}
                    onPayClick={handlePayClick}
                    selectedIds={selectedTagihanIds}
                    selectedSiswa={selectedSiswa}
                  />
                </div>
              </div>
            </div>

            {/* Right Column (25%) - Daftar Pembayaran */}
            <div className="col-span-1 flex flex-col h-full overflow-hidden">
              <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col h-full overflow-hidden">
                <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
                  <div className="flex items-center justify-between">
                    <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                      Daftar Pembayaran
                    </Text>
                    <Badge color="green" size="2" style={{ borderRadius: 0 }}>
                      {selectedPayments.length} item
                    </Badge>
                  </div>
                </div>
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
        generatedNumbers={pendingGeneration?.prepared || []}
      />

      {/* Modal Invoice/Bukti Pembayaran */}
      <PaymentInvoiceModal
        open={!!invoiceData}
        onOpenChange={(open) => {
          if (!open) {
            setInvoiceData(null)
            navigate('/pembayaran')
          }
        }}
        paymentData={invoiceData}
      />
    </PageLayout>
  )
}
