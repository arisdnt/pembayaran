import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList } from 'recharts'
import { ChartContainer } from '../../../components/ui/chart/ChartContainer'
import { ChartTooltipContent } from '../../../components/ui/chart/ChartTooltipContent'
import { BarValueLabel } from '../../../components/ui/chart/BarValueLabel'

const COLORS = ['#ef4444', '#f59e0b']

export function TunggakanByGenderBar({ data }) {
  const items = Array.isArray(data) ? data : []
  return (
    <ChartContainer title="Tunggakan per Gender" subtitle="Total tunggakan berdasarkan jenis kelamin">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} layout="vertical" margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
          <defs>
            <linearGradient id="tunggakanGenderG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.85} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickMargin={6} />
          <Tooltip content={<ChartTooltipContent valueFormatter={(v)=>Number(v).toLocaleString('id-ID')} />} />
          <Bar dataKey="value" radius={[0, 3, 3, 0]} fill="url(#tunggakanGenderG)">
            {items.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
            <LabelList content={(p) => <BarValueLabel {...p} variant="horizontalRight" fontSize={12} />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
