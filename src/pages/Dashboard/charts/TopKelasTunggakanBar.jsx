import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList } from 'recharts'
import { ChartContainer } from '../../../components/ui/chart/ChartContainer'
import { ChartTooltipContent } from '../../../components/ui/chart/ChartTooltipContent'
import { BarValueLabel } from '../../../components/ui/chart/BarValueLabel'

export function TopKelasTunggakanBar({ data }) {
  return (
    <ChartContainer title="Top Kelas Berdasarkan Tunggakan" subtitle="10 kelas dengan tunggakan terbesar">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 8, right: 16, left: 24, bottom: 8 }}>
          <defs>
            <linearGradient id="tunggakanBarG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.85} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <XAxis type="number" tick={{ fontSize: 10 }} hide />
          <YAxis type="category" dataKey="name" width={120} tick={{ fontSize: 11 }} />
          <Tooltip content={<ChartTooltipContent valueFormatter={(v)=>Number(v).toLocaleString('id-ID')} />} />
          <Bar dataKey="value" fill="url(#tunggakanBarG)" stroke="#b91c1c">
            {(data||[]).map((_, idx) => (
              <Cell key={`cell-${idx}`} />
            ))}
            <LabelList content={(p) => <BarValueLabel {...p} variant="horizontalRight" fontSize={12} />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
