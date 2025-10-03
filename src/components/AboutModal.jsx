import { useState } from 'react'
import { Dialog, Text, Badge } from '@radix-ui/themes'
import { X, User, Mail, Phone, Calendar, Info, Copy, Check } from 'lucide-react'

export function AboutModal({ open, onOpenChange }) {
  const [copiedField, setCopiedField] = useState(null)

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }
  // Icon color mapping
  const iconColors = {
    User: 'text-indigo-500',
    Mail: 'text-blue-500',
    Phone: 'text-green-500',
    Calendar: 'text-purple-500',
  }

  // Field item component for modal
  const FieldItem = ({ label, icon: Icon, children, fullWidth = false }) => {
    const iconColor = Icon ? iconColors[Icon.name] || 'text-slate-400' : ''
    
    return (
      <div className={`${fullWidth ? 'col-span-2' : ''}`}>
        <div className="border-b border-slate-200 pb-3">
          <div className="flex items-center gap-1.5 mb-2">
            {Icon && <Icon className={`h-3.5 w-3.5 ${iconColor}`} />}
            <Text size="1" weight="medium" className="text-slate-500 uppercase tracking-wider text-[0.65rem]">
              {label}
            </Text>
          </div>
          <div className="ml-5">
            {children}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content 
        style={{ 
          maxWidth: '90vw',
          width: '800px',
          maxHeight: '90vh',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center bg-indigo-600 border border-indigo-700 shadow-sm">
              <Info className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="mb-0.5">
                <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                  Tentang Aplikasi
                </Text>
              </div>
              <Text size="1" className="text-slate-500 italic">
                Informasi aplikasi dan pengembang
              </Text>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-50 hover:border-red-400 transition-all border border-slate-300 group"
            aria-label="Close"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-auto p-6 bg-white" style={{ maxHeight: 'calc(90vh - 160px)' }}>
          {/* App Info Section */}
          <div className="bg-slate-50 border-2 border-slate-300 p-4 mb-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <Text size="1" className="text-slate-500 uppercase tracking-wider text-[0.65rem] mb-2 block font-medium">
                  Nama Aplikasi
                </Text>
                <div className="mb-1">
                  <Text size="6" weight="bold" className="text-slate-900 leading-tight">
                    ArtaPay
                  </Text>
                </div>
                <Text size="1" className="text-slate-500 italic leading-relaxed">
                  Platform manajemen keuangan sekolah yang modern dan transparan
                </Text>
              </div>
              <div className="flex flex-col gap-2 shrink-0 ml-4">
                <Badge
                  variant="solid"
                  color="indigo"
                  size="2"
                  className="text-xs font-semibold px-3 py-1.5"
                  style={{ borderRadius: 0 }}
                >
                  v1.0.0
                </Badge>
                <Badge
                  variant="soft"
                  color="green"
                  size="2"
                  className="text-xs font-semibold px-3 py-1.5"
                  style={{ borderRadius: 0 }}
                >
                  2025
                </Badge>
              </div>
            </div>
          </div>

          {/* Grid Layout - 2 columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Nama Pengembang */}
            <FieldItem label="Nama Lengkap" icon={User} fullWidth>
              <Text size="3" weight="medium" className="text-slate-900">
                Aris Dianto
              </Text>
            </FieldItem>

            {/* Email */}
            <FieldItem label="Email" icon={Mail}>
              <div className="flex items-center justify-between gap-3">
                <a 
                  href="mailto:arisdianto.mdn@gmail.com" 
                  className="text-slate-700 hover:text-blue-600 transition-colors"
                >
                  <Text size="2" weight="medium" className="hover:underline">
                    arisdianto.mdn@gmail.com
                  </Text>
                </a>
                <button
                  onClick={() => handleCopy('arisdianto.mdn@gmail.com', 'email')}
                  className="flex h-6 w-6 items-center justify-center bg-red-500 hover:bg-red-600 border border-red-600 transition-all group shrink-0"
                  title="Copy email"
                >
                  {copiedField === 'email' ? (
                    <Check className="h-3 w-3 text-white" />
                  ) : (
                    <Copy className="h-3 w-3 text-white" />
                  )}
                </button>
              </div>
            </FieldItem>

            {/* WhatsApp */}
            <FieldItem label="WhatsApp" icon={Phone}>
              <div className="flex items-center justify-between gap-3">
                <a 
                  href="https://wa.me/62081231274828" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-slate-700 hover:text-green-600 transition-colors"
                >
                  <Text size="2" weight="medium" className="font-mono hover:underline">
                    +62 812-3127-4828
                  </Text>
                </a>
                <button
                  onClick={() => handleCopy('https://wa.me/62081231274828', 'whatsapp')}
                  className="flex h-6 w-6 items-center justify-center bg-red-500 hover:bg-red-600 border border-red-600 transition-all group shrink-0"
                  title="Copy WhatsApp link"
                >
                  {copiedField === 'whatsapp' ? (
                    <Check className="h-3 w-3 text-white" />
                  ) : (
                    <Copy className="h-3 w-3 text-white" />
                  )}
                </button>
              </div>
            </FieldItem>

            {/* Tahun Rilis */}
            <FieldItem label="Tahun Rilis" icon={Calendar}>
              <Text size="2" weight="medium" className="text-slate-700">
                2025
              </Text>
            </FieldItem>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <div className="flex items-center justify-between">
            <Text size="1" className="text-slate-600 font-medium">
              © 2025 ArtaPay. All rights reserved.
            </Text>
            <button
              onClick={() => onOpenChange(false)}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm hover:shadow border border-indigo-700"
              style={{ borderRadius: 0 }}
            >
              Tutup
            </button>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
