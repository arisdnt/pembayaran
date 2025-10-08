import { useState, useEffect } from 'react'
import { Heading, Text } from '@radix-ui/themes'
import {
  getSchoolName,
  getSchoolAddress,
  getSchoolPhone,
  getSchoolEmail,
  getSchoolWebsite,
  getAppPublisher,
  getAppSupportEmail,
  getAppLegalNotice,
} from '../../../config/appInfo'

export function SchoolIdentity() {
  const schoolName = getSchoolName()
  const schoolAddress = getSchoolAddress()
  const schoolPhone = getSchoolPhone()
  const schoolEmail = getSchoolEmail()
  const schoolWebsite = getSchoolWebsite()
  const appPublisher = getAppPublisher()
  const appSupportEmail = getAppSupportEmail()
  const appLegalNotice = getAppLegalNotice()

  // Typing effect state
  const [displayedName, setDisplayedName] = useState('')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTypingStarted, setIsTypingStarted] = useState(false)
  const [showCursor, setShowCursor] = useState(true)

  // Initial delay before starting typing
  useEffect(() => {
    const startDelay = setTimeout(() => {
      setIsTypingStarted(true)
    }, 500) // Wait 500ms before starting

    return () => clearTimeout(startDelay)
  }, [])

  // Typing animation with loop
  useEffect(() => {
    if (!isTypingStarted) return

    if (currentIndex < schoolName.length) {
      // Typing characters one by one
      const typingTimeout = setTimeout(() => {
        setDisplayedName(prev => prev + schoolName[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 100) // 100ms per character

      return () => clearTimeout(typingTimeout)
    } else if (currentIndex === schoolName.length && schoolName.length > 0) {
      // Typing complete, wait then restart
      const restartTimeout = setTimeout(() => {
        // Reset untuk mulai dari awal
        setDisplayedName('')
        setCurrentIndex(0)
        setShowCursor(true)
      }, 3000) // Wait 3 seconds before restarting

      return () => clearTimeout(restartTimeout)
    }
  }, [isTypingStarted, currentIndex, schoolName])

  return (
    <div className="w-3/4 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 flex items-end justify-start p-10 relative overflow-hidden">
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 8s ease infinite;
        }
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
        @keyframes cursorPulse {
          0%, 100% { 
            opacity: 1;
            transform: scaleY(1);
          }
          50% { 
            opacity: 0.4;
            transform: scaleY(0.95);
          }
        }
        .typing-cursor {
          display: inline-block;
          width: 2px;
          height: 1.2em;
          background: linear-gradient(180deg, #bfdbfe 0%, #60a5fa 50%, #3b82f6 100%);
          margin-left: 3px;
          animation: cursorPulse 1s ease-in-out infinite;
          vertical-align: text-bottom;
          box-shadow: 0 0 8px rgba(96, 165, 250, 0.6),
                      0 0 12px rgba(59, 130, 246, 0.4);
          border-radius: 1px;
        }
      `}</style>
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'url(/login.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/25 via-slate-800/15 to-blue-900/30" />

      <div className="relative z-10 w-full max-w-md bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl p-8 text-white flex flex-col space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 flex items-center justify-center border border-white/30 bg-white/5" style={{ borderRadius: 0 }}>
            <img
              src="/logo.svg"
              alt={`Logo ${schoolName}`}
              className="w-16 h-16 object-contain drop-shadow-[0_6px_12px_rgba(15,23,42,0.45)]"
              loading="lazy"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="relative" style={{ minHeight: '2rem' }}>
              {/* Invisible placeholder untuk reserve space */}
              <Text
                size="6"
                className="text-transparent tracking-wide mb-1 invisible"
                style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                aria-hidden="true"
              >
                {schoolName}
              </Text>
              {/* Actual typing text dengan absolute positioning */}
              <Text
                size="6"
                className="absolute top-0 left-0 text-white/90 tracking-wide mb-1"
                style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
              >
                {displayedName || '\u00A0'}
                {showCursor && <span className="typing-cursor" aria-hidden="true"></span>}
              </Text>
            </div>
            {schoolWebsite ? (
              <Text className="text-blue-100/90 text-sm">{schoolWebsite.replace(/^https?:\/\//, "")}</Text>
            ) : null}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-[100px_auto_1fr] gap-2 items-start">
            <Text className="text-blue-200 font-medium">Alamat</Text>
            <Text className="text-white/90">:</Text>
            <Text className="text-white/90">{schoolAddress || 'Alamat belum dikonfigurasi'}</Text>
          </div>

          <div className="grid grid-cols-[100px_auto_1fr] gap-2 items-start">
            <Text className="text-blue-200 font-medium">Telepon</Text>
            <Text className="text-white/90">:</Text>
            <Text className="text-white/90">{schoolPhone || '-'}</Text>
          </div>

          <div className="grid grid-cols-[100px_auto_1fr] gap-2 items-start">
            <Text className="text-blue-200 font-medium">Email</Text>
            <Text className="text-white/90">:</Text>
            <Text className="text-white/90">{schoolEmail || '-'}</Text>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 space-y-2">
          <div className="grid grid-cols-[100px_auto_1fr] gap-2 items-start text-xs">
            <Text className="text-blue-200 font-medium">Pengembang</Text>
            <Text className="text-white/80">:</Text>
            <Text className="text-white/80">{appPublisher}</Text>
          </div>
          <div className="grid grid-cols-[100px_auto_1fr] gap-2 items-start text-xs">
            <Text className="text-blue-200 font-medium">Dukungan</Text>
            <Text className="text-white/80">:</Text>
            <Text className="text-white/80">{appSupportEmail}</Text>
          </div>
          <div className="grid grid-cols-[100px_auto_1fr] gap-2 items-start text-xs">
            <Text className="text-blue-200 font-medium">Copyright</Text>
            <Text className="text-white/80">:</Text>
            <Text className="text-white/80">{appLegalNotice.replace(/^Copyright\s*/i, '')}</Text>
          </div>
        </div>
      </div>
    </div>
  )
}
