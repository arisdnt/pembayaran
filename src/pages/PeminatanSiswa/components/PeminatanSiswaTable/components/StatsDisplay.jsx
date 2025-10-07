export function StatsDisplay({ total, filtered, hasActiveFilters }) {
  return (
    <div className="ml-auto flex items-center gap-1.5 text-xs font-medium">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 shadow-sm">
        <span className="text-slate-600">Total:</span>
        <span className="font-bold text-slate-900">{total}</span>
      </div>
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 shadow-sm">
          <span className="text-emerald-700">Tampil:</span>
          <span className="font-bold text-emerald-900">{filtered}</span>
        </div>
      )}
    </div>
  )
}
