import { useMemo, useState } from 'react'
import { Badge, IconButton, Text, Button, TextField, Select } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { UserCheck, Clock, Plus, X } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta',
  })
}

function getStatusBadgeColor(status) {
  switch (status) {
    case 'aktif': return 'green'
    case 'selesai': return 'gray'
    default: return 'gray'
  }
}

function getStatusLabel(status) {
  switch (status) {
    case 'aktif': return 'Aktif'
    case 'selesai': return 'Selesai'
    default: return status
  }
}

export function RiwayatWaliKelasTable({ data, onEdit, onDelete, onAdd, selectedItem, onSelectItem }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.wali_kelas?.nama_lengkap.toLowerCase().includes(query) ||
        item.wali_kelas?.nip?.toLowerCase().includes(query) ||
        item.kelas?.nama_sub_kelas.toLowerCase().includes(query) ||
        item.tahun_ajaran?.nama.toLowerCase().includes(query)
      )
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((item) => item.status === filterStatus)
    }

    return filtered
  }, [data, searchQuery, filterStatus])

  const stats = useMemo(() => {
    const total = data.length
    const aktif = data.filter((item) => item.status === 'aktif').length
    const filtered = filteredData.length

    return { total, aktif, filtered }
  }, [data, filteredData])

  const isEmpty = filteredData.length === 0
  const hasActiveFilters = searchQuery.trim() || filterStatus !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
  }

  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex flex-col border border-slate-200/80 bg-white/80 backdrop-blur">
        <div className="border-b border-slate-200/80 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex flex-wrap items-center gap-4 px-6 py-4">
            <div className="flex-1 min-w-[240px] max-w-xs">
              <TextField.Root
                placeholder="Cari wali kelas, kelas, tahun..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="2"
                style={{ borderRadius: 0 }}
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
                {searchQuery && (
                  <TextField.Slot>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="cursor-pointer text-slate-400 hover:text-slate-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </TextField.Slot>
                )}
              </TextField.Root>
            </div>

            <div className="flex items-center gap-2">
              <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
                <Select.Trigger 
                  style={{ borderRadius: 0, minWidth: '140px' }}
                  className="cursor-pointer"
                />
                <Select.Content style={{ borderRadius: 0 }}>
                  <Select.Item value="all">Semua Status</Select.Item>
                  <Select.Item value="aktif">Aktif</Select.Item>
                  <Select.Item value="selesai">Selesai</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            {hasActiveFilters && (
              <Button
                onClick={handleClearFilters}
                variant="soft"
                color="gray"
                size="2"
                style={{ borderRadius: 0 }}
                className="cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <div className="ml-auto flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-white border border-slate-200">
                <span className="text-slate-500">Total:</span>
                <span className="font-semibold text-slate-900">{stats.total}</span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 border border-emerald-200">
                <span className="inline-flex h-1.5 w-1.5 bg-emerald-500" />
                <span className="text-emerald-700">Aktif:</span>
                <span className="font-semibold text-emerald-900">{stats.aktif}</span>
              </div>
              {hasActiveFilters && (
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 border border-blue-200">
                  <span className="text-blue-700">Ditampilkan:</span>
                  <span className="font-semibold text-blue-900">{stats.filtered}</span>
                </div>
              )}
            </div>

            <div>
              <Button
                onClick={onAdd}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white"
                size="2"
                style={{ borderRadius: 0 }}
              >
                <Plus className="h-4 w-4" />
                Tambah Baru
              </Button>
            </div>
          </div>
        </div>

        <div className="relative flex-1 min-h-0">
          <div className="h-full overflow-auto">
            <table className="min-w-full table-fixed text-sm">
              <colgroup>{[
                <col key="col-1" style={{ width: '22%' }} />,
                <col key="col-2" style={{ width: '18%' }} />,
                <col key="col-3" style={{ width: '18%' }} />,
                <col key="col-4" style={{ width: '13%' }} />,
                <col key="col-5" style={{ width: '13%' }} />,
                <col key="col-6" style={{ width: '11%' }} />,
                <col key="col-7" style={{ width: '5%' }} />,
              ]}</colgroup>
              <thead>
                <tr className="bg-white/95 backdrop-blur sticky top-0 z-10 border-b border-slate-200">
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Nama Wali Kelas
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Kelas
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Tahun Ajaran
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Tgl Mulai
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Tgl Selesai
                  </th>
                  <th className="px-6 py-3 text-left text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-slate-500">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`group transition-colors cursor-pointer ${
                      selectedItem?.id === item.id
                        ? 'bg-blue-50 hover:bg-blue-100'
                        : 'hover:bg-indigo-50/40'
                    }`}
                  >
                    <td className="px-6 py-4 align-middle">
                      <div className="flex flex-col gap-1">
                        <Text size="3" weight="medium" className="text-slate-900">
                          {item.wali_kelas?.nama_lengkap || '—'}
                        </Text>
                        {item.wali_kelas?.nip && (
                          <Text size="1" className="text-slate-500 uppercase tracking-wider font-mono">
                            NIP: {item.wali_kelas.nip}
                          </Text>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Text size="2" className="text-slate-700">
                        {item.kelas ? `${item.kelas.tingkat} ${item.kelas.nama_sub_kelas}` : '—'}
                      </Text>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Text size="2" className="text-slate-700">
                        {item.tahun_ajaran?.nama || '—'}
                      </Text>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Text size="2" className="text-slate-700">
                        {formatDate(item.tanggal_mulai)}
                      </Text>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Text size="2" className="text-slate-700">
                        {formatDate(item.tanggal_selesai)}
                      </Text>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <Badge
                        variant="soft"
                        color={getStatusBadgeColor(item.status)}
                        className="text-xs"
                      >
                        {getStatusLabel(item.status)}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 align-middle">
                      <div className="flex justify-end gap-2">
                        <IconButton
                          size="1"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(item)
                          }}
                          className="cursor-pointer hover:bg-blue-50 text-blue-600"
                          aria-label="Edit"
                        >
                          <Pencil1Icon />
                        </IconButton>
                        <IconButton
                          size="1"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(item)
                          }}
                          className="cursor-pointer hover:bg-red-50 text-red-600"
                          aria-label="Hapus"
                        >
                          <TrashIcon />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
                {isEmpty ? (
                  <tr>
                    <td colSpan={7} className="relative">
                      <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400">
                        {hasActiveFilters ? (
                          <>
                            <MagnifyingGlassIcon className="h-12 w-12 text-slate-300 mb-4" />
                            <Text size="3" className="text-slate-500 mb-1">
                              Tidak ada data yang sesuai
                            </Text>
                            <Text size="2" className="text-slate-400 mb-4">
                              Coba ubah kata kunci pencarian atau filter yang Anda gunakan
                            </Text>
                            <Button
                              onClick={handleClearFilters}
                              variant="soft"
                              size="2"
                              style={{ borderRadius: 0 }}
                              className="cursor-pointer"
                            >
                              Reset Pencarian
                            </Button>
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-12 w-12 text-slate-300 mb-4" />
                            <Text size="3" className="text-slate-500 mb-1">
                              Belum ada data riwayat wali kelas
                            </Text>
                            <Text size="2" className="text-slate-400">
                              Tambahkan riwayat baru melalui tombol di atas untuk mulai mengelola daftar ini.
                            </Text>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
