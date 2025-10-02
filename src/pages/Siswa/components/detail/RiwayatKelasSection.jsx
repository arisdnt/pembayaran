import { Text, Badge } from '@radix-ui/themes'
import { History, Calendar, GraduationCap } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

function getStatusBadge(status) {
  const statusMap = {
    aktif: { color: 'green', label: 'Aktif' },
    pindah_kelas: { color: 'blue', label: 'Pindah Kelas' },
    lulus: { color: 'purple', label: 'Lulus' },
    keluar: { color: 'gray', label: 'Keluar' },
  }
  
  const config = statusMap[status] || { color: 'gray', label: status }
  
  return (
    <Badge color={config.color} variant="solid" style={{ borderRadius: 0 }}>
      {config.label}
    </Badge>
  )
}

export function RiwayatKelasSection({ riwayatKelas }) {
  if (!riwayatKelas || riwayatKelas.length === 0) {
    return null
  }

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-purple-600" />
          <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
            Riwayat Kelas
          </Text>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-300">
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tahun Ajaran</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Kelas</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tanggal Masuk</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tanggal Keluar</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Catatan</th>
              <th className="px-4 py-2 text-center text-slate-700 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {riwayatKelas.map((riwayat, index) => (
              <tr key={riwayat.id} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                <td className="px-4 py-2 text-slate-900 border-r border-slate-200">{riwayat.tahun_ajaran?.nama || '-'}</td>
                <td className="px-4 py-2 text-slate-900 border-r border-slate-200">
                  Kelas {riwayat.kelas?.tingkat || '-'} {riwayat.kelas?.nama_sub_kelas || '-'}
                </td>
                <td className="px-4 py-2 text-slate-900 border-r border-slate-200">{formatDate(riwayat.tanggal_masuk)}</td>
                <td className="px-4 py-2 text-slate-900 border-r border-slate-200">
                  {riwayat.tanggal_keluar ? formatDate(riwayat.tanggal_keluar) : '-'}
                </td>
                <td className="px-4 py-2 text-slate-600 italic border-r border-slate-200">{riwayat.catatan || '-'}</td>
                <td className="px-4 py-2 text-center">{getStatusBadge(riwayat.status)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
