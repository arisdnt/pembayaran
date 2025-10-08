import { useState, useEffect } from 'react'
import { Text } from '@radix-ui/themes'
import { LayoutDashboard } from 'lucide-react'
import { db } from '../../offline/db'
import { DashboardFilters } from './components/DashboardFilters'
import { PageLayout } from '../../layout/PageLayout'
import { useDashboardCharts } from './hooks/useDashboardCharts'
import { useDashboardComparisons } from './hooks/useDashboardComparisons'
import { useDashboardFinancials } from './hooks/useDashboardFinancials'
import { GenderPieChart } from './charts/GenderPieChart'
import { ClassBarChart } from './charts/ClassBarChart'
import { PeminatanBarChart } from './charts/PeminatanBarChart'
import { WaliKelasBarChart } from './charts/WaliKelasBarChart'
import { SiswaTrendLineChart } from './charts/SiswaTrendLineChart'
import { PembayaranTrendAreaChart } from './charts/PembayaranTrendAreaChart'
import { TagihanVsPembayaranAreaChart } from './charts/TagihanVsPembayaranAreaChart'
import { TopKelasTunggakanBar } from './charts/TopKelasTunggakanBar'
import { TunggakanByGenderBar } from './charts/TunggakanByGenderBar'

function DashboardContent() {
  const [masterDataReady, setMasterDataReady] = useState(false)
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

  // Wait for master data to be ready before fetching dashboard data
  const { data, loading } = useDashboardCharts(masterDataReady ? filters : null)
  const cmp = useDashboardComparisons(masterDataReady ? filters : null)
  const fin = useDashboardFinancials(masterDataReady ? filters : null)

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
      
      // Mark master data as ready to trigger dashboard data fetch
      setMasterDataReady(true)
    } catch (err) {
      console.error('Error fetching master data:', err)
      // Even if error, mark as ready to show the error state
      setMasterDataReady(true)
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
            </div>
          </div>
        </div>
        {/* Content: charts only, never exceed viewport */}
        <div className="flex-1 overflow-auto px-6 py-4">
          <div className="grid grid-cols-12 gap-4">
            {/* Row A */}
            <div className="col-span-4 h-[320px]"><GenderPieChart data={data?.gender} /></div>
            <div className="col-span-8 h-[320px]"><ClassBarChart data={data?.classDist} /></div>
            {/* Row B (asymmetric widths for better aesthetics) */}
            <div className="col-span-5 h-[360px]"><PeminatanBarChart data={data?.pemDist} /></div>
            <div className="col-span-4 h-[360px]"><WaliKelasBarChart data={data?.waliDist} /></div>
            <div className="col-span-3 h-[360px]"><TunggakanByGenderBar data={fin.data?.tunggakanByGender} /></div>
            {/* Row C – Trends */}
            <div className="col-span-6 h-[380px]"><SiswaTrendLineChart data={cmp.data?.siswaTrend || data?.siswaTrend} compare={cmp.data?.siswaTrendCompare} /></div>
            <div className="col-span-6 h-[380px]"><PembayaranTrendAreaChart data={cmp.data?.bayarTrend || data?.bayarTrend} /></div>
            {/* Row D – Financial insights */}
            <div className="col-span-7 h-[380px]"><TagihanVsPembayaranAreaChart tagihan={fin.data?.tagihanTrend} bayar={cmp.data?.bayarTrend || data?.bayarTrend} /></div>
            <div className="col-span-5 h-[380px]"><TopKelasTunggakanBar data={fin.data?.topKelasTunggakan} /></div>
          </div>
        </div>
      </div>
    </PageLayout>
  )
}

export function Dashboard() {
  return <DashboardContent />
}
