import { Text } from '@radix-ui/themes'
import { Users, Trash2 } from 'lucide-react'

export function SelectedSiswaTable({ selectedSiswaList, onRemoveSiswa }) {
  if (selectedSiswaList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-6 text-center">
        <Users className="h-12 w-12 text-slate-300 mb-2" />
        <Text size="2" className="text-slate-500">
          Belum ada siswa dipilih
        </Text>
        <Text size="1" className="text-slate-400 mt-1">
          Gunakan form pencarian untuk menambah siswa
        </Text>
      </div>
    )
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse" style={{ minWidth: '700px' }}>
        <thead className="sticky top-0 bg-slate-100 border-b-2 border-slate-300">
          <tr>
            <th className="px-3 py-2 text-left border-b border-slate-300" style={{ width: '50px' }}>
              <Text size="1" weight="bold" className="text-slate-700">#</Text>
            </th>
            <th className="px-3 py-2 border-b border-slate-300" style={{ width: '200px' }}>
              <div className="flex items-center justify-between">
                <Text size="1" weight="bold" className="text-slate-700">Nama</Text>
                <div className="flex items-center gap-2">
                  <Text size="2" weight="bold" className="text-slate-700">Siswa Terpilih</Text>
                  <div className="bg-blue-600 text-white px-2 py-0.5 text-xs font-bold">
                    {selectedSiswaList.length}
                  </div>
                </div>
              </div>
            </th>
            <th className="px-3 py-2 text-left border-b border-slate-300" style={{ width: '120px' }}>
              <Text size="1" weight="bold" className="text-slate-700">NISN</Text>
            </th>
            <th className="px-3 py-2 text-left border-b border-slate-300" style={{ width: '150px' }}>
              <Text size="1" weight="bold" className="text-slate-700">Tahun Ajaran Terakhir</Text>
            </th>
            <th className="px-3 py-2 text-left border-b border-slate-300" style={{ width: '130px' }}>
              <Text size="1" weight="bold" className="text-slate-700">Kelas Terakhir</Text>
            </th>
            <th className="px-3 py-2 text-center border-b border-slate-300" style={{ width: '70px' }}>
              <Text size="1" weight="bold" className="text-slate-700">Aksi</Text>
            </th>
          </tr>
        </thead>
        <tbody>
          {selectedSiswaList.map((siswa, index) => (
            <tr key={siswa.id} className="border-b border-slate-200 hover:bg-slate-50 transition-colors">
              <td className="px-3 py-2 text-center">
                <div className="w-6 h-6 flex items-center justify-center bg-blue-600 text-white text-xs font-semibold mx-auto">
                  {index + 1}
                </div>
              </td>
              <td className="px-3 py-2">
                <Text size="2" weight="medium" className="text-slate-900 block truncate" title={siswa.nama_lengkap}>
                  {siswa.nama_lengkap}
                </Text>
              </td>
              <td className="px-3 py-2">
                <Text size="1" className="text-slate-600 font-mono block truncate">
                  {siswa.nisn || '-'}
                </Text>
              </td>
              <td className="px-3 py-2">
                <Text size="1" className="text-slate-600 block truncate" title={siswa.lastTahunAjaran?.nama}>
                  {siswa.lastTahunAjaran?.nama || '-'}
                </Text>
              </td>
              <td className="px-3 py-2">
                <Text size="1" className="text-slate-600 block truncate" title={siswa.lastKelas ? `${siswa.lastKelas.tingkat} ${siswa.lastKelas.nama_sub_kelas}` : '-'}>
                  {siswa.lastKelas ? `${siswa.lastKelas.tingkat} ${siswa.lastKelas.nama_sub_kelas}` : '-'}
                </Text>
              </td>
              <td className="px-3 py-2 text-center">
                <button
                  type="button"
                  onClick={() => onRemoveSiswa(siswa.id)}
                  className="p-1.5 hover:bg-red-50 border border-slate-300 hover:border-red-300 transition-colors group inline-flex items-center justify-center"
                  title="Hapus"
                >
                  <Trash2 className="h-4 w-4 text-slate-600 group-hover:text-red-600" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
