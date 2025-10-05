import { useEffect, useMemo, useRef, useState } from 'react'
import { AlertTriangle, X } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../offline/db'
import { retryOutboxItem } from '../../offline/outbox'
import { useNavigate } from 'react-router-dom'

export function SyncOutboxToast() {
  const navigate = useNavigate()
  const errors = useLiveQuery(async () => {
    const items = await db.outbox.where('status').equals('error').toArray()
    return items.sort((a, b) => new Date(b.updated_at || b.created_at) - new Date(a.updated_at || a.created_at))
  }, [], [])

  const newest = useMemo(() => (errors && errors.length > 0 ? errors[0] : null), [errors])
  const lastShownIdRef = useRef(null)

  const [show, setShow] = useState(false)
  const [current, setCurrent] = useState(null)

  useEffect(() => {
    if (!newest) return
    if (lastShownIdRef.current === newest.id) return
    lastShownIdRef.current = newest.id
    setCurrent(newest)
    setShow(true)
  }, [newest])

  if (!show || !current) return null

  return (
    <div className="fixed top-40 right-6 z-50 animate-slide-in">
      <div className="flex items-start gap-3 px-4 py-3 rounded-none shadow-2xl border-2 min-w-[320px] bg-amber-50 border-amber-600">
        <div className="flex h-10 w-10 items-center justify-center shrink-0 bg-amber-500 border border-amber-600">
          <AlertTriangle className="h-5 w-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold uppercase tracking-wider text-amber-900">
              Gagal Sinkronisasi
            </span>
          </div>
          <p className="text-xs leading-relaxed text-amber-800">
            {current.table} • {current.op} • PK: {String(current.pk)}
          </p>
          {current.error_message && (
            <p className="text-[11px] text-red-700 mt-1 line-clamp-2 whitespace-pre-wrap">
              {current.error_message}
            </p>
          )}
          <div className="mt-2 flex gap-2">
            <button
              className="text-xs px-2 py-1 border border-slate-300 bg-white hover:bg-slate-50"
              onClick={async () => { await retryOutboxItem(current.id); setShow(false) }}
              type="button"
            >
              Retry
            </button>
            <button
              className="text-xs px-2 py-1 border border-slate-300 bg-white hover:bg-slate-50"
              onClick={() => { navigate('/sync'); setShow(false) }}
              type="button"
            >
              Lihat Detail
            </button>
          </div>
        </div>
        <button
          onClick={() => setShow(false)}
          className="flex h-6 w-6 items-center justify-center border hover:bg-amber-100 border-amber-300 hover:border-amber-500"
          aria-label="Close sync notification"
        >
          <X className="h-3.5 w-3.5 text-amber-800" />
        </button>
      </div>
    </div>
  )
}

