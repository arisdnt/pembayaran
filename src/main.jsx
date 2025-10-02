import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '@radix-ui/themes/styles.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'

// Prevent dialogs from closing with Escape key and outside clicks
function DialogProtection() {
  useEffect(() => {
    // Prevent Escape key
    const handleKeyDown = (e) => {
      const dialogOpen = document.querySelector('[role="dialog"]')
      if (dialogOpen && e.key === 'Escape') {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
    
    // Prevent pointer events on overlay (outside clicks)
    const handlePointerDown = (e) => {
      const dialogOverlay = e.target.closest('[data-radix-dialog-overlay]')
      const dialogContent = e.target.closest('[role="dialog"]')
      
      // If clicking on overlay but not on dialog content, prevent
      if (dialogOverlay && !dialogContent) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
    
    // Prevent Radix UI's dismissable layer interactions
    const handleDismissableLayerInteract = (e) => {
      const dialogOpen = document.querySelector('[role="dialog"]')
      if (dialogOpen) {
        e.preventDefault()
        e.stopPropagation()
        return false
      }
    }
    
    // Use capture phase to intercept before Radix UI handlers
    document.addEventListener('keydown', handleKeyDown, true)
    document.addEventListener('pointerdown', handlePointerDown, true)
    document.addEventListener('pointerdownoutside', handleDismissableLayerInteract, true)
    document.addEventListener('focusoutside', handleDismissableLayerInteract, true)
    document.addEventListener('interactoutside', handleDismissableLayerInteract, true)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown, true)
      document.removeEventListener('pointerdown', handlePointerDown, true)
      document.removeEventListener('pointerdownoutside', handleDismissableLayerInteract, true)
      document.removeEventListener('focusoutside', handleDismissableLayerInteract, true)
      document.removeEventListener('interactoutside', handleDismissableLayerInteract, true)
    }
  }, [])
  
  return null
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <DialogProtection />
      <App />
    </AuthProvider>
  </StrictMode>,
)
