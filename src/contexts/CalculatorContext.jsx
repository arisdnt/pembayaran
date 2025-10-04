import { createContext, useContext, useState } from 'react'

const CalculatorContext = createContext({
  isOpen: false,
  toggleCalculator: () => {},
  openCalculator: () => {},
  closeCalculator: () => {},
})

export function CalculatorProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleCalculator = () => setIsOpen(prev => !prev)
  const openCalculator = () => setIsOpen(true)
  const closeCalculator = () => setIsOpen(false)

  const value = {
    isOpen,
    toggleCalculator,
    openCalculator,
    closeCalculator,
  }

  return <CalculatorContext.Provider value={value}>{children}</CalculatorContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCalculator() {
  const context = useContext(CalculatorContext)
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider')
  }
  return context
}
