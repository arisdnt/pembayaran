import { Button, DropdownMenu, Separator } from '@radix-ui/themes'
import { ChevronDownIcon } from '@radix-ui/react-icons'
import { useNavigate, useLocation } from 'react-router-dom'
import { GraduationCap, Wallet, Info } from 'lucide-react'
import { menuSections } from '../../config/menuData'

const sectionIcons = {
  'Akademik': GraduationCap,
  'Keuangan': Wallet,
  'Info': Info,
}

const sectionIconColors = {
  'Utama': 'text-blue-300',
  'Akademik': 'text-green-300',
  'Keuangan': 'text-amber-300',
  'Sync Status': 'text-cyan-300',
  'About': 'text-purple-300',
}

export function NavbarMenu({ onAboutClick }) {
  const navigate = useNavigate()
  const location = useLocation()
  
  const isActive = (href) => location.pathname === href

  return (
    <div className="hidden md:flex items-center gap-4">
      {menuSections.map((section, index) => {
        if (section.items.length === 1) {
          const item = section.items[0]
          const Icon = item.icon
          const active = isActive(item.href)
          const iconColor = sectionIconColors[section.title] || 'text-white'
          const isAboutMenu = section.title === 'About'
          
          return (
            <div key={section.title} className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="2"
                onClick={() => {
                  if (item.href === '/about') {
                    onAboutClick()
                  } else {
                    navigate(item.href)
                  }
                }}
                className={`text-white transition-all cursor-pointer font-semibold ${
                  isAboutMenu
                    ? 'bg-gradient-to-r from-purple-400/25 via-pink-400/25 to-purple-400/25 hover:from-purple-400/35 hover:via-pink-400/35 hover:to-purple-400/35 border border-purple-300/40 shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30'
                    : active
                      ? 'bg-white/20 text-white hover:bg-white/10'
                      : 'hover:bg-white/10'
                }`}
                style={isAboutMenu ? {
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  WebkitAppRegion: 'no-drag'
                } : { WebkitAppRegion: 'no-drag' }}
              >
                <Icon className={`h-4 w-4 ${isAboutMenu ? 'text-purple-200' : iconColor}`} />
                {item.label}
              </Button>
              {index < menuSections.length - 1 && (
                <Separator orientation="vertical" size="1" className="h-6 bg-white/20" />
              )}
            </div>
          )
        }

        const SectionIcon = sectionIcons[section.title]
        const iconColor = sectionIconColors[section.title] || 'text-white'
        
        return (
          <div key={section.title} className="flex items-center gap-4">
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>
                <Button
                  variant="ghost"
                  size="2"
                  className="text-white/90 hover:text-white hover:bg-white/10 transition-colors cursor-pointer font-medium"
                  style={{ WebkitAppRegion: 'no-drag' }}
                >
                  {SectionIcon && <SectionIcon className={`h-4 w-4 ${iconColor}`} />}
                  {section.title}
                  <ChevronDownIcon className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenu.Trigger>

              <DropdownMenu.Content 
                className="min-w-[200px] mt-1 p-1 bg-white border border-slate-200 shadow-lg" 
                style={{ borderRadius: 0 }}
              >
                {section.items.map((item) => {
                  const Icon = item.icon
                  const active = isActive(item.href)

                  return (
                    <DropdownMenu.Item
                      key={item.href}
                      onClick={() => {
                        if (item.href === '/about') {
                          onAboutClick()
                        } else {
                          navigate(item.href)
                        }
                      }}
                      className={`flex items-center gap-3 px-3 py-2 cursor-pointer ${
                        active ? 'bg-blue-50' : ''
                      }`}
                    >
                      <Icon className={`h-4 w-4 ${iconColor}`} />
                      <span>{item.label}</span>
                    </DropdownMenu.Item>
                  )
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Root>
            {index < menuSections.length - 1 && (
              <Separator orientation="vertical" size="1" className="h-6 bg-white/20" />
            )}
          </div>
        )
      })}
    </div>
  )
}
