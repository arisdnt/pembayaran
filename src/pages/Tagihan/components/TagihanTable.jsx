import { useMemo, useState } from 'react'
import { Text, TextField, Select, Badge, Button, IconButton } from '@radix-ui/themes'
import { MagnifyingGlassIcon, Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Receipt, Plus, X, Eye } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

function formatCurrency(value) {
  if (!value) return '—'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(value)
}

export function TagihanTable({
  data,
  isLoading,
  onEdit,
  onDelete,
  onAdd,
  selectedItem,
  onSelectItem,
  onViewDetail,
  kelasList = [],
  tahunAjaranList = [],
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [filterTahunAjaran, setFilterTahunAjaran] = useState('all')
  const [filterTingkatKelas, setFilterTingkatKelas] = useState('all')
  const [filterJudul, setFilterJudul] = useState('all')

  const handleTahunAjaranChange = (value) => {
    setFilterTahunAjaran(value)
    setFilterJudul('all')
  }

  const handleTingkatKelasChange = (value) => {
    setFilterTingkatKelas(value)
    setFilterJudul('all')
  }

  const tingkatKelasOptions = useMemo(() => {
    const siswaLatestTingkat = new Map()
    
    data.forEach(item => {
      const rks = item.riwayat_kelas_siswa
      if (!rks?.siswa?.id || !rks?.kelas?.tingkat || !rks?.tanggal_masuk) return
      
      const siswaId = rks.siswa.id
      const currentLatest = siswaLatestTingkat.get(siswaId)
      
      if (!currentLatest || new Date(rks.tanggal_masuk) > new Date(currentLatest.tanggal_masuk)) {
        siswaLatestTingkat.set(siswaId, {
          tingkat: rks.kelas.tingkat,
          tanggal_masuk: rks.tanggal_masuk
        })
      }
    })
    
    const uniqueTingkat = [...new Set(Array.from(siswaLatestTingkat.values()).map(v => v.tingkat))]
    return ['all', ...uniqueTingkat.sort()]
  }, [data])

  const judulOptions = useMemo(() => {
    let filteredForJudul = [...data]

    if (filterTahunAjaran !== 'all') {
      filteredForJudul = filteredForJudul.filter(
        (item) => item.riwayat_kelas_siswa?.tahun_ajaran?.id === filterTahunAjaran
      )
    }

    if (filterTingkatKelas !== 'all') {
      filteredForJudul = filteredForJudul.filter(
        (item) => item.riwayat_kelas_siswa?.kelas?.tingkat === filterTingkatKelas
      )
    }

    const uniqueJudul = [...new Set(filteredForJudul.map(item => item.judul).filter(Boolean))]
    return ['all', ...uniqueJudul.sort()]
  }, [data, filterTahunAjaran, filterTingkatKelas])

  const filteredData = useMemo(() => {
    let filtered = [...data]

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) =>
        item.nomor_tagihan?.toLowerCase().includes(query) ||
        item.judul?.toLowerCase().includes(query) ||
        item.riwayat_kelas_siswa?.siswa?.nama_lengkap?.toLowerCase().includes(query) ||
        item.riwayat_kelas_siswa?.siswa?.nisn?.toLowerCase().includes(query)
      )
    }

    if (filterTahunAjaran !== 'all') {
      filtered = filtered.filter(
        (item) => item.riwayat_kelas_siswa?.tahun_ajaran?.id === filterTahunAjaran
      )
    }

    if (filterTingkatKelas !== 'all') {
      filtered = filtered.filter(
        (item) => item.riwayat_kelas_siswa?.kelas?.tingkat === filterTingkatKelas
      )
    }

    if (filterJudul !== 'all') {
      filtered = filtered.filter((item) => item.judul === filterJudul)
    }

    return filtered
  }, [data, searchQuery, filterTahunAjaran, filterTingkatKelas, filterJudul])

  const isEmpty = filteredData.length === 0
  const hasActiveFilters =
    searchQuery.trim() || filterTahunAjaran !== 'all' || filterTingkatKelas !== 'all' || filterJudul !== 'all'

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilterTahunAjaran('all')
    setFilterTingkatKelas('all')
    setFilterJudul('all')
  }

  return (
    <div className="h-full flex flex-col border border-slate-300 bg-white shadow-lg">
      {/* Toolbar - Excel style */}
      <div className="border-b border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-3 shrink-0">
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[240px] max-w-xs">
            <TextField.Root
              placeholder="Cari nomor, judul, siswa..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              size="2"
              style={{ borderRadius: 0 }}
              className="border-slate-300"
            >
              <TextField.Slot>
                <MagnifyingGlassIcon height="16" width="16" />
              </TextField.Slot>
              {searchQuery && (
                <TextField.Slot>
                  <button
                    onClick={() => setSearchQuery('')}
                    className="cursor-pointer text-slate-400 hover:text-slate-600"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </TextField.Slot>
              )}
            </TextField.Root>
          </div>

          {/* Filter Tahun Ajaran */}
          <Select.Root value={filterTahunAjaran} onValueChange={handleTahunAjaranChange}>
            <Select.Trigger
              placeholder="Pilih Tahun Ajaran"
              style={{ borderRadius: 0, minWidth: '160px' }}
              className="border border-slate-300 bg-white text-slate-700 cursor-pointer"
            />
            <Select.Content style={{ borderRadius: 0 }}>
              <Select.Item value="all">📅 Semua Tahun Ajaran</Select.Item>
              {tahunAjaranList.map((tahun) => (
                <Select.Item key={tahun.id} value={tahun.id}>
                  {tahun.nama}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          {/* Filter Tingkat Kelas */}
          <Select.Root value={filterTingkatKelas} onValueChange={handleTingkatKelasChange}>
            <Select.Trigger
              placeholder="Pilih Tingkat Kelas"
              style={{ borderRadius: 0, minWidth: '160px' }}
              className="border border-slate-300 bg-white text-slate-700 cursor-pointer"
            />
            <Select.Content style={{ borderRadius: 0 }}>
              <Select.Item value="all">🏫 Semua Tingkat</Select.Item>
              {tingkatKelasOptions.slice(1).map((tingkat) => (
                <Select.Item key={tingkat} value={tingkat}>
                  Tingkat {tingkat}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          {/* Filter Judul Tagihan */}
          <Select.Root value={filterJudul} onValueChange={setFilterJudul}>
            <Select.Trigger
              placeholder="Pilih Judul Tagihan"
              style={{ borderRadius: 0, minWidth: '180px' }}
              className="border border-slate-300 bg-white text-slate-700 cursor-pointer"
            />
            <Select.Content style={{ borderRadius: 0 }}>
              <Select.Item value="all">📝 Semua Judul Tagihan</Select.Item>
              {judulOptions.slice(1).map((judul) => (
                <Select.Item key={judul} value={judul}>
                  {judul}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Root>

          {/* Add Button */}
          <div className="ml-auto">
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
              Tambah Tagihan
            </Button>
          </div>
        </div>
      </div>

      {/* Table Container */}
      <div className="flex-1 overflow-auto min-h-0">
        {isLoading ? (
          <div className="p-4 space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 border-b border-slate-200 py-4">
                <div className="h-4 w-24 bg-slate-200" />
                <div className="h-4 w-32 bg-slate-200" />
                <div className="h-4 w-28 bg-slate-200" />
                <div className="h-4 w-20 bg-slate-200" />
              </div>
            ))}
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10">
              <tr className="border-b-2 border-slate-300">
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    No. Tagihan
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Judul
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Siswa
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Kelas
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Total Tagihan
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Dibayar
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Kekurangan
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Tgl Tagihan
                  </Text>
                </th>
                <th className="px-4 py-3 text-left border-r border-slate-200">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Jatuh Tempo
                  </Text>
                </th>
                <th className="px-4 py-3 text-center">
                  <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider">
                    Aksi
                  </Text>
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => {
                const isSelected = selectedItem?.id === item.id
                const isEven = index % 2 === 0

                return (
                  <tr
                    key={item.id}
                    onClick={() => onSelectItem(item)}
                    className={`border-b border-slate-200 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-100 border-l-4 border-l-blue-600'
                        : isEven
                        ? 'bg-white hover:bg-blue-50'
                        : 'bg-slate-50 hover:bg-blue-50'
                    }`}
                  >
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" weight="medium" className="text-slate-900 font-mono">
                        {item.nomor_tagihan || '—'}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" weight="medium" className="text-slate-900">
                        {item.judul || '—'}
                      </Text>
                      {item.deskripsi && (
                        <Text size="1" className="text-slate-500 line-clamp-1 mt-0.5">
                          {item.deskripsi}
                        </Text>
                      )}
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <div>
                        <Text size="2" weight="medium" className="text-slate-900 block">
                          {item.riwayat_kelas_siswa?.siswa?.nama_lengkap || '—'}
                        </Text>
                        {item.riwayat_kelas_siswa?.siswa?.nisn && (
                          <Text size="1" className="text-red-600 font-mono block mt-0.5">
                            NISN: {item.riwayat_kelas_siswa.siswa.nisn}
                          </Text>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" className="text-slate-700">
                        {item.riwayat_kelas_siswa?.kelas
                          ? `${item.riwayat_kelas_siswa.kelas.tingkat} ${item.riwayat_kelas_siswa.kelas.nama_sub_kelas}`
                          : '—'}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <div>
                        <Text size="2" weight="bold" className="text-slate-900 block">
                          {formatCurrency(item.total_tagihan)}
                        </Text>
                        {item.rincian_tagihan && item.rincian_tagihan.length > 0 && (
                          <Text size="1" className="text-red-600 block mt-0.5">
                            {item.rincian_tagihan.length} item
                          </Text>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" weight="bold" className="text-green-700">
                        {formatCurrency(item.total_dibayar || 0)}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" weight="bold" className={item.kekurangan > 0 ? "text-red-600" : "text-green-600"}>
                        {formatCurrency(item.kekurangan || 0)}
                      </Text>
                      {item.kekurangan <= 0 && (
                        <Badge color="green" variant="soft" size="1" style={{ borderRadius: 0 }} className="mt-1">
                          LUNAS
                        </Badge>
                      )}
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" className="text-slate-700">
                        {formatDate(item.tanggal_tagihan)}
                      </Text>
                    </td>
                    <td className="px-4 py-3 border-r border-slate-200">
                      <Text size="2" className="text-slate-700">
                        {formatDate(item.tanggal_jatuh_tempo)}
                      </Text>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center gap-1">
                        {onViewDetail && (
                          <IconButton
                            size="1"
                            variant="soft"
                            onClick={(e) => {
                              e.stopPropagation()
                              onViewDetail(item)
                            }}
                            className="cursor-pointer hover:bg-slate-100 text-slate-700 border border-slate-200"
                            style={{ borderRadius: 0 }}
                            aria-label={`Detail ${item.nomor_tagihan}`}
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </IconButton>
                        )}
                        <IconButton
                          size="1"
                          variant="soft"
                          onClick={(e) => {
                            e.stopPropagation()
                            onEdit(item)
                          }}
                          className="cursor-pointer hover:bg-blue-100 text-blue-700 border border-blue-200"
                          style={{ borderRadius: 0 }}
                          aria-label={`Edit ${item.nomor_tagihan}`}
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
                          aria-label={`Hapus ${item.nomor_tagihan}`}
                        >
                          <TrashIcon />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                )
              })}
              {isEmpty && (
                <tr>
                  <td colSpan={8} className="py-16">
                    <div className="flex flex-col items-center justify-center text-center">
                      {hasActiveFilters ? (
                        <>
                          <div className="mb-4 p-4 bg-slate-100 border border-slate-300 inline-block">
                            <MagnifyingGlassIcon className="h-12 w-12 text-slate-400" />
                          </div>
                          <Text size="3" weight="medium" className="text-slate-600 mb-2">
                            Tidak ada data yang sesuai
                          </Text>
                          <Text size="2" className="text-slate-500 mb-4">
                            Coba ubah kata kunci pencarian
                          </Text>
                          <button
                            onClick={handleClearFilters}
                            className="px-4 py-2 border border-slate-400 bg-white text-slate-700 hover:bg-slate-50 font-medium"
                            type="button"
                          >
                            Reset Pencarian
                          </button>
                        </>
                      ) : (
                        <>
                          <div className="mb-4 p-4 bg-slate-100 border border-slate-300 inline-block">
                            <Receipt className="h-12 w-12 text-slate-400" />
                          </div>
                          <Text size="3" weight="medium" className="text-slate-600 mb-2">
                            Belum ada tagihan
                          </Text>
                          <Text size="2" className="text-slate-500">
                            Tambahkan tagihan baru melalui tombol di atas
                          </Text>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Custom Scrollbar */}
      <style>{`
        .h-full.flex.flex-col.border.border-slate-300 ::-webkit-scrollbar {
          width: 12px;
          height: 12px;
        }
        .h-full.flex.flex-col.border.border-slate-300 ::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-left: 1px solid #cbd5e1;
        }
        .h-full.flex.flex-col.border.border-slate-300 ::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border: 2px solid #f1f5f9;
        }
        .h-full.flex.flex-col.border.border-slate-300 ::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  )
}
