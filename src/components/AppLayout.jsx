import { memo } from 'react'
import { Navbar } from '../layout/Navbar'
import { StatusBar } from '../layout/StatusBar'
import { NetworkStatusToast } from './NetworkStatusToast'
import { SyncOutboxToast } from './SyncOutboxToast'
import { Calculator } from './Calculator'

const MemoizedNavbar = memo(Navbar)
const MemoizedStatusBar = memo(StatusBar)

export const AppLayout = memo(function AppLayout({ children, realtimeStatus = 'disconnected' }) {
  return (
    <div className="h-screen w-screen bg-white overflow-hidden">
      <MemoizedNavbar realtimeStatus={realtimeStatus} />
      <MemoizedStatusBar />

      {/* Network Status Toast Notification */}
      <NetworkStatusToast />
      <SyncOutboxToast />
      
      {/* Global Calculator */}
      <Calculator />

      <main
        className="overflow-hidden bg-white flex flex-col route-container"
        style={{
          height: 'calc(100vh - 72px)', // 48px (navbar) + 24px (statusbar) = 72px
          width: '100vw',
          marginTop: '48px' // Navbar height
        }}
      >
        {children}
      </main>
    </div>
  )
})
