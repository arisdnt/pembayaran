import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useClock } from '../hooks/useClock'
import { useSystemInfo } from '../hooks/useSystemInfo'
import { SystemInfoSection } from './SystemInfoSection'
import { AppStatusSection } from './AppStatusSection'
import { DateTimeSection } from './DateTimeSection'
import { Copy, Check } from 'lucide-react'

export function StatusBar() {
  const currentTime = useClock()
  const systemInfo = useSystemInfo()
  const location = useLocation()
  const [copied, setCopied] = useState(false)

  const handleCopyPath = async () => {
    try {
      await navigator.clipboard.writeText(location.pathname)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy path:', err)
    }
  }

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 text-gray-900 text-xs z-20"
      style={{
        height: '24px'
      }}
    >
      <div className="flex items-center justify-between h-full px-3">
        <SystemInfoSection systemInfo={systemInfo} />
        
        {/* Path Display with Copy Button */}
        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white border border-gray-300 shadow-sm">
          <span className="font-mono text-[0.7rem] text-gray-700 select-all">
            {location.pathname}
          </span>
          <button
            onClick={handleCopyPath}
            className="p-0.5 hover:bg-gray-100 transition-colors group"
            title="Copy path"
          >
            {copied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3 text-gray-500 group-hover:text-gray-700" />
            )}
          </button>
        </div>

        <div className="flex items-center gap-3">
          <AppStatusSection />
          <DateTimeSection currentTime={currentTime} battery={systemInfo.battery} />
        </div>
      </div>
    </div>
  )
}