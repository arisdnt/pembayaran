import { useState, useEffect } from 'react'
import { Text, TextField, Badge } from '@radix-ui/themes'
import { Search, Plus, X } from 'lucide-react'

function formatCurrency(value) {
  if (!value) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(value)
}

export function AddRincianModal({
  open,
  onOpenChange,
  jenisPembayaranList,
  onAddItem,
  existingItems = []
}) {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedJenis, setSelectedJenis] = useState(null)
  const [customJumlah, setCustomJumlah] = useState('')
  const [customDeskripsi, setCustomDeskripsi] = useState('')

  const filteredJenisPembayaran = jenisPembayaranList.filter(jenis => {
    const matchesSearch = jenis.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         jenis.kode.toLowerCase().includes(searchTerm.toLowerCase())
    const notInCart = !existingItems.some(item => item.id_jenis_pembayaran === jenis.id)
    return matchesSearch && notInCart
  })

  const handleSelectJenis = (jenis) => {
    setSelectedJenis(jenis)
    setCustomJumlah(jenis.jumlah_default?.toString() || '')
    setCustomDeskripsi(jenis.nama)
  }

  const handleAddToCart = () => {
    if (!selectedJenis || !customJumlah) return

    const newItem = {
      id_jenis_pembayaran: selectedJenis.id,
      deskripsi: customDeskripsi || selectedJenis.nama,
      jumlah: customJumlah,
      urutan: existingItems.length + 1,
    }

    onAddItem(newItem)

    // Reset form
    setSelectedJenis(null)
    setCustomJumlah('')
    setCustomDeskripsi('')
    setSearchTerm('')
    onOpenChange(false)
  }

  const handleCancel = () => {
    setSelectedJenis(null)
    setCustomJumlah('')
    setCustomDeskripsi('')
    setSearchTerm('')
    onOpenChange(false)
  }

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  // Reset form when modal opens
  useEffect(() => {
    if (open) {
      setSelectedJenis(null)
      setCustomJumlah('')
      setCustomDeskripsi('')
      setSearchTerm('')
      document.addEventListener('keydown', handleKeyDown)
    } else {
      document.removeEventListener('keydown', handleKeyDown)
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  if (!open) return null

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={handleOverlayClick}
      >
        {/* Modal Content - Consistent with system design */}
        <div className="bg-white border-2 border-slate-300 shadow-lg w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Modal Header - Consistent with CreateTagihanHeader */}
          <div className="bg-gradient-to-b from-slate-100 to-slate-50 border-b-2 border-slate-300 px-6 py-4 shrink-0">
            <div className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-blue-600" />
              <Text size="4" weight="bold" className="text-slate-900">
                Tambah Item Tagihan
              </Text>
            </div>
          </div>

          {/* Modal Body */}
          <div className="p-6 space-y-6 flex-1 overflow-y-auto">
            {!selectedJenis ? (
              <>
                {/* Search Section - Consistent with filter design */}
                <div className="border-2 border-slate-300 bg-white shadow-sm">
                  <div className="bg-gradient-to-b from-slate-100 to-slate-50 border-b-2 border-slate-300 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-slate-600" />
                      <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                        Cari Jenis Pembayaran
                      </Text>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="relative">
                      <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                      <TextField.Root
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Ketik nama atau kode jenis pembayaran..."
                        style={{ paddingLeft: '2.5rem' }}
                        className="w-full"
                      />
                    </div>
                  </div>
                </div>

                {/* Results Section - Consistent with table design */}
                <div className="border-2 border-slate-300 bg-white shadow-sm">
                  <div className="bg-gradient-to-b from-slate-100 to-slate-50 border-b-2 border-slate-300 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                          Hasil Pencarian
                        </Text>
                      </div>
                      <Badge color="blue">{filteredJenisPembayaran.length} item</Badge>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {filteredJenisPembayaran.length === 0 ? (
                      <div className="p-8 text-center">
                        <Search className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                        <Text size="3" weight="medium" className="text-slate-600 block">
                          {searchTerm ? 'Tidak ada hasil pencarian' : 'Mulai pencarian'}
                        </Text>
                        <Text size="2" className="text-slate-500 mt-1 block">
                          {searchTerm ? 'Coba kata kunci yang berbeda' : 'Ketik nama atau kode jenis pembayaran'}
                        </Text>
                      </div>
                    ) : (
                      filteredJenisPembayaran.map((jenis, idx) => (
                        <div
                          key={jenis.id}
                          onClick={() => handleSelectJenis(jenis)}
                          className={`p-4 hover:bg-blue-50 cursor-pointer border-b border-slate-200 last:border-b-0 transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge color="blue">{jenis.kode}</Badge>
                                <Text size="2" weight="medium" className="text-slate-900">{jenis.nama}</Text>
                              </div>
                              <Text size="1" className="text-slate-500">
                                Default: {formatCurrency(jenis.jumlah_default)}
                              </Text>
                              {jenis.deskripsi && (
                                <Text size="1" className="text-slate-400 mt-1">{jenis.deskripsi}</Text>
                              )}
                            </div>
                            <Plus className="h-4 w-4 text-blue-600" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Selected Item Configuration - Consistent with system design */}
                <div className="border-2 border-slate-300 bg-white shadow-sm">
                  <div className="bg-gradient-to-b from-blue-100 to-blue-50 border-b-2 border-blue-300 px-4 py-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge color="blue">{selectedJenis.kode}</Badge>
                        <Text size="2" weight="bold" className="text-slate-900">{selectedJenis.nama}</Text>
                      </div>
                      <button
                        onClick={() => setSelectedJenis(null)}
                        className="flex items-center gap-2 px-3 py-1 border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                        type="button"
                      >
                        <X className="h-3 w-3 text-slate-600" />
                        <Text size="1" className="text-slate-700">Ubah</Text>
                      </button>
                    </div>
                    <Text size="1" className="text-blue-700 mt-1">
                      Default: {formatCurrency(selectedJenis.jumlah_default)}
                    </Text>
                  </div>

                  {/* Custom Configuration */}
                  <div className="p-4 space-y-4">
                    <div>
                      <Text size="2" weight="medium" className="mb-2 block text-slate-700">Deskripsi Item</Text>
                      <TextField.Root
                        value={customDeskripsi}
                        onChange={(e) => setCustomDeskripsi(e.target.value)}
                        placeholder="Deskripsi item tagihan"
                        className="w-full"
                      />
                    </div>

                    <div>
                      <Text size="2" weight="medium" className="mb-2 block text-slate-700">Jumlah Tagihan</Text>
                      <TextField.Root
                        type="number"
                        value={customJumlah}
                        onChange={(e) => setCustomJumlah(e.target.value)}
                        placeholder="0"
                        min="0"
                        step="1000"
                        className="w-full"
                      />
                      {customJumlah && (
                        <Text size="2" weight="medium" className="text-emerald-700 font-mono mt-2 block">
                          {formatCurrency(parseFloat(customJumlah) || 0)}
                        </Text>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Modal Footer - Consistent with header button design */}
          <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-6 py-4 shrink-0">
            <div className="flex justify-end gap-3">
              {!selectedJenis ? (
                <button
                  onClick={handleCancel}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                  type="button"
                >
                  <X className="h-4 w-4 text-slate-600" />
                  <Text size="2" weight="medium" className="text-slate-700">
                    Tutup
                  </Text>
                </button>
              ) : (
                <>
                  <button
                    onClick={() => setSelectedJenis(null)}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                    type="button"
                  >
                    <Text size="2" weight="medium" className="text-slate-700">
                      Kembali
                    </Text>
                  </button>
                  <button
                    onClick={handleAddToCart}
                    disabled={!customJumlah}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                    <Text size="2" weight="medium" className="text-white">
                      Tambah ke Tagihan
                    </Text>
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}