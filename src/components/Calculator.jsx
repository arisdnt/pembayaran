import { useState, useEffect, useRef } from 'react'
import { X, Calculator as CalcIcon } from 'lucide-react'
import { Text } from '@radix-ui/themes'
import { useCalculator } from '../contexts/CalculatorContext.jsx'

export function Calculator() {
  const { isOpen, closeCalculator } = useCalculator()
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  
  const [position, setPosition] = useState(() => {
    const x = Math.max(0, window.innerWidth - 340)
    const y = 80
    return { x, y }
  })
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const calculatorRef = useRef(null)

  // Handle dragging
  const handleMouseDown = (e) => {
    if (e.target.closest('.calc-button')) return
    
    setIsDragging(true)
    const rect = calculatorRef.current.getBoundingClientRect()
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return
      
      const newX = e.clientX - dragOffset.x
      const newY = e.clientY - dragOffset.y
      
      // Boundary checks
      const maxX = window.innerWidth - 320
      const maxY = window.innerHeight - 400
      
      setPosition({
        x: Math.max(0, Math.min(newX, maxX)),
        y: Math.max(0, Math.min(newY, maxY)),
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragOffset])

  // Calculator logic
  const handleNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const handleDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const handleClear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const handleOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = performOperation(currentValue, inputValue, operation)

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const performOperation = (prev, current, op) => {
    switch (op) {
      case '+':
        return prev + current
      case '-':
        return prev - current
      case '*':
        return prev * current
      case '/':
        return prev / current
      default:
        return current
    }
  }

  const handleEquals = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = performOperation(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const handlePercentage = () => {
    const currentValue = parseFloat(display)
    setDisplay(String(currentValue / 100))
  }

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1))
    } else {
      setDisplay('0')
    }
  }

  // Keyboard support
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      const key = e.key

      // Only handle calculator keys
      if (key >= '0' && key <= '9') {
        e.preventDefault()
        handleNumber(key)
      } else if (key === '.') {
        e.preventDefault()
        handleDecimal()
      } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault()
        handleOperation(key)
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault()
        handleEquals()
      } else if (key === 'Escape') {
        e.preventDefault()
        handleClear()
      } else if (key === 'Backspace') {
        e.preventDefault()
        handleBackspace()
      } else if (key === '%') {
        e.preventDefault()
        handlePercentage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, display, previousValue, operation, waitingForOperand])

  if (!isOpen) return null

  const buttons = [
    { label: 'C', action: handleClear, className: 'bg-red-500 hover:bg-red-600 text-white' },
    { label: '←', action: handleBackspace, className: 'bg-slate-200 hover:bg-slate-300' },
    { label: '%', action: handlePercentage, className: 'bg-slate-200 hover:bg-slate-300' },
    { label: '/', action: () => handleOperation('/'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { label: '7', action: () => handleNumber(7), className: 'bg-white hover:bg-slate-50' },
    { label: '8', action: () => handleNumber(8), className: 'bg-white hover:bg-slate-50' },
    { label: '9', action: () => handleNumber(9), className: 'bg-white hover:bg-slate-50' },
    { label: '*', action: () => handleOperation('*'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { label: '4', action: () => handleNumber(4), className: 'bg-white hover:bg-slate-50' },
    { label: '5', action: () => handleNumber(5), className: 'bg-white hover:bg-slate-50' },
    { label: '6', action: () => handleNumber(6), className: 'bg-white hover:bg-slate-50' },
    { label: '-', action: () => handleOperation('-'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { label: '1', action: () => handleNumber(1), className: 'bg-white hover:bg-slate-50' },
    { label: '2', action: () => handleNumber(2), className: 'bg-white hover:bg-slate-50' },
    { label: '3', action: () => handleNumber(3), className: 'bg-white hover:bg-slate-50' },
    { label: '+', action: () => handleOperation('+'), className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { label: '0', action: () => handleNumber(0), className: 'bg-white hover:bg-slate-50 col-span-2' },
    { label: '.', action: handleDecimal, className: 'bg-white hover:bg-slate-50' },
    { label: '=', action: handleEquals, className: 'bg-green-500 hover:bg-green-600 text-white' },
  ]

  return (
    <div
      ref={calculatorRef}
      className="fixed shadow-2xl border-2 border-slate-300 bg-white select-none pointer-events-auto"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: '300px',
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: 9999,
        pointerEvents: 'auto',
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-r from-[#476EAE] to-[#5A7FC7] px-3 py-2"
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <CalcIcon className="h-4 w-4 text-white" />
          <Text size="2" weight="bold" className="text-white">
            Calculator
          </Text>
        </div>
        <button
          onClick={closeCalculator}
          className="flex h-6 w-6 items-center justify-center hover:bg-red-500 transition-colors border border-white/20 group calc-button"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5 text-white" />
        </button>
      </div>

      {/* Display */}
      <div className="bg-slate-800 px-4 py-6 border-b-2 border-slate-300">
        <div className="text-right">
          {operation && (
            <Text size="1" className="text-slate-400 mb-1 block font-mono">
              {previousValue} {operation}
            </Text>
          )}
          <Text size="6" weight="bold" className="text-white font-mono break-all">
            {display}
          </Text>
        </div>
      </div>

      {/* Buttons */}
      <div className="grid grid-cols-4 gap-0 p-2">
        {buttons.map((btn, index) => (
          <button
            key={index}
            onClick={btn.action}
            className={`calc-button h-12 border border-slate-300 transition-colors font-semibold text-sm ${btn.className}`}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Keyboard hint */}
      <div className="bg-slate-50 border-t border-slate-300 px-3 py-2">
        <Text size="1" className="text-slate-500 text-center block">
          Keyboard: 0-9, +, -, *, /, Enter, Esc, ←
        </Text>
      </div>
    </div>
  )
}
