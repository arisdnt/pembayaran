import { AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid, Brush, LabelList } from 'recharts'
import { ChartContainer } from '../../../components/ui/chart/ChartContainer'
import { ChartTooltipContent } from '../../../components/ui/chart/ChartTooltipContent'

import { useState } from 'react'

export function SiswaTrendLineChart({ data, compare }) {
  // Area Chart - Interactive ala shadcn/ui dengan komparasi YOY
  const [showNow, setShowNow] = useState(true)
  const [showPrev, setShowPrev] = useState(true)
  const now = (data || []).map(d => ({ key: d.key, Now: d.value }))
  const prev = (compare || []).map(d => ({ key: d.key, Prev: d.value }))
  const keys = Array.from(new Set([...(now||[]).map(x=>x.key), ...(prev||[]).map(x=>x.key)])).sort()
  const merged = keys.map(k => ({ key: k, Now: now.find(x=>x.key===k)?.Now||0, Prev: prev.find(x=>x.key===k)?.Prev||0 }))
  return (
    <ChartContainer title="Trend Jumlah Siswa" subtitle="Per bulan (interaktif)">
      <div className="px-2 pt-2 flex gap-2 items-center text-xs">
        <button type="button" onClick={()=>setShowNow(!showNow)} className={`px-2 py-0.5 border text-slate-700 ${showNow?'bg-blue-50 border-blue-300':'bg-white border-slate-300'}`}>
          <span className="inline-block h-2 w-2 bg-blue-500 mr-2" /> Sekarang
        </button>
        <button type="button" onClick={()=>setShowPrev(!showPrev)} className={`px-2 py-0.5 border text-slate-700 ${showPrev?'bg-amber-50 border-amber-300':'bg-white border-slate-300'}`}>
          <span className="inline-block h-2 w-2 bg-amber-500 mr-2" /> Tahun Lalu
        </button>
      </div>
      <ResponsiveContainer width="100%" height="90%">
        <AreaChart data={merged} margin={{ top: 8, right: 16, left: 8, bottom: 16 }}>
          <defs>
            <linearGradient id="siswaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.6} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="siswaPrevG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="key" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} tickMargin={8} />
          <YAxis tick={{ fontSize: 10 }} allowDecimals={false} tickLine={false} axisLine={false} width={30} />
          <Tooltip content={<ChartTooltipContent valueFormatter={(v) => Number(v).toLocaleString('id-ID')} />} />
          {showNow && (
            <Area type="monotone" dataKey="Now" name="Sekarang" stroke="#ef4444" fill="url(#siswaGradient)" strokeWidth={2}>
              <LabelList dataKey="Now" position="top" fill="#334155" fontSize={10} />
            </Area>
          )}
          {showPrev && (
            <Area type="monotone" dataKey="Prev" name="Tahun Lalu" stroke="#f59e0b" fill="url(#siswaPrevG)" strokeWidth={2}>
              <LabelList dataKey="Prev" position="top" fill="#334155" fontSize={10} />
            </Area>
          )}
          <Brush dataKey="key" height={18} stroke="#cbd5e1" travellerWidth={8} />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
