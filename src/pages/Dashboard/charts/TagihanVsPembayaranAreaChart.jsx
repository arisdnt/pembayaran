import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Brush, LabelList } from 'recharts'
import { ChartContainer } from '../../../components/ui/chart/ChartContainer'
import { ChartTooltipContent } from '../../../components/ui/chart/ChartTooltipContent'

export function TagihanVsPembayaranAreaChart({ tagihan, bayar }) {
  const keys = Array.from(new Set([...(tagihan||[]).map(d=>d.key), ...(bayar||[]).map(d=>d.key)])).sort()
  const merged = keys.map(k => ({ key: k, Tagihan: (tagihan||[]).find(x=>x.key===k)?.value||0, Pembayaran: (bayar||[]).find(x=>x.key===k)?.value||0 }))
  return (
    <ChartContainer title="Tagihan vs Pembayaran" subtitle="Per bulan (gap = tunggakan)">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={merged} margin={{ top: 8, right: 16, left: 8, bottom: 16 }}>
          <defs>
            <linearGradient id="tagihanG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="bayarG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.5} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="key" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tick={{ fontSize: 10 }} allowDecimals={false} tickLine={false} axisLine={false} width={40} />
          <Tooltip content={<ChartTooltipContent valueFormatter={(v)=>Number(v).toLocaleString('id-ID')} />} />
          <Area type="monotone" dataKey="Tagihan" stroke="#3b82f6" fill="url(#tagihanG)" strokeWidth={2}>
            <LabelList dataKey="Tagihan" position="top" fill="#334155" fontSize={10} />
          </Area>
          <Area type="monotone" dataKey="Pembayaran" stroke="#10b981" fill="url(#bayarG)" strokeWidth={2}>
            <LabelList dataKey="Pembayaran" position="top" fill="#334155" fontSize={10} />
          </Area>
          <Brush dataKey="key" height={18} stroke="#cbd5e1" travellerWidth={8} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
