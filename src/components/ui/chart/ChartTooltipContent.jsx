import React from 'react'

export function ChartTooltipContent({ active, payload, label, valueFormatter }) {
  if (!active || !payload || payload.length === 0) return null
  return (
    <div className="bg-white border border-slate-200 text-slate-800 px-2 py-1.5 text-xs shadow-sm" style={{ borderRadius: 0 }}>
      {label ? <div className="font-semibold mb-1">{label}</div> : null}
      <div className="space-y-0.5">
        {payload.map((entry, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="inline-block h-2 w-2" style={{ backgroundColor: entry.color }} />
            <span className="text-slate-700">{entry.name}:</span>
            <span className="text-slate-900 font-medium">
              {valueFormatter ? valueFormatter(entry.value, entry) : entry.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

