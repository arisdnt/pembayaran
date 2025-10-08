export function StatsDisplay({ total, filtered /*, hasActiveFilters */ }) {
  return (
    <div className="w-full min-w-0">
      <div className="grid grid-cols-2 items-center border border-slate-300 shadow-sm overflow-hidden" style={{ borderRadius: 0, height: '36px' }}>
        <div className="flex items-center justify-center px-2 min-w-0">
          <span className="text-slate-800 text-xs font-semibold tracking-wide truncate">T : {total}</span>
        </div>
        <div className="flex items-center justify-center px-2 min-w-0 border-l border-slate-300">
          <span className="text-emerald-700 text-xs font-semibold tracking-wide truncate">A : {filtered}</span>
        </div>
      </div>
    </div>
  )
}
