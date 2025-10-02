import { Heading, Text } from '@radix-ui/themes'

export function SchoolIdentity() {
  return (
    <div
      className="w-3/4 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 flex items-end justify-start p-12 relative"
      style={{
        backgroundImage: 'url(/login.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Overlay untuk membuat text lebih terbaca */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-slate-900/30 to-blue-900/50"></div>

      {/* Info Card - Kiri Bawah - Glassmorphism */}
      <div className="relative z-10 bg-white/20 border border-white/30 p-8 max-w-md backdrop-blur-xl shadow-2xl">
        {/* Header dengan Icon */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-white/40">
          <div className="w-16 h-16 bg-white/20 border border-white/40 flex items-center justify-center backdrop-blur-md">
            <svg
              className="w-8 h-8 text-white"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
            </svg>
          </div>
          <div>
            <Heading size="6" className="text-white font-bold uppercase tracking-wider drop-shadow-lg">
              Sistem Kas Sekolah
            </Heading>
            <Text size="2" className="text-white/90 font-medium tracking-wide">
              Manajemen Keuangan Digital
            </Text>
          </div>
        </div>

        {/* Description */}
        <div className="mb-6">
          <Text size="2" className="text-white/90 leading-relaxed">
            Sistem informasi keuangan yang memudahkan pengelolaan pembayaran,
            tagihan, dan administrasi kas sekolah secara efisien dan transparan.
          </Text>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/40">
          <div className="text-center border border-white/30 bg-white/10 p-3 backdrop-blur-md">
            <div className="text-lg font-bold text-white mb-1 drop-shadow-md">Real-time</div>
            <div className="text-white/80 text-xs uppercase tracking-wider">Monitoring</div>
          </div>
          <div className="text-center border border-white/30 bg-white/10 p-3 backdrop-blur-md">
            <div className="text-lg font-bold text-white mb-1 drop-shadow-md">100%</div>
            <div className="text-white/80 text-xs uppercase tracking-wider">Transparan</div>
          </div>
          <div className="text-center border border-white/30 bg-white/10 p-3 backdrop-blur-md">
            <div className="text-lg font-bold text-white mb-1 drop-shadow-md">Aman</div>
            <div className="text-white/80 text-xs uppercase tracking-wider">Terpercaya</div>
          </div>
        </div>
      </div>
    </div>
  )
}
