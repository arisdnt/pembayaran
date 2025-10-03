import { useState, useEffect } from 'react'
import { Text } from '@radix-ui/themes'
import { Users, Receipt, Wallet, AlertCircle, RefreshCw, LayoutDashboard } from 'lucide-react'
import { db } from '../offline/db'
import { useDashboardData } from '../hooks/useDashboardData'
import { DashboardFilters } from '../components/dashboard/DashboardFilters'
import { StatCard } from '../components/dashboard/StatCard'
import { PembayaranChart } from '../components/dashboard/PembayaranChart'
import { StatusPieChart } from '../components/dashboard/StatusPieChart'
import { TagihanTable } from '../components/dashboard/TagihanTable'
import { PembayaranPendingTable } from '../components/dashboard/PembayaranPendingTable'
import { PageLayout } from '../layout/PageLayout'

function DashboardContent() {
  const [filters, setFilters] = useState({
    tahunAjaran: '',
    tingkat: '',
    kelas: '',
    timeRange: 'all'
  })

  const [masterData, setMasterData] = useState({
    tahunAjaranList: [],
    kelasList: [],
    tingkatList: []
  })

  const { data, loading, error, refresh } = useDashboardData(filters)

  useEffect(() => {
    fetchMasterData()
  }, [])

  const fetchMasterData = async () => {
    try {
      const [tahunAll, kelasAll] = await Promise.all([
        db.tahun_ajaran.toArray(),
        db.kelas.toArray()
      ])
      
      // Sort in JavaScript memory instead of using IndexedDB index
      const tahun = (tahunAll || []).sort((a, b) => {
        const dateA = new Date(a.tanggal_mulai || 0)
        const dateB = new Date(b.tanggal_mulai || 0)
        return dateB - dateA // descending (newest first)
      })
      
      const kelas = (kelasAll || []).sort((a, b) => {
        // Sort by tingkat as string (works for "10", "11", "12", etc)
        return (a.tingkat || '').localeCompare(b.tingkat || '')
      })
      
      const uniqueTingkat = [...new Set(kelas.map(k => k.tingkat).filter(Boolean))].sort()
      setMasterData({ tahunAjaranList: tahun, kelasList: kelas, tingkatList: uniqueTingkat })
    } catch (err) {
      console.error('Error fetching master data:', err)
    }
  }

  return (
    <PageLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="shrink-0 bg-white px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            {/* Page Title */}
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-blue-600" />
              <div className="flex flex-col">
                <Text size="4" weight="bold" className="text-slate-900 leading-none">
                  Dashboard
                </Text>
                <Text size="1" className="text-slate-500 leading-none mt-0.5">
                  Ringkasan data pembayaran dan tagihan
                </Text>
              </div>
            </div>

            {/* Filters and Actions */}
            <div className="flex items-center gap-4">
              <DashboardFilters
                  tahunAjaranList={masterData.tahunAjaranList}
                  kelasList={masterData.kelasList}
                  tingkatList={masterData.tingkatList}
                  selectedTahunAjaran={filters.tahunAjaran}
                  onTahunAjaranChange={(val) => setFilters({ ...filters, tahunAjaran: val, tingkat: '', kelas: '' })}
                  selectedTingkat={filters.tingkat}
                  onTingkatChange={(val) => setFilters({ ...filters, tingkat: val, kelas: '' })}
                  selectedKelas={filters.kelas}
                  onKelasChange={(val) => setFilters({ ...filters, kelas: val })}
                  selectedTimeRange={filters.timeRange}
                  onTimeRangeChange={(val) => setFilters({ ...filters, timeRange: val })}
              />

              <button
                  onClick={refresh}
                  disabled={loading}
                  className="flex items-center gap-2 px-3 border border-slate-300 bg-white hover:bg-slate-50 transition-colors disabled:opacity-50 shrink-0"
                  style={{ borderRadius: 0, height: '35px' }}
                  type="button"
                >
                  <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                  <Text size="2" weight="medium" className="text-slate-700">
                    Refresh
                  </Text>
              </button>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="shrink-0 mx-6 mt-4 flex items-start gap-3 bg-red-50 border-2 border-red-200 px-4 py-3">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
            <div>
              <Text size="2" weight="medium" className="text-red-700">Error</Text>
              <Text size="2" className="text-red-600">{error}</Text>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-hidden px-6 py-4">
          <div className="grid grid-cols-4 gap-4 h-full" style={{ gridTemplateRows: 'auto auto 1fr' }}>
            {/* Stats - Row 1 (auto height) */}
            <StatCard title="Total Siswa" value={data.stats.totalSiswa} icon={Users} color="text-blue-600" loading={loading} />
            <StatCard title="Total Tagihan" value={data.stats.totalTagihan} icon={Receipt} color="text-purple-600" loading={loading} />
            <StatCard title="Total Pembayaran" value={data.stats.totalPembayaran} icon={Wallet} color="text-green-600" loading={loading} />
            <StatCard title="Tunggakan" value={data.stats.totalTunggakan} icon={AlertCircle} color="text-red-600" isCurrency loading={loading} />

            {/* Charts - Row 2 (auto height) */}
            <div className="col-span-2 h-64">
              <PembayaranChart data={data.chartData.pembayaranPerBulan} loading={loading} />
            </div>
            <div className="h-64">
              <StatusPieChart data={data.chartData.statusPembayaran} loading={loading} />
            </div>
            
            {/* Pembayaran Pending - Span 2 rows (row 2 & 3) */}
            <div className="col-span-1 row-span-2">
              <PembayaranPendingTable data={data.recentData.pembayaranPending} loading={loading} />
            </div>

            {/* Tagihan Table - Row 3, 3 columns */}
            <div className="col-span-3">
              <TagihanTable data={data.recentData.tagihanTerbaru} loading={loading} />
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export function Dashboard() {
  return <DashboardContent />
}
