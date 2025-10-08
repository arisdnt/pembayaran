import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LabelList } from 'recharts'
import { ChartContainer } from '../../../components/ui/chart/ChartContainer'
import { ChartTooltip } from '../../../components/ui/chart/ChartTooltip'
import { BarValueLabel } from '../../../components/ui/chart/BarValueLabel'

export function WaliKelasBarChart({ data }) {
  return (
    <ChartContainer title="Sebaran Wali Kelas" subtitle="Jumlah siswa per wali kelas (aktif)">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 8, bottom: 24 }}>
          <defs>
            <linearGradient id="waliBarG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.85} />
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0.25} />
            </linearGradient>
          </defs>
          <XAxis dataKey="name" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={36} />
          <YAxis tick={{ fontSize: 10 }} allowDecimals={false} />
          <Tooltip content={<ChartTooltip />} />
          <Bar dataKey="value" fill="url(#waliBarG)" stroke="#6d28d9">
            <LabelList content={(p) => <BarValueLabel {...p} variant="verticalTop" fontSize={12} />} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
