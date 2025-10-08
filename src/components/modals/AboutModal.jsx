import { useState } from 'react'
import { Dialog, Text } from '@radix-ui/themes'
import { User, Mail, Phone, Calendar, Code, Shield, MapPin } from 'lucide-react'

export function AboutModal({ open, onOpenChange }) {
  const [copiedField, setCopiedField] = useState(null)

  const handleCopy = async (text, field) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedField(field)
      setTimeout(() => setCopiedField(null), 1500)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const Row = ({ icon: Icon, label, value, href, copyId }) => {
    const getIconColor = () => {
      switch (Icon) {
        case User: return "text-blue-600"
        case Mail: return "text-green-600"
        case Phone: return "text-emerald-600"
        case Calendar: return "text-purple-600"
        case MapPin: return "text-red-600"
        default: return "text-slate-600"
      }
    }

    const getBgColor = () => {
      switch (Icon) {
        case User: return "bg-blue-50 border-blue-200"
        case Mail: return "bg-green-50 border-green-200"
        case Phone: return "bg-emerald-50 border-emerald-200"
        case Calendar: return "bg-purple-50 border-purple-200"
        case MapPin: return "bg-red-50 border-red-200"
        default: return "bg-slate-50 border-slate-200"
      }
    }

    return (
    <div className="grid grid-cols-[28px_1fr_auto] items-start gap-3 py-2 border-b border-slate-200 last:border-0">
      <div className={`flex items-center justify-center h-7 w-7 ${getBgColor()} mt-0.5`}>
        <Icon className={`h-3.5 w-3.5 ${getIconColor()}`} />
      </div>
      <div className="min-w-0 flex flex-col">
        <Text size="1" className="text-slate-500 uppercase tracking-wider leading-tight">{label}</Text>
        {href ? (
          <a
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel="noopener noreferrer"
            className="text-sm font-medium text-blue-700 hover:underline truncate mt-0.5 leading-tight"
          >
            {value}
          </a>
        ) : (
          <div className="text-sm font-medium text-slate-900 truncate mt-0.5 leading-tight">{value}</div>
        )}
      </div>
      {copyId && (
        <button
          onClick={() => handleCopy(value, copyId)}
          className={`h-7 px-3 text-xs font-semibold uppercase tracking-wider mt-0.5 transition-all duration-200 ${
            copiedField === copyId
              ? 'bg-green-600 text-white border border-green-600'
              : 'bg-blue-600 text-white border border-blue-600 hover:bg-blue-700 hover:border-blue-700'
          }`}
        >
          {copiedField === copyId ? 'Copied' : 'Copy'}
        </button>
      )}
    </div>
    )
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{ maxWidth: '92vw', width: '720px', padding: 0, borderRadius: 0 }}
        className="border border-slate-300 shadow-2xl bg-white"
      >
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-3 border-b border-slate-300 bg-gradient-to-b from-slate-50 to-white">
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 items-center justify-center bg-slate-800 text-white mt-1">
              <Code className="h-4 w-4" />
            </div>
            <div className="flex flex-col">
              <Text size="3" weight="bold" className="text-slate-900 leading-tight">Tentang Aplikasi</Text>
              <Text size="1" className="text-slate-500 leading-tight mt-0.5">Ringkas, aman, dan efisien</Text>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs font-semibold shadow-sm">
              v1.0.0
            </div>
            <div className="px-3 py-1.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-xs font-semibold shadow-sm">
              2025
            </div>
            <div className="px-3 py-1.5 bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5">
              <Shield className="h-3 w-3" />
              Secure
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 p-5">
          <div className="md:col-span-2 mb-1 flex flex-col">
            <Text size="5" weight="bold" className="text-slate-900 leading-tight relative inline-block">
              ArtaPay
              <span className="absolute bottom-1 left-0 w-16 h-3 bg-yellow-300 opacity-60 -z-10"></span>
            </Text>
            <Text size="2" className="text-slate-600 leading-relaxed mt-1">Platform manajemen keuangan sekolah yang modern dan transparan</Text>
          </div>

          <div className="md:col-span-2 border-t border-slate-200 my-2" />

          <Row icon={User} label="Developer" value="Aris Dianto" />
          <Row icon={Mail} label="Email" value="arisdianto.mdn@gmail.com" href="mailto:arisdianto.mdn@gmail.com" copyId="email" />
          <Row icon={Phone} label="WhatsApp" value="+62 812-3127-4828" href="https://wa.me/62081231274828" copyId="whatsapp" />
          <Row icon={Calendar} label="Release Year" value="2025" />
          <Row icon={MapPin} label="Address" value="Sidowayah, Panekan, Magetan Jawa Timur" />
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}

