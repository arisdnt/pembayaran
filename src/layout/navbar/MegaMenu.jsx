import { useState, useRef, useEffect } from 'react'
import { Button, Separator } from '@radix-ui/themes'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useNavigate, useLocation } from 'react-router-dom'

const menuDescriptions = {
  'Dashboard': 'Ringkasan data dan statistik',
  'Siswa': 'Data siswa dan profil',
  'Kelas': 'Pengelolaan kelas',
  'Tahun Ajaran': 'Periode tahun akademik',
  'Riwayat Kelas Siswa': 'Histori kelas per siswa',
  'Wali Kelas': 'Data wali kelas aktif',
  'Riwayat Wali Kelas': 'Histori wali kelas',
  'Peminatan': 'Jurusan dan peminatan',
  'Peminatan Siswa': 'Peminatan per siswa',
  'Jenis Pembayaran': 'Kategori pembayaran',
  'Tagihan': 'Daftar tagihan siswa',
  'Pembayaran': 'Transaksi pembayaran',
  'Kirim Pesan': 'Notifikasi WhatsApp',
  'Sync Status': 'Status sinkronisasi data',
  'About': 'Informasi aplikasi',
}

const iconColorClasses = {
  'Dashboard': 'text-blue-600 bg-blue-50 border-blue-200',
  'Siswa': 'text-indigo-600 bg-indigo-50 border-indigo-200',
  'Kelas': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  'Tahun Ajaran': 'text-teal-600 bg-teal-50 border-teal-200',
  'Riwayat Kelas Siswa': 'text-cyan-600 bg-cyan-50 border-cyan-200',
  'Wali Kelas': 'text-green-600 bg-green-50 border-green-200',
  'Riwayat Wali Kelas': 'text-lime-600 bg-lime-50 border-lime-200',
  'Peminatan': 'text-purple-600 bg-purple-50 border-purple-200',
  'Peminatan Siswa': 'text-violet-600 bg-violet-50 border-violet-200',
  'Jenis Pembayaran': 'text-amber-600 bg-amber-50 border-amber-200',
  'Tagihan': 'text-orange-600 bg-orange-50 border-orange-200',
  'Pembayaran': 'text-yellow-600 bg-yellow-50 border-yellow-200',
  'Kirim Pesan': 'text-rose-600 bg-rose-50 border-rose-200',
  'Sync Status': 'text-sky-600 bg-sky-50 border-sky-200',
  'About': 'text-fuchsia-600 bg-fuchsia-50 border-fuchsia-200',
}

export function MegaMenu({ section, sectionIcon: SectionIcon, sectionIconColor, onAboutClick }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef(null)
  const menuRef = useRef(null)

  const isActive = (href) => location.pathname === href

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsOpen(true), 150)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setIsOpen(false), 200)
  }

  const handleItemClick = (item) => {
    setIsOpen(false)
    if (item.href === '/about') {
      onAboutClick()
    } else {
      navigate(item.href)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  const shouldUseGrid = section.items.length >= 4

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      ref={menuRef}
    >
      <Button
        variant="ghost"
        size="2"
        className={`text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer font-medium ${
          isOpen ? 'bg-white/15 text-white' : ''
        }`}
        style={{ 
          borderRadius: 0,
          WebkitAppRegion: 'no-drag' 
        }}
      >
        {SectionIcon && <SectionIcon className={`h-4 w-4 ${sectionIconColor}`} />}
        {section.title}
        <ChevronDownIcon className={`h-4 w-4 ml-1 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <div
          className="absolute top-full left-0 mt-1 bg-white border border-slate-200 shadow-xl z-50 animate-fade-in"
          style={{ 
            borderRadius: 0,
            minWidth: shouldUseGrid ? '580px' : '320px',
            maxWidth: shouldUseGrid ? '600px' : '340px',
          }}
        >
          <div 
            className={`p-3 ${
              shouldUseGrid ? 'grid grid-cols-2 gap-2' : 'flex flex-col gap-1'
            }`}
          >
            {section.items.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              const iconBgClass = iconColorClasses[item.label] || 'text-slate-600 bg-slate-50 border-slate-200'

              return (
                <button
                  key={item.href}
                  onClick={() => handleItemClick(item)}
                  className={`flex items-start gap-3 px-3 py-2.5 cursor-pointer transition-all group text-left ${
                    active 
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                      : 'hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white'
                  }`}
                  style={{ 
                    borderRadius: 0,
                    WebkitAppRegion: 'no-drag' 
                  }}
                >
                  <div 
                    className={`flex-shrink-0 h-9 w-9 flex items-center justify-center border transition-colors ${
                      active 
                        ? 'bg-white/20 border-white/30 text-white' 
                        : `${iconBgClass} group-hover:bg-white/20 group-hover:border-white/30 group-hover:text-white`
                    }`}
                    style={{ borderRadius: 0 }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div 
                      className={`font-semibold text-sm mb-0.5 ${
                        active ? 'text-white' : 'text-slate-800 group-hover:text-white'
                      }`}
                    >
                      {item.label}
                    </div>
                    <div 
                      className={`text-xs ${
                        active ? 'text-white/80' : 'text-slate-500 group-hover:text-white/80'
                      }`}
                    >
                      {menuDescriptions[item.label] || 'Menu item'}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
