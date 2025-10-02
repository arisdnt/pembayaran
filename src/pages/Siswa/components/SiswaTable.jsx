import { useEffect, useMemo, useState } from 'react'
import { Badge, IconButton, Switch, Text, Button, TextField, Select } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon, MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { Clock, Plus, X, Users, Eye } from 'lucide-react'

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

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

function formatCurrency(amount) {
  if (!amount) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function SiswaTable({
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
  const [filterTahunAjaran, setFilterTahunAjaran] = useState('all')
  const [filterTingkat, setFilterTingkat] = useState('all')
  const [filterKelas, setFilterKelas] = useState('all')

  const {
    tahunAjaranOptions,
    tingkatOptions,
    kelasOptions,
  } = useMemo(() => {
    const tahunAjaranMap = new Map()
    const tingkatSet = new Set()
    const kelasMap = new Map()

    data.forEach((item) => {
      const tahun = item.tahun_ajaran_terbaru
      if (tahun?.id && !tahunAjaranMap.has(tahun.id)) {
        tahunAjaranMap.set(tahun.id, {
          value: tahun.id,
          label: tahun.nama || 'Tanpa Tahun Ajaran',
        })
      }

      const tingkat = item.kelas_terbaru?.tingkat
      if (tingkat) {
        tingkatSet.add(String(tingkat))
      }

      const kelas = item.kelas_terbaru
      if (kelas?.id && !kelasMap.has(kelas.id)) {
        const label = [kelas.tingkat, kelas.nama_sub_kelas]
          .filter(Boolean)
          .join(' ') || 'Tanpa Kelas'
        kelasMap.set(kelas.id, {
          value: kelas.id,
          label,
          tingkat: kelas.tingkat ? String(kelas.tingkat) : null,
        })
      }
    })

    return {
      tahunAjaranOptions: Array.from(tahunAjaranMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
      tingkatOptions: Array.from(tingkatSet).sort((a, b) => a.localeCompare(b, undefined, { numeric: true })),
      kelasOptions: Array.from(kelasMap.values()).sort((a, b) => a.label.localeCompare(b.label)),
    }
  }, [data])

  const filteredKelasOptions = useMemo(() => {
    if (filterTingkat === 'all') return kelasOptions
    return kelasOptions.filter((option) => option.tingkat === filterTingkat)
  }, [kelasOptions, filterTingkat])

  useEffect(() => {
    if (filterTahunAjaran !== 'all' && !tahunAjaranOptions.some((option) => option.value === filterTahunAjaran)) {
      setFilterTahunAjaran('all')
    }
  }, [filterTahunAjaran, tahunAjaranOptions])

  useEffect(() => {
    if (filterTingkat !== 'all' && !tingkatOptions.includes(filterTingkat)) {
      setFilterTingkat('all')
    }
  }, [filterTingkat, tingkatOptions])

  useEffect(() => {
    if (filterKelas !== 'all' && !filteredKelasOptions.some((option) => option.value === filterKelas)) {
      setFilterKelas('all')
    }
  }, [filterKelas, filteredKelasOptions])

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.nama_lengkap.toLowerCase().includes(query) ||
        (item.nisn && item.nisn.toLowerCase().includes(query)) ||
        item.id.toLowerCase().includes(query)
      )
    }

    if (filterStatus === 'active') {
      filtered = filtered.filter((item) => item.status_aktif)
    } else if (filterStatus === 'inactive') {
      filtered = filtered.filter((item) => !item.status_aktif)
    }

    if (filterTahunAjaran !== 'all') {
      filtered = filtered.filter((item) => item.tahun_ajaran_terbaru?.id === filterTahunAjaran)
    }

    if (filterTingkat !== 'all') {
      filtered = filtered.filter((item) => String(item.kelas_terbaru?.tingkat || '') === filterTingkat)
    }

    if (filterKelas !== 'all') {
      filtered = filtered.filter((item) => item.kelas_terbaru?.id === filterKelas)
    }

    return filtered
  }, [data, searchQuery, filterStatus, filterTahunAjaran, filterTingkat, filterKelas])

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
  const hasActiveFilters = Boolean(
    searchQuery.trim() ||
    filterStatus !== 'all' ||
    filterTahunAjaran !== 'all' ||
    filterTingkat !== 'all' ||
    filterKelas !== 'all'
  )

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterStatus('all')
    setFilterTahunAjaran('all')
    setFilterTingkat('all')
    setFilterKelas('all')
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
                placeholder="Cari nama atau NISN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="2"
                style={{
                  borderRadius: 0,
                  border: '1px solid #cbd5e1',
                  backgroundColor: '#ffffff'
                }}
                className="font-sans"
              >
                <TextField.Slot>
                  <MagnifyingGlassIcon height="16" width="16" />
                </TextField.Slot>
                {searchQuery && (
                  <TextField.Slot>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="cursor-pointer text-slate-400 hover:text-slate-700 transition-colors"
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
                  style={{ 
                    borderRadius: 0, 
                    minWidth: '140px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff'
                  }}
                  className="cursor-pointer font-sans"
                />
                <Select.Content style={{ borderRadius: 0 }}>
                  <Select.Item value="all">📋 Semua Status</Select.Item>
                  <Select.Item value="active">✅ Aktif</Select.Item>
                  <Select.Item value="inactive">⭕ Nonaktif</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            {/* Filter Tahun Ajaran */}
            <div className="flex items-center gap-2">
              <Select.Root value={filterTahunAjaran} onValueChange={setFilterTahunAjaran}>
                <Select.Trigger
                  style={{
                    borderRadius: 0,
                    minWidth: '160px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff'
                  }}
                  className="cursor-pointer font-sans"
                />
                <Select.Content style={{ borderRadius: 0 }}>
                  <Select.Item value="all">📅 Semua Tahun Ajaran</Select.Item>
                  {tahunAjaranOptions.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>

            {/* Filter Tingkat */}
            <div className="flex items-center gap-2">
              <Select.Root value={filterTingkat} onValueChange={setFilterTingkat}>
                <Select.Trigger
                  style={{
                    borderRadius: 0,
                    minWidth: '140px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff'
                  }}
                  className="cursor-pointer font-sans"
                />
                <Select.Content style={{ borderRadius: 0 }}>
                  <Select.Item value="all">🏷️ Semua Tingkat</Select.Item>
                  {tingkatOptions.map((option) => (
                    <Select.Item key={option} value={option}>
                      Tingkat {option}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            </div>

            {/* Filter Kelas */}
            <div className="flex items-center gap-2">
              <Select.Root value={filterKelas} onValueChange={setFilterKelas}>
                <Select.Trigger
                  style={{
                    borderRadius: 0,
                    minWidth: '180px',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#ffffff'
                  }}
                  className="cursor-pointer font-sans"
                />
                <Select.Content style={{ borderRadius: 0 }}>
                  <Select.Item value="all">🏫 Semua Kelas</Select.Item>
                  {filteredKelasOptions.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
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
                className="cursor-pointer hover:bg-slate-200 transition-colors"
              >
                <X className="h-4 w-4" />
                Reset
              </Button>
            )}

            {/* Stats - Excel-style status bar */}
            <div className="ml-auto flex items-center gap-1.5 text-xs font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 shadow-sm">
                <span className="text-slate-600">Total:</span>
                <span className="font-bold text-slate-900">{stats.total}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 shadow-sm">
                <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600" />
                <span className="text-emerald-700">Aktif:</span>
                <span className="font-bold text-emerald-900">{stats.active}</span>
              </div>
              {isRefreshing && (
                <div className="flex items-center gap-1 px-3 py-1.5 bg-sky-50 border border-sky-200 shadow-sm text-sky-700">
                  <span className="inline-flex h-2 w-2 rounded-full bg-sky-500 animate-pulse" />
                  <span>Menyegarkan…</span>
                </div>
              )}
              {hasActiveFilters && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-300 shadow-sm">
                  <span className="text-blue-700">Tampil:</span>
                  <span className="font-bold text-blue-900">{stats.filtered}</span>
                </div>
              )}
            </div>

            {/* Button Tambah Baru - Excel-style button */}
            <div>
              <Button
                onClick={onAdd}
                className="cursor-pointer text-white font-medium shadow-sm hover:shadow transition-all"
                size="2"
                style={{ 
                  borderRadius: 0,
                  backgroundColor: '#0066cc',
                  border: '1px solid #0052a3'
                }}
              >
                <Plus className="h-4 w-4" />
                Tambah Baru
              </Button>
            </div>
          </div>
        </div>

        {/* Table Container with Excel-style grid */}
        <div className="relative flex-1 min-h-0">
          <div className="h-full overflow-auto excel-scrollbar">
            <table className="min-w-full table-fixed text-sm border-collapse">
              <colgroup>{[
                <col key="col-1" style={{ width: '15%' }} />,
                <col key="col-2" style={{ width: '10%' }} />,
                <col key="col-3" style={{ width: '8%' }} />,
                <col key="col-4" style={{ width: '10%' }} />,
                <col key="col-5" style={{ width: '8%' }} />,
                <col key="col-6" style={{ width: '8%' }} />,
                <col key="col-7" style={{ width: '10%' }} />,
                <col key="col-8" style={{ width: '9%' }} />,
                <col key="col-9" style={{ width: '9%' }} />,
                <col key="col-10" style={{ width: '8%' }} />,
                <col key="col-11" style={{ width: '8%' }} />,
                <col key="col-12" style={{ width: '5%' }} />,
              ]}</colgroup>
              <thead>
                {/* Excel-style header with freeze pane effect */}
                <tr className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10 border-b border-slate-300 shadow-sm">
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    <div className="flex items-center gap-2">
                      Nama Siswa
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    NISN
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Tgl Lahir
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    No. WhatsApp Wali
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Kelas
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Tahun Ajaran
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Total Tagihan
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Total Dibayar
                  </th>
                  <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">
                    Tunggakan
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
              <tbody>
                {isLoading
                  ? Array.from({ length: 6 }).map((_, index) => (
                      <tr key={`siswa-skeleton-${index}`} className="border-b border-slate-200 bg-white">
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
                          <div className="h-4 w-24 bg-slate-200" />
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200">
                          <div className="h-4 w-40 bg-slate-200" />
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200">
                          <div className="h-4 w-24 bg-slate-200" />
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200">
                          <div className="h-4 w-32 bg-slate-200" />
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200">
                          <div className="h-4 w-28 bg-slate-200" />
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200">
                          <div className="h-4 w-28 bg-slate-200" />
                        </td>
                        <td className="px-4 py-3 border-r border-slate-200">
                          <div className="h-4 w-28 bg-slate-200" />
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
                  : filteredData.map((item, index) => (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`group cursor-pointer border-b border-slate-200 ${
                      selectedItem?.id === item.id
                        ? 'bg-blue-100 border-l-4 border-l-blue-600'
                        : index % 2 === 0
                          ? 'bg-white hover:bg-blue-50'
                          : 'bg-slate-50 hover:bg-blue-50'
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
                        {item.nisn || '—'}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" className="text-slate-700 font-sans">
                        {formatDate(item.tanggal_lahir)}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" className="text-slate-700 font-mono">
                        {item.nomor_whatsapp_wali || '—'}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" className="text-slate-700 font-sans">
                        {item.kelas_terbaru ? `${item.kelas_terbaru.tingkat} ${item.kelas_terbaru.nama_sub_kelas}` : '—'}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" className="text-slate-700 font-sans">
                        {item.tahun_ajaran_terbaru?.nama || '—'}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" weight="bold" className="text-slate-900 font-mono">
                        {formatCurrency(item.total_tagihan || 0)}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" weight="bold" className="text-green-700 font-mono">
                        {formatCurrency(item.total_dibayar || 0)}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" weight="bold" className={item.total_tunggakan > 0 ? "text-red-600 font-mono" : "text-green-600 font-mono"}>
                        {formatCurrency(item.total_tunggakan || 0)}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <div className="flex items-center gap-2.5">
                        <Switch
                          checked={item.status_aktif}
                          onCheckedChange={() => onToggleStatus(item)}
                          size="2"
                          className="cursor-pointer focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                          style={{ outline: 'none', boxShadow: 'none' }}
                        />
                        <Badge
                          variant="solid"
                          color={item.status_aktif ? 'green' : 'gray'}
                          className="text-[0.7rem] font-semibold px-2"
                          style={{ borderRadius: 0 }}
                        >
                          {item.status_aktif ? '✓ Aktif' : '○ Nonaktif'}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <div className="flex items-center gap-1.5 text-slate-600">
                        <Clock className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="text-xs font-sans">{formatDateTime(item.diperbarui_pada || item.dibuat_pada)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex justify-center gap-1">
                        <IconButton
                          size="1"
                          variant="soft"
                          onClick={(e) => {
                            e.stopPropagation()
                            onViewDetail && onViewDetail(item)
                          }}
                          className="cursor-pointer hover:bg-slate-100 text-slate-700 border border-slate-200"
                          style={{ borderRadius: 0 }}
                          aria-label={`Detail ${item.nama_lengkap}`}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </IconButton>
                        <IconButton
                          size="1"
                          variant="soft"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(item)
                          }}
                          className="cursor-pointer hover:bg-blue-100 text-blue-700 border border-blue-200"
                          style={{ borderRadius: 0 }}
                          aria-label={`Edit ${item.nama_lengkap}`}
                        >
                          <Pencil1Icon />
                        </IconButton>
                        <IconButton
                          size="1"
                          variant="soft"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(item)
                          }}
                          className="cursor-pointer hover:bg-red-100 text-red-700 border border-red-200"
                          style={{ borderRadius: 0 }}
                          aria-label={`Hapus ${item.nama_lengkap}`}
                        >
                          <TrashIcon />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                  ))}
                {isEmpty ? (
                  <tr>
                    <td colSpan={12} className="relative border-r-0">
                      <div className="flex flex-col items-center justify-center py-20 text-center text-slate-400 bg-slate-50">
                        {hasActiveFilters ? (
                          <>
                            <div className="mb-4 p-4 bg-slate-100 border border-slate-300">
                              <MagnifyingGlassIcon className="h-12 w-12 text-slate-400" />
                            </div>
                            <Text size="4" weight="medium" className="text-slate-600 mb-2">
                              Tidak ada data yang sesuai
                            </Text>
                            <Text size="2" className="text-slate-500 mb-5">
                              Coba ubah kata kunci pencarian atau filter yang Anda gunakan
                            </Text>
                            <Button
                              onClick={handleClearFilters}
                              variant="soft"
                              size="2"
                              style={{ borderRadius: 0 }}
                              className="cursor-pointer shadow-sm"
                            >
                              Reset Pencarian
                            </Button>
                          </>
                        ) : (
                          <>
                            <div className="mb-4 p-4 bg-slate-100 border border-slate-300">
                              <Users className="h-12 w-12 text-slate-400" />
                            </div>
                            <Text size="4" weight="medium" className="text-slate-600 mb-2">
                              Belum ada data siswa
                            </Text>
                            <Text size="2" className="text-slate-500">
                              Tambahkan siswa baru melalui tombol di atas untuk mulai mengelola daftar ini.
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

      {/* Excel-style scrollbar & Switch styling */}
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
        
        /* Remove focus outline from Switch */
        button[role="switch"],
        button[role="switch"]:focus,
        button[role="switch"]:focus-visible,
        button[role="switch"]:active {
          outline: none !important;
          box-shadow: none !important;
          border: none !important;
        }
        
        /* Remove Radix UI default focus styles */
        .rt-SwitchRoot:focus,
        .rt-SwitchRoot:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
      `}</style>
    </div>
  )
}
