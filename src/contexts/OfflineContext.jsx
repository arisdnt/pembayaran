import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { startBackgroundSync, stopBackgroundSync, getSyncStatus } from '../offline/syncEngine'
import { useAuth } from './AuthContext'

const OfflineContext = createContext({
  status: { realtime: 'disconnected', syncing: false, lastSyncAt: null, lastError: null },
})

export function OfflineProvider({ children }) {
  const { session, loading } = useAuth()
  const [status, setStatus] = useState(getSyncStatus())

  useEffect(() => {
    let disposed = false
    let intervalId
    async function boot() {
      if (loading) return
      if (!session) return
      await startBackgroundSync()
      if (!disposed) setStatus(getSyncStatus())
      // Poll sync status periodically to propagate realtime changes
      intervalId = setInterval(() => {
        if (!disposed) setStatus(getSyncStatus())
      }, 1500)
    }
    boot()
    return () => {
      disposed = true
      if (intervalId) clearInterval(intervalId)
      stopBackgroundSync()
    }
  }, [session, loading])

  const value = useMemo(() => ({ status }), [status])
  return <OfflineContext.Provider value={value}>{children}</OfflineContext.Provider>
}

export function useOffline() {
  const ctx = useContext(OfflineContext)
  if (!ctx) throw new Error('useOffline must be used within OfflineProvider')
  return ctx
}
