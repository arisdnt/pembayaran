import { useState, useEffect } from 'react'
import { RefreshCw } from 'lucide-react'

const REFRESH_INTERVAL = 10000 // 10 detik
const TICK_INTERVAL = 1000 // 1 detik
const TOTAL_BARS = 10

export function RefreshIndicator({ isRefreshing = false }) {
  const [countdown, setCountdown] = useState(TOTAL_BARS)

  useEffect(() => {
    // Reset countdown setiap kali refresh selesai
    if (isRefreshing) {
      setCountdown(TOTAL_BARS)
      return
    }

    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return TOTAL_BARS
        }
        return prev - 1
      })
    }, TICK_INTERVAL)

    return () => clearInterval(interval)
  }, [isRefreshing])

  return (
    <div className="flex items-center gap-2 px-2 py-0.5">
      <RefreshCw
        className={`h-3 w-3 ${isRefreshing ? 'animate-spin text-blue-600' : 'text-gray-500'}`}
      />

      {/* Countdown Bars */}
      <div className="flex items-center gap-0.5">
        {Array.from({ length: TOTAL_BARS }).map((_, index) => (
          <div
            key={index}
            className={`w-0.5 h-3 transition-colors duration-200 ${
              index < countdown
                ? 'bg-blue-500'
                : 'bg-gray-300'
            }`}
          />
        ))}
      </div>

      {/* Text indicator */}
      <span className="font-mono text-[0.65rem] text-gray-600 min-w-[3rem] text-right">
        {isRefreshing ? 'Refresh...' : `${countdown}s`}
      </span>
    </div>
  )
}
