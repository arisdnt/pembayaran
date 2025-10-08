import React from 'react'

export function ChartTooltip({ active, payload, label, formatter }) {
  if (!active || !payload || payload.length === 0) return null
  const p = payload[0]
  const value = formatter ? formatter(p.value, p) : p.value
  return (
    <div className="bg-white border border-slate-200 text-slate-800 px-2 py-1 text-xs shadow" style={{ borderRadius: 0 }}>
      {label && <div className="font-semibold mb-0.5">{label}</div>}
      <div>{value}</div>
    </div>
  )
}

