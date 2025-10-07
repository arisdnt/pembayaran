import { useState } from 'react'
import { useWindowControls } from './navbar/useWindowControls'
import { NavbarLogo } from './navbar/NavbarLogo'
import { NavbarMenu } from './navbar/NavbarMenu'
import { NavbarStatus } from './navbar/NavbarStatus'
import { NavbarActions } from './navbar/NavbarActions'
import { NavbarUserMenu } from './navbar/NavbarUserMenu'
import { NavbarWindowControls } from './navbar/NavbarWindowControls'
import { AboutModal } from '../components/modals/AboutModal'
import { ConfirmExitDialog } from '../components/modals/ConfirmExitDialog'

export function Navbar({ realtimeStatus = 'disconnected' }) {
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)

  const {
    isMaximized,
    confirmExitOpen,
    setConfirmExitOpen,
    handleMinimize,
    handleMaximize,
    handleClose,
    handleConfirmExit
  } = useWindowControls()

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-[#476EAE] to-[#5A7FC7] shadow-lg select-none"
      data-tauri-drag-region={true}
      style={{ WebkitAppRegion: 'drag' }}
    >
      <div className="px-6">
        <div className="flex h-12 items-center justify-between">
          <div className="flex items-center space-x-8 flex-1">
            <NavbarLogo />
            <NavbarMenu onAboutClick={() => setIsAboutModalOpen(true)} />
          </div>

          <div className="flex items-center space-x-4">
            <NavbarStatus realtimeStatus={realtimeStatus} />
            <NavbarActions />
            <NavbarUserMenu />
            <NavbarWindowControls
              isMaximized={isMaximized}
              onMinimize={handleMinimize}
              onMaximize={handleMaximize}
              onClose={handleClose}
            />
          </div>
        </div>
      </div>

      <AboutModal open={isAboutModalOpen} onOpenChange={setIsAboutModalOpen} />
      <ConfirmExitDialog
        open={confirmExitOpen}
        onOpenChange={setConfirmExitOpen}
        onConfirm={handleConfirmExit}
      />
    </nav>
  )
}
