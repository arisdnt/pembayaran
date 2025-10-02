import { useMemo, useState } from 'react'
import { Badge, IconButton, Switch, Text, Button, TextField, Select } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { UserCheck, Clock, Plus, X, Eye } from 'lucide-react'

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

export function WaliKelasTable({
  data,
  isLoading = false,
  isRefreshing = false,
  onEdit,
  onDelete,
  onToggleStatus,
  onAdd,
  selectedItem,
  onSelectItem,
  onViewDetail,
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.nama_lengkap.toLowerCase().includes(query) ||
        (item.nip && item.nip.toLowerCase().includes(query)) ||
        (item.email && item.email.toLowerCase().includes(query)) ||
        item.id.toLowerCase().includes(query)
      )
    }

    if (filterStatus === 'active') {
      filtered = filtered.filter((item) => item.status_aktif)
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter((item) => !item.status_aktif)
    }

    return filtered
  }, [data, searchQuery, filterStatus])

  const stats = useMemo(() => {
    const total = data.length
    const active = data.filter((item) => item.status_aktif).length
    const filtered = filteredData.length
    const lastUpdate = data
      .map((item) => item.diperbarui_pada || item.dibuat_pada)
      .filter(Boolean)
      .sort((a, b) => new Date(b) - new Date(a))
      .at(0)

    return {
      total,
      active,
      filtered,
      lastUpdate: lastUpdate ? formatDateTime(lastUpdate) : 'Belum ada aktivitas',
    }
  }, [data, filteredData])

  const isEmpty = !isLoading && filteredData.length === 0
  const hasActiveFilters = searchQuery.trim() || filterStatus !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
  }

  return (
    <div className="h-full flex flex-col">
      {/* Excel-style container with sharp edges and clean borders */}
      <div className="h-full flex flex-col border border-slate-300 bg-white shadow-lg">
        {/* Toolbar Section - Excel-inspired ribbon */}
        <div className="border-b border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100">
          <div className="flex flex-wrap items-center gap-3 px-4 py-2.5">
            {/* Search */}
            <div className="flex-1 min-w-[240px] max-w-xs">
              <TextField.Root
                placeholder="Cari nama, NIP, atau email..."
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

            {/* Filter Status */}
            <div className="flex items-center gap-2">
              <Select.Root value={filterStatus} onValueChange={setFilterStatus}>
                <Select.Trigger 
                  style={{ borderRadius: 0, minWidth: '130px' }}
                  className="cursor-pointer"
                />
                <Select.Content style={{ borderRadius: 0 }}>
                  <Select.Item value="all">Semua Status</Select.Item>
                  <Select.Item value="active">Aktif</Select.Item>
                  <Select.Item value="inactive">Nonaktif</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            {/* Reset Filter */}
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

            {/* Stats - Excel-style stat cards */}
            <div className="ml-auto flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 shadow-sm">
                <span className="text-slate-600 font-medium">Total:</span>
                <span className="font-bold text-slate-900">{stats.total}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-300 shadow-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-green-500" />
                <span className="text-green-700 font-medium">Aktif:</span>
                <span className="font-bold text-green-900">{stats.active}</span>
              </div>
              {hasActiveFilters && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-300 shadow-sm">
                  <span className="text-blue-700 font-medium">Filter:</span>
                  <span className="font-bold text-blue-900">{stats.filtered}</span>
                </div>
              )}
            </div>

            {/* Button Tambah Baru */}
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
            {isRefreshing && !isLoading ? (
              <div className="pointer-events-none sticky top-0 z-20 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" />
            ) : null}
            <table className="min-w-full table-fixed text-sm">
              <colgroup>{[
                <col key="col-1" style={{ width: '25%' }} />,
                <col key="col-2" style={{ width: '15%' }} />,
                <col key="col-3" style={{ width: '15%' }} />,
                <col key="col-4" style={{ width: '18%' }} />,
                <col key="col-5" style={{ width: '12%' }} />,
                <col key="col-6" style={{ width: '10%' }} />,
                <col key="col-7" style={{ width: '5%' }} />,
              ]}</colgroup>
              <thead>
                <tr className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10 border-b border-slate-300 shadow-sm">
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Nama Lengkap
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    NIP
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    No. Telepon
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Diperbarui
                  </th>
                  <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <tr key={`wali-skeleton-${index}`} className="border-b border-slate-200 bg-white">
                        <td className="px-4 py-3 border-r border-slate-200">
                          <div className="space-y-2">
                            <div className="h-4 w-48 bg-slate-200" />
                            <div className="h-3 w-24 bg-slate-200" />
                          </div>
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200">
                          <div className="h-4 w-32 bg-slate-200" />
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200">
                          <div className="h-4 w-32 bg-slate-200" />
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200">
                          <div className="h-4 w-40 bg-slate-200" />
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200">
                          <div className="h-6 w-24 bg-slate-200" />
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200">
                          <div className="h-3 w-28 bg-slate-200" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="h-6 w-20 bg-slate-200 mx-auto" />
                        </td>
                      </tr>
                    ))
                  : filteredData.map((item) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`group cursor-pointer border-b border-slate-200 ${
                      selectedItem?.id === item.id
                        ? 'bg-blue-100 border-l-4 border-l-blue-600'
                        : 'bg-white hover:bg-blue-50'
                    }`}
                  >
                    <td className="px-4 py-3 border-r border-slate-200">
                      <div className="flex flex-col gap-0.5">
                        <Text size="2" weight="medium" className="text-slate-900 font-sans">
                          {item.nama_lengkap}
                        </Text>
                        <Text size="1" className="text-slate-500 uppercase tracking-wide font-mono text-[0.65rem]">
                          ID: {item.id?.slice(0, 8) ?? '—'}
                        </Text>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" className="text-slate-700 font-mono font-medium">
                        {item.nip || '—'}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" className="text-slate-700 font-sans">
                        {item.nomor_telepon || '—'}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" className="text-slate-700 font-sans">
                        {item.email || '—'}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <div className="flex items-center gap-2.5">
                        <Switch
                          checked={item.status_aktif}
                          onCheckedChange={() => onToggleStatus(item)}
                          size="2"
                        />
                        <Badge
                          variant="soft"
                          color={item.status_aktif ? 'green' : 'gray'}
                          className="text-xs px-2 py-0.5"
                        >
                          {item.status_aktif ? 'Aktif' : 'Nonaktif'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="1" className="text-slate-500 font-mono text-[0.7rem]">
                        {formatDateTime(item.diperbarui_pada || item.dibuat_pada)}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onViewDetail(item)
                          }}
                          className="p-1.5 hover:bg-blue-100 text-blue-600 transition-colors border border-transparent hover:border-blue-300"
                          aria-label={`Lihat ${item.nama_lengkap}`}
                          title="Lihat Detail"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(item)
                          }}
                          className="p-1.5 hover:bg-amber-100 text-amber-600 transition-colors border border-transparent hover:border-amber-300"
                          aria-label={`Edit ${item.nama_lengkap}`}
                          title="Edit"
                        >
                          <Pencil1Icon className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(item)
                          }}
                          className="p-1.5 hover:bg-red-100 text-red-600 transition-colors border border-transparent hover:border-red-300"
                          aria-label={`Hapus ${item.nama_lengkap}`}
                          title="Hapus"
                        >
                          <TrashIcon className="h-3.5 w-3.5" />
                        </button>
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
                              Belum ada data wali kelas
                            </Text>
                            <Text size="2" className="text-slate-400">
                              Tambahkan wali kelas baru melalui tombol di atas untuk mulai mengelola daftar ini.
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
