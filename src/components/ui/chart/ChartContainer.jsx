import React from 'react'

// Lightweight container mimicking shadcn/ui chart card
export function ChartContainer({ title, subtitle, children }) {
  return (
    <div
      className="relative h-full w-full flex flex-col border bg-white border-slate-200"
      style={{ borderRadius: 0 }}
    >
      {title && (
        <div className="px-3 py-2 border-b border-slate-200 bg-white shrink-0">
          <div className="text-slate-900 text-sm font-semibold leading-none">{title}</div>
        </div>
      )}
      <div className="p-2 flex-1 min-h-0">
        <div className="h-full w-full overflow-hidden">{children}</div>
      </div>
    </div>
  )}
