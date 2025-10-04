import { Text } from '@radix-ui/themes'
import { Receipt, TrendingUp, TrendingDown, AlertCircle, CheckCircle2, Clock } from 'lucide-react'
import { useRiwayatTagihan } from '../../../hooks/useRiwayatTagihan'

function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0)
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

export function RiwayatTagihanSection({ riwayatId }) {
  const { list, summary, loading } = useRiwayatTagihan(riwayatId)

  // Section component
  const Section = ({ title, icon: Icon, children, className = '' }) => (
    <div className={`border-b border-slate-200 pb-4 mb-4 ${className}`}>
      <div className="flex items-center gap-1.5 mb-3">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-500" />}
        <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider text-[0.65rem]">
          {title}
        </Text>
      </div>
      <div className="ml-5 space-y-2">
        {children}
      </div>
    </div>
  )

  // Stat card component
  const StatCard = ({ label, value, color = 'blue', icon: Icon }) => {
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-200 text-blue-900',
      green: 'bg-green-50 border-green-200 text-green-900',
      red: 'bg-red-50 border-red-200 text-red-900',
      gray: 'bg-gray-50 border-gray-200 text-gray-900',
    }

    return (
      <div className={`border-2 ${colorClasses[color]} px-3 py-2`}>
        <div className="flex items-center gap-1 mb-1">
          {Icon && <Icon className="h-3 w-3" />}
          <Text size="1" className="uppercase tracking-wide text-[0.65rem]">
            {label}
          </Text>
        </div>
        <Text size="2" weight="bold" className="leading-none font-mono">
          {value}
        </Text>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-24 bg-slate-200" />
        <div className="h-32 bg-slate-200" />
      </div>
    )
  }

  return (
    <div className="space-y-1">
      {/* Summary Cards */}
      <Section title="Ringkasan Tagihan" icon={Receipt}>
        <div className="grid grid-cols-2 gap-2">
          <StatCard 
            label="Total Tagihan" 
            value={formatCurrency(summary.totalTagihan)} 
            color="blue"
            icon={Receipt}
          />
          <StatCard 
            label="Total Dibayar" 
            value={formatCurrency(summary.totalDibayar)} 
            color="green"
            icon={TrendingUp}
          />
          <StatCard 
            label="Tunggakan" 
            value={formatCurrency(summary.totalTunggakan)} 
            color={summary.totalTunggakan > 0 ? "red" : "green"}
            icon={summary.totalTunggakan > 0 ? AlertCircle : CheckCircle2}
          />
          <StatCard 
            label="Jumlah Tagihan" 
            value={summary.jumlahTagihan} 
            color="gray"
            icon={Receipt}
          />
        </div>
      </Section>

      {/* Status Pembayaran */}
      <Section title="Status Pembayaran" icon={CheckCircle2}>
        <div className="space-y-2">
          <div className="flex items-center justify-between border border-green-200 bg-green-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <Text size="2" weight="medium" className="text-green-900">
                Lunas
              </Text>
            </div>
            <Text size="2" weight="bold" className="text-green-900 font-mono">
              {summary.tagihanLunas}
            </Text>
          </div>
          <div className="flex items-center justify-between border border-red-200 bg-red-50 px-3 py-2">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <Text size="2" weight="medium" className="text-red-900">
                Belum Lunas
              </Text>
            </div>
            <Text size="2" weight="bold" className="text-red-900 font-mono">
              {summary.tagihanBelumLunas}
            </Text>
          </div>
        </div>
      </Section>

      {/* Daftar Tagihan */}
      <Section title="Daftar Tagihan" icon={Receipt} className="border-b-0 pb-0 mb-0">
        {list.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {list.map((tagihan) => (
              <div 
                key={tagihan.id} 
                className={`border-2 ${tagihan.isLunas ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'} hover:opacity-80 transition-opacity`}
              >
                {/* Header */}
                <div className="px-3 py-2 border-b border-slate-200 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <Text size="1" weight="bold" className="text-slate-900 leading-tight">
                        {tagihan.judul}
                      </Text>
                      <Text size="1" className="text-slate-600 font-mono text-[0.65rem]">
                        {tagihan.nomorTagihan}
                      </Text>
                    </div>
                    <div className="shrink-0">
                      {tagihan.isLunas ? (
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      ) : (
                        <AlertCircle className="h-4 w-4 text-red-600" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Detail */}
                <div className="px-3 py-2 space-y-1.5">
                  {/* Tanggal */}
                  <div className="flex items-center justify-between text-xs">
                    <Text size="1" className="text-slate-600">
                      Tanggal
                    </Text>
                    <Text size="1" weight="medium" className="text-slate-900">
                      {formatDate(tagihan.tanggalTagihan)}
                    </Text>
                  </div>

                  {/* Jatuh Tempo */}
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3 text-slate-500" />
                      <Text size="1" className="text-slate-600">
                        Jatuh Tempo
                      </Text>
                    </div>
                    <Text size="1" weight="medium" className="text-slate-900">
                      {formatDate(tagihan.tanggalJatuhTempo)}
                    </Text>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-200 my-1.5" />

                  {/* Total Tagihan */}
                  <div className="flex items-center justify-between">
                    <Text size="1" className="text-slate-600">
                      Total Tagihan
                    </Text>
                    <Text size="2" weight="bold" className="text-blue-900 font-mono">
                      {formatCurrency(tagihan.jumlahTagihan)}
                    </Text>
                  </div>

                  {/* Total Dibayar */}
                  <div className="flex items-center justify-between">
                    <Text size="1" className="text-slate-600">
                      Total Dibayar
                    </Text>
                    <Text size="2" weight="bold" className="text-green-900 font-mono">
                      {formatCurrency(tagihan.jumlahDibayar)}
                    </Text>
                  </div>

                  {/* Sisa */}
                  {tagihan.sisa > 0 && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <Text size="1" weight="bold" className="text-red-700">
                        Sisa Tunggakan
                      </Text>
                      <Text size="2" weight="bold" className="text-red-700 font-mono">
                        {formatCurrency(tagihan.sisa)}
                      </Text>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="border-2 border-dashed border-slate-300 bg-slate-50 px-3 py-6 text-center">
            <Receipt className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <Text size="1" className="text-slate-500">
              Belum ada tagihan untuk riwayat ini
            </Text>
          </div>
        )}
      </Section>
    </div>
  )
}
