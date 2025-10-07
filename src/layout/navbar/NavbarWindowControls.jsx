import { Separator } from '@radix-ui/themes'
import { Minus, Square, X, Maximize2 } from 'lucide-react'

export function NavbarWindowControls({ isMaximized, onMinimize, onMaximize, onClose }) {
  return (
    <>
      <Separator orientation="vertical" size="2" className="h-6 bg-white/20" />
      <div className="flex items-center bg-white/5 rounded shrink-0" style={{ WebkitAppRegion: 'no-drag' }}>
        <button
          onClick={onMinimize}
          className="h-8 w-8 flex items-center justify-center text-white/90 hover:bg-white/15 transition-all duration-200 rounded-l focus:outline-none focus:ring-2 focus:ring-white/20"
          title="Minimize Window"
          type="button"
        >
          <Minus className="h-4 w-4 stroke-[2.5]" />
        </button>

        <button
          onClick={onMaximize}
          className="h-8 w-8 flex items-center justify-center text-white/90 hover:bg-white/15 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/20"
          title={isMaximized ? "Restore Down" : "Maximize Window"}
          type="button"
        >
          {isMaximized ? (
            <Maximize2 className="h-3.5 w-3.5 stroke-[2.5]" />
          ) : (
            <Square className="h-3.5 w-3.5 stroke-[2.5]" />
          )}
        </button>

        <button
          onClick={onClose}
          className="h-8 w-8 flex items-center justify-center text-white/90 hover:bg-red-500 hover:text-white transition-all duration-200 rounded-r focus:outline-none focus:ring-2 focus:ring-red-300"
          title="Close Application"
          type="button"
        >
          <X className="h-4 w-4 stroke-[2.5]" />
        </button>
      </div>
    </>
  )
}
