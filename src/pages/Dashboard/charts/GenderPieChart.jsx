import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell, LabelList } from 'recharts'
import { ChartContainer } from '../../../components/ui/chart/ChartContainer'
import { ChartTooltipContent } from '../../../components/ui/chart/ChartTooltipContent'
import { BarValueLabel } from '../../../components/ui/chart/BarValueLabel'

const COLORS = ['#2563eb', '#f97316']

export function GenderPieChart({ data }) {
  const items = [
    { name: 'Laki-laki', value: data?.male || 0 },
    { name: 'Perempuan', value: data?.female || 0 },
  ]
  return (
    <ChartContainer title="Sebaran Siswa (Gender)" subtitle="Jumlah siswa per gender">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items} layout="vertical" margin={{ top: 8, right: 12, left: 8, bottom: 8 }}>
          <defs>
            <linearGradient id="genderBarG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.9} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <XAxis type="number" tick={{ fontSize: 10 }} allowDecimals={false} tickLine={false} axisLine={false} />
          <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} tickMargin={6} />
          <Tooltip content={<ChartTooltipContent valueFormatter={(v)=>Number(v).toLocaleString('id-ID')} />} />
          <Bar dataKey="value" radius={[0, 3, 3, 0]} fill="url(#genderBarG)">
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
