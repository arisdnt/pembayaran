import { Text } from '@radix-ui/themes'
import { CheckCircle2, Clock, XCircle, Trash2 } from 'lucide-react'

export default function MessageTable({ data, loading, onDelete }) {
  return (
    <div className="h-full overflow-auto border">
      <table className="w-full text-sm" style={{ tableLayout: 'fixed' }}>
        <thead className="bg-slate-100 sticky top-0 z-10">
          <tr>
            <th className="px-2 py-2 text-left font-semibold border-b bg-slate-100" style={{ width: '9%' }}>Nomor</th>
            <th className="px-2 py-2 text-left font-semibold border-b bg-slate-100" style={{ width: '11%' }}>Tahun Ajaran</th>
            <th className="px-2 py-2 text-left font-semibold border-b bg-slate-100" style={{ width: '5%' }}>Tingkat</th>
            <th className="px-2 py-2 text-left font-semibold border-b bg-slate-100" style={{ width: '8%' }}>Kelas</th>
            <th className="px-2 py-2 text-left font-semibold border-b bg-slate-100" style={{ width: '50%' }}>Isi Pesan</th>
            <th className="px-2 py-2 text-center font-semibold border-b bg-slate-100" style={{ width: '8%' }}>Status</th>
            <th className="px-2 py-2 text-center font-semibold border-b bg-slate-100" style={{ width: '9%' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {data.map((r, idx) => (
            <tr key={idx} className="border-b hover:bg-slate-50">
              <td className="px-2 py-2 break-words">{r.nomor_whatsapp}</td>
              <td className="px-2 py-2 break-words">{r.tahun_ajaran}</td>
              <td className="px-2 py-2 break-words">{r.tingkat_kelas}</td>
              <td className="px-2 py-2 break-words">{r.kelas_spesifik}</td>
              <td className="px-2 py-2 text-xs break-words">
                {r.isi_pesan.split('\n').map((line, lineIdx) => {
                  if (line.startsWith('Nama: ')) {
                    const nama = line.substring(6)
                    return (
                      <span key={lineIdx}>
                        Nama: <span className="text-red-600 font-bold">{nama}</span>
                        {lineIdx < r.isi_pesan.split('\n').length - 1 && ' '}
                      </span>
                    )
                  }
                  if (line.startsWith('Kelas: ')) {
                    const kelas = line.substring(7)
                    return (
                      <span key={lineIdx}>
                        Kelas: <span className="text-red-600 font-bold">{kelas}</span>
                        {lineIdx < r.isi_pesan.split('\n').length - 1 && ' '}
                      </span>
                    )
                  }
                  return <span key={lineIdx}>{line}{lineIdx < r.isi_pesan.split('\n').length - 1 && ' '}</span>
                })}
              </td>
              <td className="px-2 py-2 text-center">
                {r.status === 'sent' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 border border-green-300" style={{ borderRadius: 0 }}>
                    <CheckCircle2 className="w-3 h-3" />
                    Terkirim
                  </span>
                ) : r.status === 'failed' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 border border-red-300" style={{ borderRadius: 0 }}>
                    <XCircle className="w-3 h-3" />
                    Gagal
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-300" style={{ borderRadius: 0 }}>
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                )}
              </td>
              <td className="px-2 py-2 text-center">
                <button
                  onClick={() => onDelete(idx)}
                  className="text-red-600 hover:text-red-800 p-1 transition-colors"
                  title="Hapus"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </td>
            </tr>
          ))}
          {data.length === 0 && (
            <tr>
              <td colSpan={7} className="px-2 py-8 text-center text-slate-600">
                {loading ? 'Memuat data...' : 'Belum ada data. Pilih filter lalu klik Generate.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
