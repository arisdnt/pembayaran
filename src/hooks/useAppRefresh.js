import { useEffect, useRef } from 'react'

export function useAppRefresh(callback) {
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (typeof callback !== 'function') {
      return
    }
    if (typeof window === 'undefined') {
      return
    }

    const handleRefresh = (event) => {
      if (typeof callbackRef.current !== 'function') {
        return
      }

      try {
        const result = callbackRef.current(event)
        if (event?.detail?.promises && result && typeof result.then === 'function') {
          event.detail.promises.push(result)
        }
      } catch (error) {
        console.error('App refresh handler error:', error)
      }
    }

    window.addEventListener('app-refresh', handleRefresh)

    return () => {
      window.removeEventListener('app-refresh', handleRefresh)
    }
  }, [callback])
}
