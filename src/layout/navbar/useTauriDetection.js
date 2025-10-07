import { useState, useEffect } from 'react'
import { getCurrentWindow } from '@tauri-apps/api/window'

export function useTauriDetection() {
  const [isTauri, setIsTauri] = useState(false)

  useEffect(() => {
    const checkTauri = async () => {
      try {
        const hasTauriGlobal = typeof window !== 'undefined' && (
          '__TAURI__' in window ||
          window.__TAURI__ !== undefined ||
          window.__TAURI_METADATA__ !== undefined
        )

        let canUseTauriAPI = false
        try {
          const appWindow = getCurrentWindow()
          await appWindow.label()
          canUseTauriAPI = true
        } catch (error) {
          console.log('Tauri API test failed:', error)
        }

        const detectedTauri = hasTauriGlobal || canUseTauriAPI
        setIsTauri(detectedTauri)
      } catch (error) {
        console.warn('Tauri detection error:', error)
        setIsTauri(false)
      }
    }

    checkTauri()
  }, [])

  return isTauri
}
