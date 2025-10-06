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

      <div className="p-4 grid grid-cols-3 gap-x-6">
        {/* Kolom 1 */}
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-slate-200 h-9">
              <td className="py-1.5 pr-4 text-slate-600 font-medium w-32">Nama Lengkap</td>
              <td className="py-1.5 text-slate-900 font-bold">{siswa.nama_lengkap}</td>
            </tr>
            <tr className="border-b border-slate-200 h-9">
              <td className="py-1.5 pr-4 text-slate-600 font-medium">NISN</td>
              <td className="py-1.5 text-slate-900 font-mono">{siswa.nisn || '-'}</td>
            </tr>
            <tr className="h-9">
              <td className="py-1.5 pr-4 text-slate-600 font-medium">Jenis Kelamin</td>
              <td className="py-1.5 text-slate-900">
                {siswa.jenis_kelamin === 'L' ? 'Laki-laki' : siswa.jenis_kelamin === 'P' ? 'Perempuan' : '-'}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Kolom 2 */}
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-slate-200 h-9">
              <td className="py-1.5 pr-4 text-slate-600 font-medium w-32">Tanggal Lahir</td>
              <td className="py-1.5 text-slate-900">{formatDate(siswa.tanggal_lahir)}</td>
            </tr>
            <tr className="border-b border-slate-200 h-9">
              <td className="py-1.5 pr-4 text-slate-600 font-medium">Alamat</td>
              <td className="py-1.5 text-slate-900">{siswa.alamat || '-'}</td>
            </tr>
            <tr className="h-9">
              <td className="py-1.5 pr-4 text-slate-600 font-medium"></td>
              <td className="py-1.5 text-slate-900"></td>
            </tr>
          </tbody>
        </table>

        {/* Kolom 3 */}
        <table className="w-full text-sm">
          <tbody>
            <tr className="border-b border-slate-200 h-9">
              <td className="py-1.5 pr-4 text-slate-600 font-medium w-32">Nama Wali</td>
              <td className="py-1.5 text-slate-900">{siswa.nama_wali_siswa || '-'}</td>
            </tr>
            <tr className="border-b border-slate-200 h-9">
              <td className="py-1.5 pr-4 text-slate-600 font-medium">No. WhatsApp</td>
              <td className="py-1.5 text-slate-900 font-mono">{siswa.nomor_whatsapp_wali || '-'}</td>
            </tr>
            <tr className="h-9">
              <td className="py-1.5 pr-4 text-slate-600 font-medium"></td>
              <td className="py-1.5 text-slate-900"></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
