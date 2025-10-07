import { useState, useEffect, useRef } from 'react'
import { Tooltip, DropdownMenu, Text, Separator } from '@radix-ui/themes'
import { BellIcon, HamburgerMenuIcon } from '@radix-ui/react-icons'
import { RefreshCw, Calculator } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { useNavigate } from 'react-router-dom'
import { db } from '../../offline/db'
import { retryAllErrorOutbox } from '../../offline/outbox'
import { useCalculator } from '../../contexts/CalculatorContext.jsx'

export function NavbarActions() {
  const { toggleCalculator } = useCalculator()
  const navigate = useNavigate()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    const detail = { promises: [] }
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

  const errorItems = useLiveQuery(async () => {
    const list = await db.outbox.where('status').equals('error').toArray()
    return list.sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
  }, [], []) || []

  const errorCount = errorItems.length

  return (
    <div className="flex items-center space-x-4">
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

      <Tooltip content="Calculator">
        <button
          onClick={toggleCalculator}
          className="h-8 w-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          style={{ WebkitAppRegion: 'no-drag' }}
          type="button"
          aria-label="Toggle Calculator"
        >
          <Calculator className="h-4 w-4" />
        </button>
      </Tooltip>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger>
          <button
            className="h-8 w-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors relative"
            style={{ WebkitAppRegion: 'no-drag' }}
            type="button"
            aria-label="Notifikasi sinkronisasi"
          >
            <BellIcon className="h-4 w-4" />
            {errorCount > 0 && (
              <div className="absolute -top-1 -right-1 min-h-3 min-w-3 px-1 bg-red-500 text-[10px] text-white flex items-center justify-center font-semibold rounded-full">
                {errorCount}
              </div>
            )}
          </button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" className="w-[380px] p-0" style={{ borderRadius: 0 }}>
          <div className="px-4 py-2.5 border-b border-slate-200 bg-slate-50">
            <Text size="2" weight="bold" className="text-slate-800">Notifikasi Sinkronisasi</Text>
            <Text size="1" className="text-slate-500">Item outbox yang gagal tersinkron</Text>
          </div>
          <div className="min-h-[200px] max-h-[400px] overflow-y-auto">
            {errorCount === 0 ? (
              <div className="px-4 py-6 text-center">
                <Text size="2" className="text-slate-500">Tidak ada notifikasi.</Text>
              </div>
            ) : (
              <div>
                {errorItems.slice(0, 2).map((it, index) => (
                  <div key={it.id}>
                    <div className="px-4 py-3 hover:bg-slate-50">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-2 min-w-0 flex-1">
                          <div className="h-2 w-2 rounded-full bg-red-500 flex-shrink-0 mt-1" />
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <Text size="2" weight="bold" className="text-slate-800 truncate">{it.table}</Text>
                            <span className="text-slate-400 flex-shrink-0">•</span>
                            <Text size="2" className="text-slate-600 truncate">{it.op}</Text>
                          </div>
                        </div>
                        <Text size="1" className="text-slate-400 whitespace-nowrap flex-shrink-0 mt-0.5">
                          {new Date(it.updated_at || it.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </div>
                      <div className="pl-4">
                        <Text size="1" className="text-slate-500 block mb-2">PK: {String(it.pk)}</Text>
                        {it.error_message && (
                          <div className="mt-1 p-2 bg-red-50 border border-red-200 rounded">
                            <Text size="1" className="text-red-600 break-words">{it.error_message}</Text>
                          </div>
                        )}
                      </div>
                    </div>
                    {index < errorItems.slice(0, 2).length - 1 && (
                      <div className="border-b-2 border-slate-200 mx-4" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="px-4 py-2.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <button
              className="text-xs px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-medium"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); navigate('/sync') }}
              type="button"
            >
              Buka Halaman Sync
            </button>
            {errorCount > 0 && (
              <button
                className="text-xs px-3 py-1.5 bg-red-50 border border-red-300 hover:bg-red-100 text-red-700 font-medium"
                onClick={async (e) => { e.preventDefault(); e.stopPropagation(); await retryAllErrorOutbox() }}
                type="button"
              >
                Retry Semua
              </button>
            )}
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Root>

      <Separator orientation="vertical" size="2" className="h-6 bg-white/20" />

      <div className="md:hidden">
        <button 
          className="h-8 w-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors" 
          style={{ WebkitAppRegion: 'no-drag' }} 
          type="button"
        >
          <HamburgerMenuIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
