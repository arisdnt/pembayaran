import { useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '../../../offline/db'

export function useMessageData() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  
  const kirimPesanRaw = useLiveQuery(
    async () => {
      console.log('[KirimPesan] useLiveQuery executing... (refresh trigger:', refreshTrigger, ')')
      const data = await db.kirim_pesan.orderBy('tanggal_dibuat').toArray()
      console.log('[KirimPesan] Loaded messages:', data.length, 'rows')
      return data
    },
    [refreshTrigger]
  )
  
  const kirimPesanData = kirimPesanRaw || []
  const kirimPesanLoading = kirimPesanRaw === undefined

  const forceRefresh = () => {
    console.log('[KirimPesan] Forcing refresh...')
    setRefreshTrigger(prev => prev + 1)
  }

  return {
    kirimPesanData,
    kirimPesanLoading,
    forceRefresh
  }
}
