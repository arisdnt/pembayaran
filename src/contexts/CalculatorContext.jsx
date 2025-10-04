import { createContext, useCallback, useContext, useMemo, useState } from 'react'

const CalculatorContext = createContext(undefined)

export function CalculatorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleCalculator = useCallback(() => {
    setIsOpen(prev => !prev)
  }, [])

  const openCalculator = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeCalculator = useCallback(() => {
    setIsOpen(false)
  }, [])

  const value = useMemo(() => ({
    isOpen,
    toggleCalculator,
    openCalculator,
    closeCalculator,
  }), [isOpen, toggleCalculator, openCalculator, closeCalculator])

  return (
    <CalculatorContext.Provider value={value}>
      {children}
    </CalculatorContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCalculator() {
  const context = useContext(CalculatorContext)
  if (context === undefined) {
    throw new Error('useCalculator must be used within a CalculatorProvider')
  }
  return context
}
