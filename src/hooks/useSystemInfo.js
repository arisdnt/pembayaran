import { useState } from 'react'

export function useSystemInfo() {
  const [systemInfo] = useState({
    memory: '8.2 GB',
    cpu: '45%',
    storage: '256 GB',
    network: 'Connected',
    battery: 85
  })

  return systemInfo
}
