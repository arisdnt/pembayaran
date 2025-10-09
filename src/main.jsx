import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import '@radix-ui/themes/styles.css'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { OfflineProvider } from './contexts/OfflineContext.jsx'
import { CalculatorProvider } from './contexts/CalculatorContext.jsx'

// Note: Dialog protection is now handled at component level via onPointerDownOutside and onInteractOutside
// ESC key is intentionally allowed to close modals for better UX

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <OfflineProvider>
        <CalculatorProvider>
          <App />
        </CalculatorProvider>
      </OfflineProvider>
    </AuthProvider>
  </StrictMode>,
)
