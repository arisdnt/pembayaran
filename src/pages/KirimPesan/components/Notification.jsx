import { CheckCircle2, AlertCircle, X } from 'lucide-react'

export default function Notification({ notification, onClose }) {
  if (!notification) return null

  return (
    <div className="fixed top-20 right-6 z-50 animate-slide-in">
      <div
        className={`
          flex items-start gap-3 px-3 py-2.5 shadow-lg border min-w-[320px] max-w-[400px]
          ${notification.type === 'success' ? 'bg-white border-green-500 border-l-4' : 'bg-white border-red-500 border-l-4'}
        `}
        style={{ borderRadius: 0 }}
      >
        <div
          className={`flex h-8 w-8 items-center justify-center shrink-0 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
          style={{ borderRadius: 0 }}
        >
          {notification.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-white" />
          ) : (
            <AlertCircle className="h-4 w-4 text-white" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className={`text-sm font-bold block mb-0.5 ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
            {notification.type === 'success' ? 'Berhasil' : 'Gagal'}
          </span>
          <p className={`text-xs leading-relaxed ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {notification.message}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex h-5 w-5 items-center justify-center hover:bg-slate-100 shrink-0 transition-colors"
          style={{ borderRadius: 0 }}
          aria-label="Close notification"
        >
          <X className="h-3.5 w-3.5 text-slate-400 hover:text-slate-600" />
        </button>
      </div>
    </div>
  )
}
