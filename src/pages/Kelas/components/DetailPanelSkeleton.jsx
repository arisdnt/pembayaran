export function DetailPanelSkeleton() {
  return (
    <div className="relative flex h-full flex-col bg-white/80 backdrop-blur shadow-sm">
      <div className="flex-1 space-y-6 p-6 animate-pulse">
        <div className="space-y-2">
          <div className="h-3 w-32 bg-slate-200" />
          <div className="h-8 w-52 bg-slate-200" />
          <div className="h-4 w-36 bg-slate-200" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-24 bg-slate-200" />
          <div className="h-4 w-48 bg-slate-200" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-28 bg-slate-200" />
          <div className="h-4 w-40 bg-slate-200" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-32 bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 bg-slate-200" />
            <div className="h-4 w-40 bg-slate-200" />
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 w-32 bg-slate-200" />
          <div className="flex items-center gap-3">
            <div className="h-4 w-4 bg-slate-200" />
            <div className="h-4 w-40 bg-slate-200" />
          </div>
        </div>
      </div>
      <div className="bg-white/80 px-6 py-4">
        <div className="h-3 w-48 bg-slate-200" />
      </div>
    </div>
  )
}
