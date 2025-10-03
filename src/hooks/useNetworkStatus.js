import { useState, useEffect, useRef } from 'react'

/**
 * Hook untuk monitoring status koneksi internet dengan validasi bertingkat
 * Menggunakan Image loading untuk test koneksi yang lebih reliable
 * Hanya menampilkan offline jika kedua test gagal
 */
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(navigator.onLine ?? true)
  const [lastChecked, setLastChecked] = useState(null)
  const checkingRef = useRef(false)
  const timeoutRef = useRef(null)

  // Fungsi untuk test koneksi menggunakan Image loading (lebih reliable)
  const testConnection = (imageUrl) => {
    return new Promise((resolve) => {
      const timeout = setTimeout(() => {
        cleanup()
        resolve(false)
      }, 5000) // 5 second timeout

      const img = new Image()
      
      const cleanup = () => {
        clearTimeout(timeout)
        img.onload = null
        img.onerror = null
        img.src = ''
      }

      img.onload = () => {
        cleanup()
        resolve(true)
      }

      img.onerror = () => {
        cleanup()
        resolve(false)
      }

      // Add timestamp to bypass cache
      img.src = `${imageUrl}?t=${Date.now()}`
    })
  }

  // Validasi bertingkat: test ke beberapa endpoint
  const checkConnection = async () => {
    if (checkingRef.current) return

    checkingRef.current = true

    try {
      // Check 1: Browser navigator.onLine (fast check)
      const browserOnline = navigator.onLine
      
      if (!browserOnline) {
        console.log('[NetworkStatus] ✗ Browser reports offline')
        setIsOnline(false)
        setLastChecked(new Date())
        checkingRef.current = false
        return
      }

      console.log('[NetworkStatus] ✓ Browser reports online, testing actual connectivity...')

      // Check 2: Test Google DNS logo (reliable, public, fast)
      console.log('[NetworkStatus] Testing Google...')
      const googleTest = await testConnection('https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png')

      if (googleTest) {
        console.log('[NetworkStatus] ✓ Google reachable')
        setIsOnline(true)
        setLastChecked(new Date())
        checkingRef.current = false
        return
      }

      console.log('[NetworkStatus] ✗ Google unreachable, testing Cloudflare...')

      // Check 3: Test Cloudflare (1.1.1.1 landing page)
      const cloudflareTest = await testConnection('https://cloudflare-dns.com/favicon.ico')

      if (cloudflareTest) {
        console.log('[NetworkStatus] ✓ Cloudflare reachable')
        setIsOnline(true)
        setLastChecked(new Date())
        checkingRef.current = false
        return
      }

      console.log('[NetworkStatus] ✗ Cloudflare unreachable, testing CDN...')

      // Check 4: Test public CDN (jsDelivr)
      const cdnTest = await testConnection('https://cdn.jsdelivr.net/gh/twitter/twemoji@latest/assets/72x72/1f44d.png')

      if (cdnTest) {
        console.log('[NetworkStatus] ✓ CDN reachable')
        setIsOnline(true)
      } else {
        console.log('[NetworkStatus] ⚠ All connectivity tests failed - OFFLINE')
        setIsOnline(false)
      }

      setLastChecked(new Date())
    } catch (error) {
      console.error('[NetworkStatus] Error checking connection:', error)
      // Fallback ke browser onLine jika ada unexpected error
      setIsOnline(navigator.onLine ?? true)
    } finally {
      checkingRef.current = false
    }
  }

  useEffect(() => {
    // Initial check
    checkConnection()

    // Listen to browser online/offline events
    const handleOnline = () => {
      console.log('[NetworkStatus] Browser online event')
      checkConnection()
    }

    const handleOffline = () => {
      console.log('[NetworkStatus] Browser offline event')
      // Browser says offline, but do our own validation
      checkConnection()
    }

    // Listen to global fetch errors (for Supabase/API failures)
    const handleFetchError = (event) => {
      const error = event.reason || event.error
      if (error && typeof error === 'object') {
        const errorMessage = error.message || String(error)
        // Check if it's a network-related error
        if (
          errorMessage.includes('Failed to fetch') ||
          errorMessage.includes('NetworkError') ||
          errorMessage.includes('Network request failed') ||
          error.name === 'TypeError'
        ) {
          console.log('[NetworkStatus] Detected fetch error, checking connection...', errorMessage)
          checkConnection()
        }
      }
    }

    // Listen to unhandled promise rejections (catch Supabase errors)
    window.addEventListener('unhandledrejection', handleFetchError)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('unhandledrejection', handleFetchError)
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  // Adaptive periodic check based on online status
  useEffect(() => {
    // - 10 seconds when offline (untuk cepat detect reconnect)
    // - 30 seconds when online (tidak agresif)
    const interval = isOnline ? 30000 : 10000
    
    console.log(`[NetworkStatus] Setting periodic check interval: ${interval}ms (${isOnline ? 'online' : 'offline'})`)
    
    const intervalId = setInterval(() => {
      checkConnection()
    }, interval)

    return () => {
      clearInterval(intervalId)
    }
  }, [isOnline])

  return {
    isOnline,
    lastChecked,
    checkConnection,
  }
}
