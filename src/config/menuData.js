import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarRange,
  History,
  UserCog,
  ClipboardList,
  BookOpen,
  BookUser,
  BadgeDollarSign,
  Receipt,
  Wallet,
  Info,
} from 'lucide-react'

export const menuSections = [
  {
    title: 'Utama',
    items: [
      {
        icon: LayoutDashboard,
        label: 'Dashboard',
        href: '/dashboard',
      },
    ],
  },
  {
    title: 'Akademik',
    items: [
      {
        icon: Users,
        label: 'Siswa',
        href: '/siswa',
      },
      {
        icon: GraduationCap,
        label: 'Kelas',
        href: '/kelas',
      },
      {
        icon: CalendarRange,
        label: 'Tahun Ajaran',
        href: '/tahun-ajaran',
      },
      {
        icon: History,
        label: 'Riwayat Kelas Siswa',
        href: '/riwayat-kelas-siswa',
      },
      {
        icon: UserCog,
        label: 'Wali Kelas',
        href: '/wali-kelas',
      },
      {
        icon: ClipboardList,
        label: 'Riwayat Wali Kelas',
        href: '/riwayat-wali-kelas',
      },
      {
        icon: BookOpen,
        label: 'Peminatan',
        href: '/peminatan',
      },
      {
        icon: BookUser,
        label: 'Peminatan Siswa',
        href: '/peminatan-siswa',
      },
    ],
  },
  {
    title: 'Keuangan',
    items: [
      {
        icon: BadgeDollarSign,
        label: 'Jenis Pembayaran',
        href: '/jenis-pembayaran',
      },
      {
        icon: Receipt,
        label: 'Tagihan',
        href: '/tagihan',
      },
      {
        icon: Wallet,
        label: 'Pembayaran',
        href: '/pembayaran',
      },
    ],
  },
  {
    title: 'Info',
    items: [
      {
        icon: Info,
        label: 'About',
        href: '/about',
      },
    ],
  },
]
