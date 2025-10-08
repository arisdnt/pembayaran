import { useState, useEffect } from 'react'
import { Dialog, Text, Badge } from '@radix-ui/themes'
import { X, User, Mail, Phone, Calendar, Zap, Copy, Check, Code, Sparkles, Shield, MapPin } from 'lucide-react'

export function AboutModal({ open, onOpenChange }) {
  const [copiedField, setCopiedField] = useState(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (open) {
      setMounted(false)
      setTimeout(() => setMounted(true), 50)
    }
  }, [open])

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  // Enhanced Field Card with futuristic styling
  const FieldCard = ({ label, icon: Icon, children, glowColor = 'cyan' }) => {
    const glowColors = {
      cyan: 'shadow-cyan-500/20 hover:shadow-cyan-500/40 border-cyan-500/30',
      purple: 'shadow-purple-500/20 hover:shadow-purple-500/40 border-purple-500/30',
      blue: 'shadow-blue-500/20 hover:shadow-blue-500/40 border-blue-500/30',
      green: 'shadow-green-500/20 hover:shadow-green-500/40 border-green-500/30',
    }
    
    return (
      <div className={`group relative bg-slate-900/40 backdrop-blur-sm border ${glowColors[glowColor]} shadow-lg transition-all duration-300 hover:scale-[1.02] hover:bg-slate-900/60 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ 
          borderRadius: 0,
          transitionDelay: mounted ? '0ms' : '0ms'
        }}
      >
        {/* Animated corner accent */}
        <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-cyan-400 opacity-60"></div>
        <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-purple-400 opacity-60"></div>
        
        <div className="p-3">
          <div className="flex items-center gap-1.5 mb-2">
            {Icon && (
              <div className="flex h-6 w-6 items-center justify-center bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30">
                <Icon className="h-3.5 w-3.5 text-white" />
              </div>
            )}
            <Text size="1" weight="bold" className="text-cyan-300 uppercase tracking-widest text-[0.6rem]">
              {label}
            </Text>
          </div>
          <div className="text-slate-100">
            {children}
          </div>
        </div>
        
        {/* Hover glow line effect */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content 
        style={{ 
          maxWidth: '95vw',
          width: '900px',
          maxHeight: '95vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)'
        }}
        className="border-2 border-transparent shadow-2xl shadow-cyan-500/20 relative"
      >
        {/* Animated rotating border gradient */}
        <div className="absolute inset-0 pointer-events-none animate-border-rotate" 
          style={{
            background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #06b6d4)',
            backgroundSize: '400% 100%',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
            padding: '2px'
          }}
        ></div>
        
        {/* Animated grid background pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(6, 182, 212, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(6, 182, 212, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
            animation: 'gridMove 20s linear infinite'
          }}
        ></div>
        
        {/* Corner tech accents */}
        <div className="absolute top-0 left-0 w-32 h-32 border-t-2 border-l-2 border-cyan-400 opacity-40 animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 border-b-2 border-r-2 border-purple-400 opacity-40 animate-pulse"></div>
        
        {/* Floating Close Button */}
        <button
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 z-50 flex h-10 w-10 items-center justify-center bg-slate-800/80 backdrop-blur-sm border-2 border-red-500/40 hover:border-red-500 hover:bg-red-950/50 transition-all group overflow-hidden shadow-lg shadow-red-500/20"
          aria-label="Close"
        >
          <X className="h-5 w-5 text-red-400 group-hover:text-red-300 transition-colors relative z-10" />
          {/* Hover glow */}
          <div className="absolute inset-0 bg-red-500/0 group-hover:bg-red-500/20 transition-colors"></div>
        </button>

        {/* Content with Glass Effect - Full Height */}
        <div className="overflow-auto p-6 relative z-10" style={{ maxHeight: '95vh' }}>
          {/* Hero App Section with Neon Glow */}
          <div className="relative bg-gradient-to-br from-slate-900/60 via-slate-800/60 to-slate-900/60 backdrop-blur-md border-2 border-cyan-500/40 shadow-2xl shadow-cyan-500/20 p-4 mb-4 overflow-hidden group">
            {/* Animated scan line effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/5 to-transparent h-32 animate-scan"></div>
            
            {/* Tech corner markers */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400"></div>
            <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-purple-400"></div>
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-purple-400"></div>
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="h-4 w-4 text-cyan-400 animate-pulse" />
                <Text size="1" className="text-cyan-300/80 uppercase tracking-[0.15em] text-[0.6rem] font-bold">
                  Application Name
                </Text>
              </div>
              
              <div className="mb-2">
                <Text size="7" weight="bold" className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-500 leading-none tracking-wider drop-shadow-[0_0_20px_rgba(6,182,212,0.6)]"
                  style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
                >
                  ArtaPay
                </Text>
              </div>
              
              <div className="flex items-start gap-1.5 mb-3">
                <Code className="h-3.5 w-3.5 text-blue-400 mt-0.5 flex-shrink-0" />
                <Text size="1" className="text-slate-300 leading-relaxed text-sm">
                  Platform manajemen keuangan sekolah yang modern dan transparan
                </Text>
              </div>
              
              {/* Badges in one row */}
              <div className="flex items-center gap-2">
                {/* Version Badge */}
                <div className="relative group/badge flex-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-blue-600 blur-sm opacity-40 group-hover/badge:opacity-60 transition-opacity"></div>
                  
                  {/* Animated badge border */}
                  <div className="absolute inset-0 pointer-events-none animate-border-rotate" 
                    style={{
                      background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #06b6d4)',
                      backgroundSize: '400% 100%',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      padding: '2px'
                    }}
                  ></div>
                  
                  <div className="relative bg-gradient-to-r from-cyan-600 to-blue-700 border-2 border-transparent px-3 py-1.5 text-center">
                    <Text size="1" className="text-cyan-100 uppercase tracking-widest text-[0.55rem] mb-0.5 block font-bold">
                      Version
                    </Text>
                    <Text size="2" weight="bold" className="text-white font-mono">
                      v1.0.0
                    </Text>
                  </div>
                </div>
                
                {/* Year Badge */}
                <div className="relative group/badge flex-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 blur-sm opacity-40 group-hover/badge:opacity-60 transition-opacity"></div>
                  
                  {/* Animated badge border */}
                  <div className="absolute inset-0 pointer-events-none animate-border-rotate" 
                    style={{
                      background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #06b6d4)',
                      backgroundSize: '400% 100%',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      padding: '2px'
                    }}
                  ></div>
                  
                  <div className="relative bg-gradient-to-r from-green-600 to-emerald-700 border-2 border-transparent px-3 py-1.5 text-center">
                    <Text size="1" className="text-green-100 uppercase tracking-widest text-[0.55rem] mb-0.5 block font-bold">
                      Release
                    </Text>
                    <Text size="2" weight="bold" className="text-white font-mono">
                      2025
                    </Text>
                  </div>
                </div>
                
                {/* Security Badge */}
                <div className="relative group/badge flex-1">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-600 blur-sm opacity-40 group-hover/badge:opacity-60 transition-opacity"></div>
                  
                  {/* Animated badge border */}
                  <div className="absolute inset-0 pointer-events-none animate-border-rotate" 
                    style={{
                      background: 'linear-gradient(90deg, #06b6d4, #3b82f6, #8b5cf6, #ec4899, #06b6d4)',
                      backgroundSize: '400% 100%',
                      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: 'xor',
                      maskComposite: 'exclude',
                      padding: '2px'
                    }}
                  ></div>
                  
                  <div className="relative bg-gradient-to-r from-purple-600 to-pink-700 border-2 border-transparent px-3 py-1.5 text-center">
                    <Shield className="h-4 w-4 text-white mx-auto mb-0.5" />
                    <Text size="1" className="text-purple-100 uppercase tracking-widest text-[0.55rem] font-bold">
                      Secure
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Info Cards - 2 columns grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Developer Name Card */}
            <div className="col-span-2">
              <FieldCard label="Developer" icon={User} glowColor="cyan">
                <Text size="3" weight="bold" className="text-white tracking-wide">
                  Aris Dianto
                </Text>
              </FieldCard>
            </div>

            {/* Email Card */}
            <FieldCard label="Email Contact" icon={Mail} glowColor="blue">
              <div className="flex items-center justify-between gap-2 min-h-[32px]">
                <a 
                  href="mailto:arisdianto.mdn@gmail.com" 
                  className="text-cyan-300 hover:text-cyan-100 transition-colors flex-1 min-w-0"
                >
                  <Text size="2" weight="medium" className="hover:underline truncate block">
                    arisdianto.mdn@gmail.com
                  </Text>
                </a>
                <button
                  onClick={() => handleCopy('arisdianto.mdn@gmail.com', 'email')}
                  className="relative flex h-7 w-7 items-center justify-center bg-cyan-600/50 hover:bg-cyan-600 border-2 border-cyan-400 transition-all group/copy shrink-0 overflow-hidden"
                  title="Copy email"
                >
                  {copiedField === 'email' ? (
                    <Check className="h-3.5 w-3.5 text-white relative z-10" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-cyan-100 relative z-10" />
                  )}
                  <div className="absolute inset-0 bg-cyan-400/0 group-hover/copy:bg-cyan-400/20 transition-colors"></div>
                </button>
              </div>
            </FieldCard>

            {/* WhatsApp Card */}
            <FieldCard label="WhatsApp" icon={Phone} glowColor="green">
              <div className="flex items-center justify-between gap-2 min-h-[32px]">
                <a 
                  href="https://wa.me/62081231274828" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-300 hover:text-green-100 transition-colors flex-1 min-w-0"
                >
                  <Text size="2" weight="medium" className="hover:underline block">
                    +62 812-3127-4828
                  </Text>
                </a>
                <button
                  onClick={() => handleCopy('https://wa.me/62081231274828', 'whatsapp')}
                  className="relative flex h-7 w-7 items-center justify-center bg-green-600/50 hover:bg-green-600 border-2 border-green-400 transition-all group/copy shrink-0 overflow-hidden"
                  title="Copy WhatsApp link"
                >
                  {copiedField === 'whatsapp' ? (
                    <Check className="h-3.5 w-3.5 text-white relative z-10" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-green-100 relative z-10" />
                  )}
                  <div className="absolute inset-0 bg-green-400/0 group-hover/copy:bg-green-400/20 transition-colors"></div>
                </button>
              </div>
            </FieldCard>

            {/* Year Card */}
            <FieldCard label="Release Year" icon={Calendar} glowColor="purple">
              <div className="min-h-[32px] flex items-center">
                <Text size="2" weight="medium" className="text-white">
                  2025
                </Text>
              </div>
            </FieldCard>

            {/* Address Card */}
            <FieldCard label="Address" icon={MapPin} glowColor="cyan">
              <div className="min-h-[32px] flex items-center">
                <Text size="2" weight="medium" className="text-white leading-relaxed">
                  Sidowayah, Panekan, Magetan Jawa Timur
                </Text>
              </div>
            </FieldCard>
          </div>
        </div>
        
        {/* CSS Animations */}
        <style>{`
          @keyframes gridMove {
            0% {
              transform: translate(0, 0);
            }
            100% {
              transform: translate(50px, 50px);
            }
          }
          
          @keyframes scan {
            0% {
              top: 0%;
            }
            100% {
              top: 100%;
            }
          }
          
          @keyframes borderRotate {
            0% {
              background-position: 0% 50%;
            }
            50% {
              background-position: 100% 50%;
            }
            100% {
              background-position: 0% 50%;
            }
          }
          
          .animate-scan {
            animation: scan 3s linear infinite;
          }
          
          .animate-border-rotate {
            animation: borderRotate 3s ease-in-out infinite;
          }
        `}</style>
      </Dialog.Content>
    </Dialog.Root>
  )
}
