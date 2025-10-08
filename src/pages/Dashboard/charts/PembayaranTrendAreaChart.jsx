import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from 'recharts'
import { ChartContainer } from '../../../components/ui/chart/ChartContainer'
import { ChartTooltipContent } from '../../../components/ui/chart/ChartTooltipContent'

export function PembayaranTrendAreaChart({ data }) {
  // BarChart: [{ key:'2025-01', value: 1500000 }, ...]
  return (
    <ChartContainer title="Trend Pembayaran">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 16, left: 8, bottom: 16 }}>
          <defs>
            <linearGradient id="payBarG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.85} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="key" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tick={{ fontSize: 10 }} allowDecimals={false} tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltipContent valueFormatter={(v) => Number(v).toLocaleString('id-ID')} />} />
          <Bar dataKey="value" fill="url(#payBarG)" stroke="#059669" label={{ position: 'insideTop', fill: '#0f172a', fontSize: 10 }} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
