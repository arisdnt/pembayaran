import { createContext, useContext, useState, useCallback } from 'react'

const RefreshContext = createContext({
  isRefreshing: false,
  setIsRefreshing: () => {},
})

export function RefreshProvider({ children }) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  return (
    <RefreshContext.Provider value={{ isRefreshing, setIsRefreshing }}>
      {children}
    </RefreshContext.Provider>
  )
}

export function useRefreshContext() {
  const context = useContext(RefreshContext)
  if (!context) {
    throw new Error('useRefreshContext must be used within RefreshProvider')
  }
  return context
}
