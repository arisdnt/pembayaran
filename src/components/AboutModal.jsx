import { Dialog, Text, Badge } from '@radix-ui/themes'
import { X, User, Mail, Github, Linkedin, Phone, Calendar, Code, Heart } from 'lucide-react'

export function AboutModal({ open, onOpenChange }) {
  // Field item component for modal
  const FieldItem = ({ label, icon: Icon, iconColor, children, fullWidth = false }) => {
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
        {/* Header - Excel style */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center bg-indigo-600 border border-indigo-700 shadow-sm">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <Text size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                Tentang Aplikasi
              </Text>
              <Text size="1" className="text-slate-600">
                Informasi pengembang dan kontak
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
        <div className="overflow-auto p-6 bg-white" style={{ maxHeight: 'calc(90vh - 80px)' }}>
          {/* App Info Section */}
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border-2 border-slate-300 p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="flex h-14 w-14 items-center justify-center bg-indigo-600 border border-indigo-700 shadow-sm shrink-0">
                <Code className="h-7 w-7 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <Text size="5" weight="bold" className="text-slate-900 leading-tight mb-1">
                  Sistem Kas Sekolah Digital
                </Text>
                <Text size="2" className="text-slate-600 leading-relaxed">
                  Aplikasi manajemen keuangan sekolah yang modern, efisien, dan user-friendly
                </Text>
                <div className="flex items-center gap-2 mt-3">
                  <Badge
                    variant="solid"
                    color="indigo"
                    size="2"
                    className="text-xs font-semibold px-3 py-1"
                    style={{ borderRadius: 0 }}
                  >
                    v1.0.0
                  </Badge>
                  <Badge
                    variant="soft"
                    color="green"
                    size="2"
                    className="text-xs font-semibold px-3 py-1"
                    style={{ borderRadius: 0 }}
                  >
                    2025
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Developer Info */}
          <div className="bg-slate-50 border-2 border-slate-300 p-4 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="h-4 w-4 text-red-500" />
              <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Dikembangkan Dengan Sepenuh Hati
              </Text>
            </div>
          </div>

          {/* Grid Layout - 2 columns */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            {/* Nama Pengembang */}
            <FieldItem label="Nama Lengkap" icon={User} iconColor="text-indigo-500" fullWidth>
              <Text size="3" weight="bold" className="text-slate-900">
                [Nama Pengembang]
              </Text>
            </FieldItem>

            {/* Email */}
            <FieldItem label="Email" icon={Mail} iconColor="text-blue-500">
              <a 
                href="mailto:developer@example.com" 
                className="text-slate-700 hover:text-blue-600 transition-colors"
              >
                <Text size="2" weight="medium" className="hover:underline">
                  developer@example.com
                </Text>
              </a>
            </FieldItem>

            {/* WhatsApp */}
            <FieldItem label="WhatsApp" icon={Phone} iconColor="text-green-500">
              <a 
                href="https://wa.me/6281234567890" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-green-600 transition-colors"
              >
                <Text size="2" weight="medium" className="font-mono hover:underline">
                  +62 812-3456-7890
                </Text>
              </a>
            </FieldItem>

            {/* GitHub */}
            <FieldItem label="GitHub" icon={Github} iconColor="text-slate-700">
              <a 
                href="https://github.com/username" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-slate-900 transition-colors"
              >
                <Text size="2" weight="medium" className="hover:underline">
                  github.com/username
                </Text>
              </a>
            </FieldItem>

            {/* LinkedIn */}
            <FieldItem label="LinkedIn" icon={Linkedin} iconColor="text-blue-600">
              <a 
                href="https://linkedin.com/in/username" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-slate-700 hover:text-blue-700 transition-colors"
              >
                <Text size="2" weight="medium" className="hover:underline">
                  linkedin.com/in/username
                </Text>
              </a>
            </FieldItem>

            {/* Tahun Rilis */}
            <FieldItem label="Tahun Rilis" icon={Calendar} iconColor="text-purple-500">
              <Text size="2" weight="medium" className="text-slate-700">
                2025
              </Text>
            </FieldItem>
          </div>

          {/* Tech Stack Section */}
          <div className="mt-6 pt-6 border-t-2 border-slate-300">
            <div className="flex items-center gap-2 mb-3">
              <Code className="h-4 w-4 text-indigo-500" />
              <Text size="2" weight="bold" className="text-slate-700 uppercase tracking-wider">
                Teknologi Yang Digunakan
              </Text>
            </div>
            <div className="flex flex-wrap gap-2">
              {['React', 'Vite', 'Supabase', 'Tailwind CSS', 'Radix UI', 'Electron'].map((tech) => (
                <Badge
                  key={tech}
                  variant="soft"
                  color="indigo"
                  size="2"
                  className="text-sm px-3 py-1.5"
                  style={{ borderRadius: 0 }}
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Footer - Excel style */}
        <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <div className="flex items-center justify-between">
            <Text size="1" className="text-slate-600 font-medium">
              © 2025 Sistem Kas Sekolah Digital. All rights reserved.
            </Text>
            <div className="flex gap-2">
              <button
                onClick={() => onOpenChange(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition-colors shadow-sm hover:shadow border border-indigo-700"
                style={{ borderRadius: 0 }}
              >
                <span className="flex items-center gap-2">
                  <X className="h-4 w-4" />
                  Tutup
                </span>
              </button>
            </div>
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
