export function StatsDisplay({ stats, hasActiveFilters }) {
  return (
    <div className="ml-auto flex items-center gap-1.5 text-xs font-medium">
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 shadow-sm">
        <span className="text-slate-600">Total:</span>
        <span className="font-bold text-slate-900">{stats.total}</span>
      </div>
      <div className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 border border-emerald-300 shadow-sm">
        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-600" />
        <span className="text-emerald-700">Aktif:</span>
        <span className="font-bold text-emerald-900">{stats.active}</span>
      </div>
      {hasActiveFilters && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-300 shadow-sm">
          <span className="text-blue-700">Tampil:</span>
          <span className="font-bold text-blue-900">{stats.filtered}</span>
        </div>
      )}
    </div>
  )
}
