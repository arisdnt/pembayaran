import { useCallback, useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAppRefresh } from './useAppRefresh'

let cachedDashboardEvents = null

export function useDashboardEvents() {
  const [events, setEvents] = useState(() => cachedDashboardEvents ?? [])
  const [loading, setLoading] = useState(() => !cachedDashboardEvents)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState('')
  const [realtimeStatus, setRealtimeStatus] = useState('connecting')
  const isMountedRef = useRef(true)

  const loadEvents = useCallback(async ({ withSpinner = true } = {}) => {
    const showInitialSpinner = !cachedDashboardEvents
    const showRefreshIndicator = cachedDashboardEvents && withSpinner

    if (showInitialSpinner) setLoading(true)
    if (showRefreshIndicator) setIsRefreshing(true)
    if (withSpinner) setError('')

    try {
      const { data, error: queryError } = await supabase
        .from('dashboard_items')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(25)

      if (queryError) {
        if (isMountedRef.current) {
          setError('Tidak bisa memuat data awal. Pastikan tabel "dashboard_items" dibuat di Supabase.')
        }
        return cachedDashboardEvents ?? []
      }

      const next = data ?? []
      if (isMountedRef.current) {
        cachedDashboardEvents = next
        setEvents(next)
        if (withSpinner) setError('')
      }

      return next
    } finally {
      if (isMountedRef.current) {
        if (showInitialSpinner) setLoading(false)
        if (showRefreshIndicator) setIsRefreshing(false)
      }
    }
  }, [])

  const handleAppRefresh = useCallback(() => loadEvents(), [loadEvents])
  useAppRefresh(handleAppRefresh)

  useEffect(() => {
    isMountedRef.current = true
    let channel

    loadEvents()

    channel = supabase
      .channel('realtime-dashboard')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'dashboard_items' }, (payload) => {
        if (!isMountedRef.current) return

        setEvents((current) => {
          const incoming = payload.new ?? payload.old

          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id
            const filtered = deletedId ? current.filter((item) => item.id !== deletedId) : current
            cachedDashboardEvents = filtered
            return filtered
          }

          if (!incoming) return current

          const filtered = current.filter((item) => item.id !== incoming.id)
          const next = [incoming, ...filtered].slice(0, 25)
          cachedDashboardEvents = next
          return next
        })
      })
      .subscribe((status) => {
        if (!isMountedRef.current) return
        if (status === 'SUBSCRIBED') setRealtimeStatus('connected')
        if (status === 'TIMED_OUT' || status === 'CHANNEL_ERROR') setRealtimeStatus('disconnected')
      })

    return () => {
      isMountedRef.current = false
      if (channel) supabase.removeChannel(channel)
    }
  }, [loadEvents])

  return { events, loading, isRefreshing, error, realtimeStatus, loadEvents }
}
