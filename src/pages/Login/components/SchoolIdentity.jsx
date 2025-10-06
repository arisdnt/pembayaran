import { Heading, Text } from '@radix-ui/themes'
import {
  getSchoolName,
  getSchoolAddress,
  getSchoolPhone,
  getSchoolEmail,
  getSchoolWebsite,
  getAppPublisher,
  getAppSupportEmail,
  getAppLegalNotice,
} from '../../../config/appInfo'

export function SchoolIdentity() {
  const schoolName = getSchoolName()
  const schoolAddress = getSchoolAddress()
  const schoolPhone = getSchoolPhone()
  const schoolEmail = getSchoolEmail()
  const schoolWebsite = getSchoolWebsite()
  const appPublisher = getAppPublisher()
  const appSupportEmail = getAppSupportEmail()
  const appLegalNotice = getAppLegalNotice()

  return (
    <div className="w-3/4 bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 flex items-end justify-start p-10 relative overflow-hidden">
      <style>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradientShift 8s ease infinite;
        }
      `}</style>
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'url(/login.jpg)', backgroundSize: 'cover', backgroundPosition: 'center' }} />
      <div className="absolute inset-0 bg-gradient-to-br from-blue-800/25 via-slate-800/15 to-blue-900/30" />

      <div className="relative z-10 w-full max-w-md bg-white/10 border border-white/20 backdrop-blur-md shadow-2xl p-8 text-white flex flex-col space-y-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 flex items-center justify-center border border-white/30 bg-white/5" style={{ borderRadius: 0 }}>
            <img
              src="/logo.svg"
              alt={`Logo ${schoolName}`}
              className="w-16 h-16 object-contain drop-shadow-[0_6px_12px_rgba(15,23,42,0.45)]"
              loading="lazy"
            />
          </div>
          <div>
            <Heading
              size="6"
              className="text-transparent bg-clip-text bg-gradient-to-r from-blue-100 via-cyan-200 to-blue-200 animate-gradient font-bold tracking-wide mb-1"
            >
              {schoolName}
            </Heading>
            {schoolWebsite ? (
              <Text className="text-blue-100/90 text-sm">{schoolWebsite.replace(/^https?:\/\//, "")}</Text>
            ) : null}
          </div>
        </div>

        <div className="space-y-2 text-sm">
          <div className="grid grid-cols-[100px_auto_1fr] gap-2 items-start">
            <Text className="text-blue-200 font-medium">Alamat</Text>
            <Text className="text-white/90">:</Text>
            <Text className="text-white/90">{schoolAddress || 'Alamat belum dikonfigurasi'}</Text>
          </div>

          <div className="grid grid-cols-[100px_auto_1fr] gap-2 items-start">
            <Text className="text-blue-200 font-medium">Telepon</Text>
            <Text className="text-white/90">:</Text>
            <Text className="text-white/90">{schoolPhone || '-'}</Text>
          </div>

          <div className="grid grid-cols-[100px_auto_1fr] gap-2 items-start">
            <Text className="text-blue-200 font-medium">Email</Text>
            <Text className="text-white/90">:</Text>
            <Text className="text-white/90">{schoolEmail || '-'}</Text>
          </div>
        </div>

        <div className="border-t border-white/20 pt-4 space-y-2">
          <div className="grid grid-cols-[100px_auto_1fr] gap-2 items-start text-xs">
            <Text className="text-blue-200 font-medium">Pengembang</Text>
            <Text className="text-white/80">:</Text>
            <Text className="text-white/80">{appPublisher}</Text>
          </div>
          <div className="grid grid-cols-[100px_auto_1fr] gap-2 items-start text-xs">
            <Text className="text-blue-200 font-medium">Dukungan</Text>
            <Text className="text-white/80">:</Text>
            <Text className="text-white/80">{appSupportEmail}</Text>
          </div>
          <div className="grid grid-cols-[100px_auto_1fr] gap-2 items-start text-xs">
            <Text className="text-blue-200 font-medium">Copyright</Text>
            <Text className="text-white/80">:</Text>
            <Text className="text-white/80">{appLegalNotice.replace(/^Copyright\s*/i, '')}</Text>
          </div>
        </div>
      </div>
    </div>
  )
}
