export function RefreshIndicator({ isRefreshing, loading }) {
  if (!isRefreshing || loading) return null

  return (
    <div className="-mx-6 mb-6 h-0.5 bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" />
  )
}
