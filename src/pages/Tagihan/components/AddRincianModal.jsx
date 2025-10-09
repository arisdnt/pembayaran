import { useMemo } from 'react'
import { Text, Badge, Dialog } from '@radix-ui/themes'
import { Plus, Search, X, Info } from 'lucide-react'

function formatCurrency(value) {
  if (!value) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export function AddRincianModal({
  open,
  onOpenChange,
  jenisPembayaranList,
  onAddItem,
  existingItems = [],
  filterText = '',
}) {
  const availableJenisPembayaran = useMemo(() => {
    const uniqueMap = new Map()
    jenisPembayaranList.forEach(jenis => {
      if (jenis?.id && !uniqueMap.has(jenis.id)) {
        uniqueMap.set(jenis.id, jenis)
      }
    })
    return Array.from(uniqueMap.values()).filter(
      jenis => !existingItems.some(item => item.id_jenis_pembayaran === jenis.id),
    )
  }, [jenisPembayaranList, existingItems])

  const handleSelectJenis = jenis => {
    const newItem = {
      id_jenis_pembayaran: jenis.id,
      deskripsi: jenis.nama,
      jumlah: jenis.jumlah_default || 0,
      urutan: existingItems.length + 1,
    }

    onAddItem(newItem)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{ maxWidth: '1100px', width: '95vw', padding: 0, borderRadius: 0 }}
        className="border-2 border-slate-300 shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-blue-600 to-blue-700 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-white border border-blue-800 shadow">
              <Plus className="h-5 w-5 text-blue-700" />
            </div>
            <div className="leading-tight">
              <Dialog.Title asChild>
                <Text size="3" weight="bold" className="text-white uppercase tracking-wider block">
                  Tambah Item Tagihan
                </Text>
              </Dialog.Title>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center border border-white hover:bg-red-600 transition-colors"
            type="button"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Body */}
        <div className="bg-white flex flex-col max-h-[80vh]">
          <div className="bg-slate-50 border-b-2 border-slate-300 px-5 py-3 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Info className="h-4 w-4 text-blue-600" />
              <div>
                <Text size="2" weight="medium" className="text-slate-900 block">
                  Daftar Item Pembayaran
                </Text>
                {filterText ? (
                  <Text size="1" className="text-slate-500 block mt-0.5">
                    {filterText}
                  </Text>
                ) : (
                  <Text size="1" className="text-slate-500 block mt-0.5">
                    Pilih beberapa item sekaligus tanpa menutup jendela ini
                  </Text>
                )}
              </div>
            </div>
            <Badge color="blue" size="2" style={{ borderRadius: 0 }}>
              {availableJenisPembayaran.length} item tersedia
            </Badge>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            {availableJenisPembayaran.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center text-center py-12">
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                  <Search className="h-10 w-10 text-slate-400" />
                </div>
                <Text size="4" weight="medium" className="text-slate-700 mb-2">
                  Tidak ada item tersedia
                </Text>
                <Text size="2" className="text-slate-500 max-w-sm">
                  Semua jenis pembayaran sudah ditambahkan atau tidak ada yang cocok dengan filter yang Anda terapkan.
                </Text>
              </div>
            ) : (
              <div className="border border-slate-200">
                <div className="bg-slate-100 border-b border-slate-200">
                  <table className="w-full table-fixed">
                    <colgroup>
                      <col style={{ width: '8%' }} />
                      <col style={{ width: '14%' }} />
                      <col />
                      <col style={{ width: '18%' }} />
                      <col style={{ width: '16%' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 border-r border-slate-200">No</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 border-r border-slate-200">Kode</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-600 border-r border-slate-200">Nama / Deskripsi</th>
                        <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-600 border-r border-slate-200">Jumlah Default</th>
                        <th className="px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-600">Aksi</th>
                      </tr>
                    </thead>
                  </table>
                </div>
                <div className="max-h-[50vh] overflow-y-auto">
                  <table className="w-full table-fixed">
                    <colgroup>
                      <col style={{ width: '8%' }} />
                      <col style={{ width: '14%' }} />
                      <col />
                      <col style={{ width: '18%' }} />
                      <col style={{ width: '16%' }} />
                    </colgroup>
                    <tbody>
                      {availableJenisPembayaran.map((jenis, idx) => (
                        <tr
                          key={jenis.id}
                          className={idx % 2 === 0 ? 'bg-white border-b border-slate-100' : 'bg-slate-50 border-b border-slate-100'}
                        >
                          <td className="px-4 py-3 text-sm text-slate-700 border-r border-slate-200">{idx + 1}</td>
                          <td className="px-4 py-3 text-sm border-r border-slate-200">
                            <Badge color="blue" variant="soft" size="1" style={{ borderRadius: 0 }}>
                              {jenis.kode}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-sm text-slate-700 border-r border-slate-200">
                            <div className="font-medium text-slate-900">{jenis.nama}</div>
                            {jenis.deskripsi && (
                              <div className="text-xs text-slate-500 mt-1 line-clamp-2">{jenis.deskripsi}</div>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-right font-mono text-slate-800 border-r border-slate-200">
                            {formatCurrency(jenis.jumlah_default)}
                          </td>
                          <td className="px-4 py-3 text-center">
                            <button
                              onClick={() => handleSelectJenis(jenis)}
                              className="inline-flex items-center gap-2 border border-blue-600 bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 hover:border-blue-700"
                              type="button"
                            >
                              <Plus className="h-4 w-4" />
                              <Text size="2" weight="medium" className="text-white">
                                Tambah
                              </Text>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
