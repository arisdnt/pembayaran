import { Text, Badge } from '@radix-ui/themes'
import { BookOpen, Calendar } from 'lucide-react'

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  })
}

export function PeminatanSection({ peminatan }) {
  if (!peminatan || peminatan.length === 0) {
    return null
  }

  return (
    <div className="border-2 border-slate-300 bg-white shadow-lg">
      <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2">
        <div className="flex items-center gap-2">
          <BookOpen className="h-4 w-4 text-indigo-600" />
          <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
            Riwayat Peminatan
          </Text>
        </div>
      </div>

      <div className="overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="bg-slate-50">
            <tr className="border-b border-slate-300">
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Peminatan</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Kode</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tahun Ajaran</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tingkat</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tanggal Mulai</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Tanggal Selesai</th>
              <th className="px-4 py-2 text-left text-slate-700 font-semibold border-r border-slate-200">Catatan</th>
              <th className="px-4 py-2 text-center text-slate-700 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {peminatan.map((item, index) => (
              <tr key={item.id} className={`border-b border-slate-200 ${index % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                <td className="px-4 py-2 text-slate-900 border-r border-slate-200">{item.peminatan?.nama || '-'}</td>
                <td className="px-4 py-2 text-slate-900 border-r border-slate-200">
                  <Badge color="indigo" variant="soft" style={{ borderRadius: 0 }}>
                    {item.peminatan?.kode || '-'}
                  </Badge>
                </td>
                <td className="px-4 py-2 text-slate-900 border-r border-slate-200">{item.tahun_ajaran?.nama || '-'}</td>
                <td className="px-4 py-2 text-slate-900 border-r border-slate-200">{item.tingkat}</td>
                <td className="px-4 py-2 text-slate-900 border-r border-slate-200">{formatDate(item.tanggal_mulai)}</td>
                <td className="px-4 py-2 text-slate-900 border-r border-slate-200">
                  {item.tanggal_selesai ? formatDate(item.tanggal_selesai) : '-'}
                </td>
                <td className="px-4 py-2 text-slate-600 italic border-r border-slate-200">{item.catatan || '-'}</td>
                <td className="px-4 py-2 text-center">
                  {!item.tanggal_selesai && (
                    <Badge color="blue" variant="solid" style={{ borderRadius: 0 }}>
                      Berlangsung
                    </Badge>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
