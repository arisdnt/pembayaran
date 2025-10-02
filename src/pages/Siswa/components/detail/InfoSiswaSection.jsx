import { Text } from '@radix-ui/themes'
import { User, Hash, Calendar, MapPin, Phone, IdCard } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

export function InfoSiswaSection({ siswa }) {
  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-blue-600" />
          <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
            Informasi Siswa
          </Text>
        </div>
      </div>

      <div className="p-4 grid grid-cols-2 gap-x-8">
        {/* Kolom Kiri */}
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4 text-slate-600 font-medium w-40">Nama Lengkap</td>
              <td className="py-2 text-slate-900 font-bold">{siswa.nama_lengkap}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4 text-slate-600 font-medium">NISN</td>
              <td className="py-2 text-slate-900 font-mono">{siswa.nisn || '-'}</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 text-slate-600 font-medium">Jenis Kelamin</td>
              <td className="py-2 text-slate-900">
                {siswa.jenis_kelamin === 'L' ? 'Laki-laki' : siswa.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Kolom Kanan */}
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4 text-slate-600 font-medium w-40">Tanggal Lahir</td>
              <td className="py-2 text-slate-900">{formatDate(siswa.tanggal_lahir)}</td>
            </tr>
            <tr className="border-b border-slate-200">
              <td className="py-2 pr-4 text-slate-600 font-medium">Alamat</td>
              <td className="py-2 text-slate-900">{siswa.alamat || '-'}</td>
            </tr>
            <tr>
              <td className="py-2 pr-4 text-slate-600 font-medium">No. WhatsApp Wali</td>
              <td className="py-2 text-slate-900 font-mono">{siswa.nomor_whatsapp_wali || '-'}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
