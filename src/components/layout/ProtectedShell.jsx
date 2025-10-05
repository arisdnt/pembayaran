import { Outlet } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { useOffline } from '../../contexts/OfflineContext'
import { ProtectedRoute } from './ProtectedRoute'

export function ProtectedShell() {
  const { status } = useOffline()
  return (
    <ProtectedRoute>
      <AppLayout realtimeStatus={status.realtime === 'connected' ? 'connected' : 'disconnected'}>
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  )
}
