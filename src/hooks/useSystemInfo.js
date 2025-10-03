import { useState, useEffect } from 'react'

export function useSystemInfo() {
  const [systemInfo, setSystemInfo] = useState({
    memory: 'Loading...',
    cpu: 'Loading...',
    storage: 'Loading...',
    network: navigator.onLine ? 'Connected' : 'Disconnected',
    battery: 0
  })

  useEffect(() => {
    // Network status listeners
    const handleOnline = () => {
      setSystemInfo(prev => ({ ...prev, network: 'Connected' }))
    }

    const handleOffline = () => {
      setSystemInfo(prev => ({ ...prev, network: 'Disconnected' }))
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Get real system info
    const updateSystemInfo = async () => {
      try {
        // Memory info (browser API)
        if (performance.memory) {
          const usedMemory = (performance.memory.usedJSHeapSize / 1024 / 1024 / 1024).toFixed(1)
          const totalMemory = (performance.memory.jsHeapSizeLimit / 1024 / 1024 / 1024).toFixed(1)
          setSystemInfo(prev => ({ ...prev, memory: `${usedMemory}/${totalMemory} GB` }))
        } else {
          setSystemInfo(prev => ({ ...prev, memory: 'N/A' }))
        }

        // CPU info - browser doesn't provide real CPU usage
        // We'll use navigator.hardwareConcurrency for CPU cores
        if (navigator.hardwareConcurrency) {
          setSystemInfo(prev => ({ ...prev, cpu: `${navigator.hardwareConcurrency} cores` }))
        } else {
          setSystemInfo(prev => ({ ...prev, cpu: 'N/A' }))
        }

        // Storage info (browser API)
        if (navigator.storage && navigator.storage.estimate) {
          const estimate = await navigator.storage.estimate()
          const usedGB = (estimate.usage / 1024 / 1024 / 1024).toFixed(1)
          const totalGB = (estimate.quota / 1024 / 1024 / 1024).toFixed(1)
          setSystemInfo(prev => ({ ...prev, storage: `${usedGB}/${totalGB} GB` }))
        } else {
          setSystemInfo(prev => ({ ...prev, storage: 'N/A' }))
        }

        // Battery info (browser API)
        if (navigator.getBattery) {
          const battery = await navigator.getBattery()
          const batteryLevel = Math.round(battery.level * 100)
          setSystemInfo(prev => ({ ...prev, battery: batteryLevel }))

          // Listen for battery changes
          battery.addEventListener('levelchange', () => {
            setSystemInfo(prev => ({ ...prev, battery: Math.round(battery.level * 100) }))
          })
        }
      } catch (error) {
        console.error('Error fetching system info:', error)
      }
    }

    updateSystemInfo()

    // Update system info every 5 seconds
    const interval = setInterval(updateSystemInfo, 5000)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      clearInterval(interval)
    }
  }, [])

  return systemInfo
}
