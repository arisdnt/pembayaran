import { useMemo } from 'react'

export function useDashboardStats(events) {
  return useMemo(() => {
    const total = events.length
    const lastEvent = events[0]
    return {
      total,
      lastType: lastEvent?.event_type ? lastEvent.event_type : '–',
      lastCreatedAt: lastEvent?.created_at ? new Date(lastEvent.created_at).toLocaleString() : '–',
    }
  }, [events])
}
