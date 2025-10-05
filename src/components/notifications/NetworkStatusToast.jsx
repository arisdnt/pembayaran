import { useEffect, useState, useRef } from 'react'
import { WifiOff, Wifi, X } from 'lucide-react'
import { useNetworkStatus } from '../../hooks/useNetworkStatus'

export function NetworkStatusToast() {
  const { isOnline, lastChecked } = useNetworkStatus()
  const [showToast, setShowToast] = useState(false)
  const [hasShownOffline, setHasShownOffline] = useState(false)
  const previousOnlineRef = useRef(true)

  useEffect(() => {
    // Hanya tampilkan toast jika status berubah
    if (previousOnlineRef.current !== isOnline) {
      if (!isOnline) {
        // Offline - tampilkan toast
        setShowToast(true)
        setHasShownOffline(true)
      } else if (hasShownOffline) {
        // Online kembali setelah offline - tampilkan notifikasi reconnect
        setShowToast(true)
        // Auto hide setelah 5 detik untuk online
        setTimeout(() => {
          setShowToast(false)
        }, 5000)
      }

      previousOnlineRef.current = isOnline
    }
  }, [isOnline, hasShownOffline])

  const handleClose = () => {
    setShowToast(false)
  }

  if (!showToast) return null

  return (
    <div className="fixed top-20 right-6 z-50 animate-slide-in">
      <div
        className={`
          flex items-center gap-3 px-4 py-3 rounded-none shadow-2xl border-2 min-w-[300px]
          ${
            isOnline
              ? 'bg-green-50 border-green-500'
              : 'bg-red-50 border-red-500'
          }
        `}
      >
        <div
          className={`
            flex h-10 w-10 items-center justify-center shrink-0
            ${
              isOnline
                ? 'bg-green-500 border border-green-600'
                : 'bg-red-500 border border-red-600'
            }
          `}
        >
          {isOnline ? (
            <Wifi className="h-5 w-5 text-white" />
          ) : (
            <WifiOff className="h-5 w-5 text-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span
              className={`
                text-sm font-bold uppercase tracking-wider
                ${isOnline ? 'text-green-800' : 'text-red-800'}
              `}
            >
              {isOnline ? 'Koneksi Terhubung' : 'Tidak Ada Koneksi'}
            </span>
          </div>
          <p
            className={`
              text-xs leading-relaxed
              ${isOnline ? 'text-green-700' : 'text-red-700'}
            `}
          >
            {isOnline
              ? 'Koneksi internet berhasil dipulihkan'
              : 'Periksa koneksi internet Anda. Aplikasi akan mencoba menghubungkan kembali secara otomatis.'}
          </p>
          {lastChecked && (
            <p className="text-[10px] text-slate-500 mt-1">
              Terakhir dicek: {new Date(lastChecked).toLocaleTimeString('id-ID')}
            </p>
          )}
        </div>

        <button
          onClick={handleClose}
          className={`
            flex h-6 w-6 items-center justify-center border transition-all shrink-0
            ${
              isOnline
                ? 'hover:bg-green-100 border-green-300 hover:border-green-500'
                : 'hover:bg-red-100 border-red-300 hover:border-red-500'
            }
          `}
          aria-label="Close notification"
        >
          <X
            className={`h-3.5 w-3.5 ${isOnline ? 'text-green-700' : 'text-red-700'}`}
          />
        </button>
      </div>

      {/* Progress bar untuk offline status */}
      {!isOnline && (
        <div className="mt-2 h-1 bg-slate-200 overflow-hidden">
          <div className="h-full bg-red-500 animate-pulse w-full" />
        </div>
      )}
    </div>
  )
}
