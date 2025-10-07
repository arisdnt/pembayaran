import { DropdownMenu, Text } from '@radix-ui/themes'
import { ExitIcon, GearIcon } from '@radix-ui/react-icons'
import { User } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../contexts/AuthContext'
import { db } from '../../offline/db'

export function NavbarUserMenu() {
  const { user } = useAuth()
  const navigate = useNavigate()

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error) {
      console.error('Gagal logout:', error)
    } finally {
      try {
        await Promise.all(db.tables.map((table) => table.clear()))
      } catch (dexieError) {
        console.warn('Tidak dapat menghapus cache lokal Dexie:', dexieError)
      }
      navigate('/login', { replace: true })
    }
  }

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <button
          className="h-8 w-8 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          style={{ WebkitAppRegion: 'no-drag' }}
          type="button"
          aria-label="Menu pengguna"
        >
          <User className="h-4 w-4" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content align="end" className="w-[280px] p-0" style={{ borderRadius: 0 }}>
        <div className="px-3 py-3 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-indigo-100 border border-indigo-300">
              <User className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="flex-1 min-w-0">
              <Text size="2" weight="bold" className="text-slate-900 truncate block">
                {user?.email?.split('@')[0] || 'User'}
              </Text>
              <Text size="1" className="text-slate-500 truncate block" title={user?.email}>
                {user?.email}
              </Text>
            </div>
          </div>
        </div>

        <div className="py-2">
          <DropdownMenu.Item
            className="profile-menu-item px-3 py-2 cursor-pointer transition-colors flex items-center gap-3 group hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent outline-none"
            onClick={() => navigate('/ubah-password')}
          >
            <div className="flex h-8 w-8 items-center justify-center border border-slate-300 bg-slate-50 transition-colors">
              <GearIcon className="h-4 w-4 text-slate-600 group-hover:text-indigo-600 transition-colors" />
            </div>
            <div className="flex-1">
              <Text size="2" weight="medium" className="text-slate-800 group-hover:text-indigo-600 transition-colors">
                Ubah Password
              </Text>
              <Text size="1" className="text-slate-500 transition-colors block">
                Perbarui kata sandi akun
              </Text>
            </div>
          </DropdownMenu.Item>

          <div className="border-t border-slate-200 mx-3 my-2" />

          <DropdownMenu.Item
            className="profile-menu-item px-3 py-2 cursor-pointer transition-colors flex items-center gap-3 group hover:bg-transparent focus:bg-transparent data-[highlighted]:bg-transparent outline-none"
            onClick={handleLogout}
          >
            <div className="flex h-8 w-8 items-center justify-center border border-slate-300 bg-slate-50 transition-colors">
              <ExitIcon className="h-4 w-4 text-slate-600 group-hover:text-red-600 transition-colors" />
            </div>
            <div className="flex-1">
              <Text size="2" weight="medium" className="text-slate-800 group-hover:text-red-600 transition-colors">
                Sign Out
              </Text>
              <Text size="1" className="text-slate-500 transition-colors block">
                Keluar dari aplikasi
              </Text>
            </div>
          </DropdownMenu.Item>
        </div>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  )
}
