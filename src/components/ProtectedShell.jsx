import { Outlet } from 'react-router-dom'
import { AppLayout } from './AppLayout'
import { ProtectedRoute } from './ProtectedRoute'

export function ProtectedShell() {
  return (
    <ProtectedRoute>
      <AppLayout realtimeStatus="connected">
        <Outlet />
      </AppLayout>
    </ProtectedRoute>
  )
}
