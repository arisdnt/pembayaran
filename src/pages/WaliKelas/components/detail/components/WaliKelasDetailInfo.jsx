import { Text, Badge } from '@radix-ui/themes'
import { Phone, Mail, Key, Hash, Power, PowerOff } from 'lucide-react'

export function WaliKelasDetailInfo({ waliKelas }) {
  return (
    <div className="space-y-3">
      {/* Nama & Status */}
      <div className="p-3 bg-slate-50 border border-slate-300">
        <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider mb-2 block">
          Informasi Utama
        </Text>
        <Text size="3" weight="bold" className="text-slate-900 mb-2 block">
          {waliKelas.nama_lengkap}
        </Text>
        <div className="flex items-center gap-2">
          {waliKelas.status_aktif ? (
            <Badge color="green" variant="solid" style={{ borderRadius: 0 }}>
              <Power className="h-3 w-3 mr-1" />
              Aktif
            </Badge>
          ) : (
            <Badge color="red" variant="solid" style={{ borderRadius: 0 }}>
              <PowerOff className="h-3 w-3 mr-1" />
              Non-Aktif
            </Badge>
          )}
        </div>
      </div>

      {/* NIP */}
      {waliKelas.nip && (
        <div className="p-3 bg-white border border-slate-300">
          <div className="flex items-center gap-2 mb-1">
            <Key className="h-4 w-4 text-purple-500" />
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
              NIP
            </Text>
          </div>
          <Text size="2" className="text-slate-900 font-semibold">
            {waliKelas.nip}
          </Text>
        </div>
      )}

      {/* Nomor Telepon */}
      {waliKelas.nomor_telepon && (
        <div className="p-3 bg-white border border-slate-300">
          <div className="flex items-center gap-2 mb-1">
            <Phone className="h-4 w-4 text-green-500" />
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
              Nomor Telepon
            </Text>
          </div>
          <Text size="2" className="text-slate-900 font-semibold">
            {waliKelas.nomor_telepon}
          </Text>
        </div>
      )}

      {/* Email */}
      {waliKelas.email && (
        <div className="p-3 bg-white border border-slate-300">
          <div className="flex items-center gap-2 mb-1">
            <Mail className="h-4 w-4 text-amber-500" />
            <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
              Email
            </Text>
          </div>
          <Text size="2" className="text-slate-900">
            {waliKelas.email}
          </Text>
        </div>
      )}

      {/* ID */}
      <div className="p-3 bg-slate-50 border border-slate-300">
        <div className="flex items-center gap-2 mb-1">
          <Hash className="h-4 w-4 text-blue-500" />
          <Text size="1" weight="medium" className="text-slate-600 uppercase tracking-wider">
            ID
          </Text>
        </div>
        <Text size="1" className="text-slate-500 font-mono break-all">
          {waliKelas.id}
        </Text>
      </div>
    </div>
  )
}
