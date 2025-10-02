import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function RouteTransition({ children }) {
  const location = useLocation()
  const [displayLocation, setDisplayLocation] = useState(location)
  const [transitionStage, setTransitionStage] = useState('enter')

  useEffect(() => {
    if (location !== displayLocation) {
      setTransitionStage('exit')
    }
  }, [location, displayLocation])

  useEffect(() => {
    if (transitionStage === 'exit') {
      const timer = setTimeout(() => {
        setDisplayLocation(location)
        setTransitionStage('enter')
      }, 150) // 150ms untuk exit animation
      return () => clearTimeout(timer)
    }
  }, [transitionStage, location])

  return (
    <div
      className={`transition-opacity duration-150 ease-in-out ${
        transitionStage === 'exit' ? 'opacity-0' : 'opacity-100'
      }`}
      key={displayLocation.pathname}
    >
      {children}
    </div>
  )
}