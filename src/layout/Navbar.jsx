import { useState, useEffect, useRef } from 'react'
import {
  Avatar,
  Badge,
  Button,
  DropdownMenu,
  Flex,
  IconButton,
  Separator,
  Text,
  Tooltip,
} from '@radix-ui/themes'
import {
  ExitIcon,
  GearIcon,
  BellIcon,
  HamburgerMenuIcon,
  ChevronDownIcon,
} from '@radix-ui/react-icons'
import { User, GraduationCap, Wallet, Minus, Square, X, Maximize2, Maximize, Minimize, RefreshCw } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { menuSections } from '../config/menuData'
import { AboutModal } from '../components/AboutModal'
import { ConfirmExitDialog } from '../components/ConfirmExitDialog'
import { getCurrentWindow } from '@tauri-apps/api/window'
import { invoke } from '@tauri-apps/api/core'

// Icon mapping untuk setiap section
const sectionIcons = {
  'Akademik': GraduationCap,
  'Keuangan': Wallet,
}

// Warna icon untuk setiap section
const sectionIconColors = {
  'Utama': 'text-blue-300',
  'Akademik': 'text-green-300',
  'Keuangan': 'text-amber-300',
  'Info': 'text-indigo-300',
}

export function Navbar({ realtimeStatus = 'disconnected' }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMaximized, setIsMaximized] = useState(false)
  const [isFullScreen, setIsFullScreen] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false)
  const [confirmExitOpen, setConfirmExitOpen] = useState(false)
  const allowCloseRef = useRef(false)

  // Optional: runtime Tauri detection (kept for logging only)
  const [isTauri, setIsTauri] = useState(false)

  useEffect(() => {
    // More reliable Tauri detection
    const checkTauri = async () => {
      try {
        // Method 1: Check for Tauri globals
        const hasTauriGlobal = typeof window !== 'undefined' && (
          '__TAURI__' in window ||
          window.__TAURI__ !== undefined ||
          window.__TAURI_METADATA__ !== undefined
        )

        // Method 2: Try to use Tauri API
        let canUseTauriAPI = false
        try {
          const appWindow = getCurrentWindow()
          // Test if we can actually call a method
          await appWindow.label()
          canUseTauriAPI = true
        } catch (error) {
          console.log('Tauri API test failed:', error)
        }

        const detectedTauri = hasTauriGlobal || canUseTauriAPI

        console.log('Tauri detection:', {
          detectedTauri,
          hasTauriGlobal,
          canUseTauriAPI,
          windowKeys: typeof window !== 'undefined' ? Object.keys(window).filter(key => key.includes('TAURI')) : [],
          userAgent: navigator.userAgent
        })

        setIsTauri(detectedTauri)
      } catch (error) {
        console.warn('Tauri detection error:', error)
        setIsTauri(false)
      }
    }

    checkTauri()
  }, [])

  // Selalu tampilkan kontrol jendela di navbar

  // Intercept OS-level close (Alt+F4, taskbar X, etc.) to show confirmation dialog
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
      } catch (e) {
        // Not running in Tauri; ignore
      }
    })()
    return () => {
      if (typeof unlisten === 'function') {
        unlisten()
      }
    }
  }, [])

  useEffect(() => {
    // Check initial window state
    const checkWindowState = async () => {
      try {
        const appWindow = getCurrentWindow()
        const maximized = await appWindow.isMaximized()
        const fullscreen = await appWindow.isFullscreen()
        setIsMaximized(maximized)
        setIsFullScreen(fullscreen)
      } catch (error) {
        // Saat bukan Tauri (mis. di browser), panggilan ini akan gagal — aman untuk diabaikan
      }
    }

    checkWindowState()

    // Poll window state every 1000ms to keep UI in sync
    const interval = setInterval(checkWindowState, 1000)
    return () => clearInterval(interval)
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  const handleMinimize = async () => {
    try {
      const appWindow = getCurrentWindow()
      console.log('Got window instance:', appWindow)

      const result = await appWindow.minimize()
      console.log('Minimize result:', result)
    } catch (error) {
      console.error('Error minimizing window:', error)
      // Try alternative method using invoke
      try {
        await invoke('minimize_window')
      } catch (invokeError) {
        console.error('Error with invoke minimize:', invokeError)
      }
    }
  }

  const handleMaximize = async () => {
    try {
      const appWindow = getCurrentWindow()
      console.log('Got window instance for maximize:', appWindow)

      const wasMaximized = isMaximized
      console.log('Current maximized state:', wasMaximized)

      if (wasMaximized) {
        await appWindow.unmaximize()
        console.log('Window unmaximized')
      } else {
        await appWindow.maximize()
        console.log('Window maximized')
      }

      // Update state
      const newMaximized = await appWindow.isMaximized()
      setIsMaximized(newMaximized)
      console.log('New maximized state:', newMaximized)
    } catch (error) {
      console.error('Error toggling maximize:', error)
      // Try alternative method
      try {
        if (isMaximized) {
          await invoke('unmaximize_window')
        } else {
          await invoke('maximize_window')
        }
      } catch (invokeError) {
        console.error('Error with invoke maximize:', invokeError)
      }
    }
  }

  const handleClose = async () => {
    // Open confirmation dialog instead of immediate close
    setConfirmExitOpen(true)
  }

  const handleRefresh = async () => {
    if (isRefreshing) {
      return
    }

    setIsRefreshing(true)

    const detail = { promises: [] }

    // Dispatch custom event untuk trigger refresh di semua components
    window.dispatchEvent(new CustomEvent('app-refresh', { detail }))

    try {
      const pending = Array.isArray(detail.promises) ? detail.promises : []
      if (pending.length > 0) {
        await Promise.allSettled(pending)
      }
    } finally {
      setIsRefreshing(false)
    }
  }

  const autoRefreshRef = useRef(handleRefresh)

  useEffect(() => {
    autoRefreshRef.current = handleRefresh
  }, [handleRefresh])

  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof autoRefreshRef.current === 'function') {
        autoRefreshRef.current()
      }
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  const isActive = (href) => location.pathname === href

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-30 bg-gradient-to-r from-[#476EAE] to-[#5A7FC7] shadow-lg select-none"
      data-tauri-drag-region={true}
      style={{ WebkitAppRegion: 'drag' }}
    >
      <div className="px-6">
        <div className="flex h-12 items-center justify-between">
          {/* Left section - Logo and Navigation */}
          <div className="flex items-center space-x-8 flex-1">
            {/* Logo/Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur p-1">
                <img 
                  src="/icon.ico" 
                  alt="ArtaPay Logo" 
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="hidden sm:block">
                <div className="flex flex-col -my-0.5">
                  <Text size="4" weight="bold" className="text-white leading-none">
                    ArtaPay
                  </Text>
                  <Text size="1" className="text-white/70 leading-none mt-0.5">
                    Catat Bayar Cerdas
                  </Text>
                </div>
              </div>
            </div>

            {/* Navigation Menu Dropdowns */}
            <div className="hidden md:flex items-center gap-4">
              {menuSections.map((section, index) => {
                // Single item sections (like Dashboard) render as button
                if (section.items.length === 1) {
                  const item = section.items[0]
                  const Icon = item.icon
                  const active = isActive(item.href)
                  const iconColor = sectionIconColors[section.title] || 'text-white'
                  const isAboutMenu = item.href === '/about'
                  
                  return (
                    <div key={section.title} className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="2"
                        onClick={() => {
                          if (item.href === '/about') {
                            setIsAboutModalOpen(true)
                          } else {
                            navigate(item.href)
                          }
                        }}
                        className={`text-white transition-all cursor-pointer font-semibold ${
                          isAboutMenu
                            ? 'bg-gradient-to-r from-cyan-400/25 via-blue-400/25 to-purple-400/25 hover:from-cyan-400/35 hover:via-blue-400/35 hover:to-purple-400/35 border border-cyan-300/40 shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30'
                            : active
                              ? 'bg-white/20 text-white hover:bg-white/10'
                              : 'hover:bg-white/10'
                        }`}
                        style={isAboutMenu ? {
                          backdropFilter: 'blur(8px)',
                          WebkitBackdropFilter: 'blur(8px)',
                          WebkitAppRegion: 'no-drag'
                        } : { WebkitAppRegion: 'no-drag' }}
                      >
                        <Icon className={`h-4 w-4 ${isAboutMenu ? 'text-cyan-200' : iconColor}`} />
                        {item.label}
                      </Button>
                      {index < menuSections.length - 1 && (
                        <Separator orientation="vertical" size="1" className="h-6 bg-white/20" />
                      )}
                    </div>
                  )
                }

                // Multiple items render as dropdown
                const SectionIcon = sectionIcons[section.title]
                const iconColor = sectionIconColors[section.title] || 'text-white'
                
                return (
                  <div key={section.title} className="flex items-center gap-4">
                    <DropdownMenu.Root>
                      <DropdownMenu.Trigger>
                        <Button
                          variant="ghost"
                          size="2"
                          className="text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer font-medium"
                          style={{ WebkitAppRegion: 'no-drag' }}
                        >
                          {SectionIcon && <SectionIcon className={`h-4 w-4 ${iconColor}`} />}
                          {section.title}
                          <ChevronDownIcon className="h-4 w-4 ml-1" />
                        </Button>
                      </DropdownMenu.Trigger>

                      <DropdownMenu.Content 
                        className="min-w-[200px] mt-1 p-1 bg-white border border-slate-200 shadow-lg" 
                        style={{ borderRadius: 0 }}
                      >
                        {section.items.map((item) => {
                          const Icon = item.icon
                          const active = isActive(item.href)
                          
                          return (
                            <DropdownMenu.Item
                              key={item.href}
                              onClick={() => navigate(item.href)}
                              className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
                                active ? 'bg-blue-50' : ''
                              }`}
                            >
                              <Icon className={`h-4 w-4 ${iconColor}`} />
                              <span>{item.label}</span>
                            </DropdownMenu.Item>
                          )
                        })}
                      </DropdownMenu.Content>
                    </DropdownMenu.Root>
                    {index < menuSections.length - 1 && (
                      <Separator orientation="vertical" size="1" className="h-6 bg-white/20" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>


          {/* Right section - Status, Refresh, Notifications, User Menu, Window Controls */}
          <div className="flex items-center space-x-4">
            {/* Realtime Status */}
            <div className="hidden sm:block">
              <Badge
                color={realtimeStatus === 'connected' ? 'green' : 'amber'}
                variant="soft"
                className="text-xs bg-white/10 text-white border-white/20"
              >
                <div className={`mr-1 h-2 w-2 rounded-full ${
                  realtimeStatus === 'connected' ? 'bg-green-400' : 'bg-amber-400'
                } animate-pulse`} />
                {realtimeStatus === 'connected' ? 'Online' : 'Offline'}
              </Badge>
            </div>

            {/* Refresh Button */}
            <Tooltip content="Refresh Data">
              <button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="h-8 w-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ WebkitAppRegion: 'no-drag' }}
                type="button"
              >
                <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              </button>
            </Tooltip>

            {/* Notifications */}
            <Tooltip content="Notifications">
              <button
                className="h-8 w-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors relative"
                style={{ WebkitAppRegion: 'no-drag' }}
                type="button"
              >
                <BellIcon className="h-4 w-4" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 text-[10px] text-white flex items-center justify-center font-semibold">
                  3
                </div>
              </button>
            </Tooltip>

            {/* Separator */}
            <Separator orientation="vertical" size="2" className="h-6 bg-white/20" />

            {/* User Menu */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <button className="h-8 w-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors" style={{ WebkitAppRegion: 'no-drag' }} type="button">
                  <User className="h-4 w-4" />
                </button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content className="w-56 mt-2" align="end">
                <DropdownMenu.Item
                  className="flex items-center space-x-2 p-3 cursor-pointer"
                  onClick={() => navigate('/ubah-password')}
                >
                  <User className="h-4 w-4" />
                  <div>
                    <div className="font-medium">{user?.email?.split('@')[0] || 'User'}</div>
                    <div className="text-xs text-gray-500">{user?.email}</div>
                  </div>
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <DropdownMenu.Item
                  className="flex items-center space-x-2 p-2 cursor-pointer"
                  onClick={() => navigate('/ubah-password')}
                >
                  <GearIcon className="h-4 w-4" />
                  <span>Ubah Password</span>
                </DropdownMenu.Item>

                <DropdownMenu.Separator />

                <DropdownMenu.Item
                  className="flex items-center space-x-2 p-2 text-red-600 focus:text-red-600 cursor-pointer"
                  onClick={handleLogout}
                >
                  <ExitIcon className="h-4 w-4" />
                  <span>Sign Out</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu.Root>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button className="h-8 w-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors" style={{ WebkitAppRegion: 'no-drag' }} type="button">
                <HamburgerMenuIcon className="h-4 w-4" />
              </button>
            </div>

            {/* Windows Controls (selalu terlihat) */}
            {/* Separator before window controls */}
            <Separator orientation="vertical" size="2" className="h-6 bg-white/20" />

            <div className="flex items-center bg-white/5 rounded shrink-0" style={{ WebkitAppRegion: 'no-drag' }}>
              {/* Minimize */}
              <button
                onClick={handleMinimize}
                className="h-8 w-8 flex items-center justify-center text-white/90 hover:bg-white/15 transition-all duration-200 rounded-l focus:outline-none focus:ring-2 focus:ring-white/20"
                title="Minimize Window"
                type="button"
              >
                <Minus className="h-4 w-4 stroke-[2.5]" />
              </button>

              {/* Maximize/Restore */}
              <button
                onClick={handleMaximize}
                className="h-8 w-8 flex items-center justify-center text-white/90 hover:bg-white/15 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
                title={isMaximized ? "Restore Down" : "Maximize Window"}
                type="button"
              >
                {isMaximized ? (
                  <Maximize2 className="h-3.5 w-3.5 stroke-[2.5]" />
                ) : (
                  <Square className="h-3.5 w-3.5 stroke-[2.5]" />
                )}
              </button>

              {/* Close */}
              <button
                onClick={handleClose}
                className="h-8 w-8 flex items-center justify-center text-white/90 hover:bg-red-500 hover:text-white transition-all duration-200 rounded-r focus:outline-none focus:ring-2 focus:ring-red-300"
                title="Close Application"
                type="button"
              >
                <X className="h-4 w-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Modal */}
      <AboutModal open={isAboutModalOpen} onOpenChange={setIsAboutModalOpen} />

      {/* Confirm Exit Dialog */}
      <ConfirmExitDialog
        open={confirmExitOpen}
        onOpenChange={setConfirmExitOpen}
        onConfirm={async () => {
          try {
            const appWindow = getCurrentWindow()
            // Prefer force destroy to guarantee closure
            await appWindow.destroy()
          } catch (error) {
            try {
              // Fallback to graceful close (emits closeRequested)
              allowCloseRef.current = true
              const appWindow = getCurrentWindow()
              await appWindow.close()
            } catch (error2) {
              try {
                await invoke('close_window')
              } catch {
                if (typeof window !== 'undefined' && window.close) {
                  window.close()
                }
              }
            }
          }
        }}
      />
    </nav>
  )
}
