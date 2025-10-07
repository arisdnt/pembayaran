import { useState, useEffect, useRef } from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { invoke } from '@tauri-apps/api/core'

export function useWindowControls() {
  const [isMaximized, setIsMaximized] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [confirmExitOpen, setConfirmExitOpen] = useState(false)
  const allowCloseRef = useRef(false)

  useEffect(() => {
    const checkWindowState = async () => {
      try {
        const appWindow = getCurrentWindow()
        const maximized = await appWindow.isMaximized()
        const fullscreen = await appWindow.isFullscreen()
        setIsMaximized(maximized)
        setIsFullScreen(fullscreen)
      } catch {
        // Not in Tauri environment
      }
    }

    checkWindowState()
    const interval = setInterval(checkWindowState, 1000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let unlisten
    ;(async () => {
      try {
        const appWindow = getCurrentWindow()
        unlisten = await appWindow.onCloseRequested((event) => {
          if (!allowCloseRef.current) {
            event.preventDefault()
            setConfirmExitOpen(true)
          }
        })
      } catch {
        // Not running in Tauri
      }
    })()
    return () => {
      if (typeof unlisten === 'function') {
        unlisten()
      }
    }
  }, [])

  const handleMinimize = async () => {
    try {
      const appWindow = getCurrentWindow()
      await appWindow.minimize()
    } catch {
      try {
        await invoke('minimize_window')
      } catch (invokeError) {
        console.error('Error minimizing:', invokeError)
      }
    }
  }

  const handleMaximize = async () => {
    try {
      const appWindow = getCurrentWindow()
      if (isMaximized) {
        await appWindow.unmaximize()
      } else {
        await appWindow.maximize()
      }
      const newMaximized = await appWindow.isMaximized()
      setIsMaximized(newMaximized)
    } catch {
      try {
        if (isMaximized) {
          await invoke('unmaximize_window')
        } else {
          await invoke('maximize_window')
        }
      } catch (invokeError) {
        console.error('Error maximizing:', invokeError)
      }
    }
  }

  const handleClose = () => {
    setConfirmExitOpen(true)
  }

  const handleConfirmExit = async () => {
    try {
      const appWindow = getCurrentWindow()
      await appWindow.destroy()
    } catch {
      try {
        allowCloseRef.current = true
        const appWindow = getCurrentWindow()
        await appWindow.close()
      } catch {
        try {
          await invoke('close_window')
        } catch {
          if (typeof window !== 'undefined' && window.close) {
            window.close()
          }
        }
      }
    }
  }

  return {
    isMaximized,
    isFullScreen,
    confirmExitOpen,
    setConfirmExitOpen,
    handleMinimize,
    handleMaximize,
    handleClose,
    handleConfirmExit
  }
}
