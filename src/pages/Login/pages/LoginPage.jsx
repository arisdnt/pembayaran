import { useLogin } from '../hooks/useLogin'
import { SchoolIdentity } from '../components/SchoolIdentity'
import { LoginForm } from '../components/LoginForm'
import { X } from 'lucide-react'
import { getCurrentWindow } from '@tauri-apps/api/window'

export function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
    handleMagicLink,
  } = useLogin()

  const handleClose = async () => {
    try {
      const appWindow = getCurrentWindow()
      // Use destroy() to force close without confirmation dialog
      // This bypasses the onCloseRequested listener from Navbar
      await appWindow.destroy()
    } catch (error) {
      console.error('Error closing window:', error)
      // Fallback to close() if destroy() fails
      try {
        const appWindow = getCurrentWindow()
        await appWindow.close()
      } catch (fallbackError) {
        console.error('Fallback close also failed:', fallbackError)
      }
    }
  }

  return (
    <div className="min-h-screen flex relative">
      {/* Window Close Button */}
      <button
        onClick={handleClose}
        className="absolute top-4 right-4 z-50 h-10 w-10 flex items-center justify-center bg-red-500 hover:bg-[#476EAE] text-white transition-all duration-200 rounded shadow-lg shadow-red-500/50 hover:shadow-xl hover:shadow-[#476EAE]/60 focus:outline-none focus:ring-2 focus:ring-red-300"
        title="Close Application"
        type="button"
        style={{ WebkitAppRegion: 'no-drag' }}
      >
        <X className="h-5 w-5 stroke-[2.5]" />
      </button>

      <SchoolIdentity />
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        loading={loading}
        onSubmit={handleSubmit}
        onMagicLink={handleMagicLink}
      />
    </div>
  )
}
