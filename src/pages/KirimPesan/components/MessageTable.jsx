import { CheckCircle2, Clock, XCircle } from 'lucide-react'
import { IconButton } from '@radix-ui/themes'
import { TrashIcon } from '@radix-ui/react-icons'
import { TableToolbar } from './toolbar/TableToolbar'

export default function MessageTable({ 
  data, 
  loading, 
  onDelete,
  // Toolbar props
  tahunAjaranList,
  tingkatList,
  filteredKelas,
  selectedTA,
  selectedTingkat,
  selectedKelas,
  loadingGenerate,
  sending,
  messageCount,
  onTAChange,
  onTingkatChange,
  onKelasChange,
  onGenerate,
  onKirim,
  onCancel,
  onSettings,
}) {
  const sortedData = [...data].sort((a, b) => {
    const aDate = a.tanggal_dibuat ? new Date(a.tanggal_dibuat).getTime() : 0
    const bDate = b.tanggal_dibuat ? new Date(b.tanggal_dibuat).getTime() : 0
    if (aDate === bDate) {
      return (a.id || '').localeCompare(b.id || '')
    }
    return aDate - bDate
  })

  const nextPendingIndex = sortedData.findIndex((item) => (item.status || '').toLowerCase() === 'pending')

  return (
    <div className="h-full flex flex-col">
      <TableToolbar
        tahunAjaranList={tahunAjaranList}
        tingkatList={tingkatList}
        filteredKelas={filteredKelas}
        selectedTA={selectedTA}
        selectedTingkat={selectedTingkat}
        selectedKelas={selectedKelas}
        loading={loadingGenerate}
        sending={sending}
        messageCount={messageCount}
        onTAChange={onTAChange}
        onTingkatChange={onTingkatChange}
        onKelasChange={onKelasChange}
        onGenerate={onGenerate}
        onKirim={onKirim}
        onCancel={onCancel}
        onSettings={onSettings}
      />

      <div className="flex-1 overflow-auto border min-h-0">
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
          {sortedData.map((r, idx) => {
            const status = (r.status || '').toLowerCase()
            const isNextPending = idx === nextPendingIndex && status === 'pending'
            const rowHighlightClass =
              status === 'sent'
                ? 'bg-emerald-50'
                : status === 'failed'
                  ? 'bg-red-50'
                  : isNextPending
                    ? 'bg-amber-50'
                    : ''
            const originalIndex = data.indexOf(r)

            return (
              <tr
                key={r.id || idx}
                className={`border-b hover:bg-slate-100 transition-colors ${rowHighlightClass}`}
              >
                <td className="px-2 py-2 break-words">{r.nomor_whatsapp}</td>
                <td className="px-2 py-2 break-words">{r.tahun_ajaran}</td>
                <td className="px-2 py-2 break-words">{r.tingkat_kelas}</td>
                <td className="px-2 py-2 break-words">{r.kelas_spesifik}</td>
                <td className="px-2 py-2 text-xs break-words">
                {r.isi_pesan.split('\n').map((line, lineIdx, arr) => {
                  if (line.startsWith('Nama: ')) {
                    const nama = line.substring(6)
                    return (
                      <span key={lineIdx}>
                        Nama: <span className="text-red-600 font-bold">{nama}</span>
                        {lineIdx < arr.length - 1 && ' '}
                      </span>
                    )
                  }
                  if (line.startsWith('Kelas: ')) {
                    const kelas = line.substring(7)
                    return (
                      <span key={lineIdx}>
                        Kelas: <span className="text-red-600 font-bold">{kelas}</span>
                        {lineIdx < arr.length - 1 && ' '}
                      </span>
                    )
                  }
                  if (line.startsWith('Rincian lengkap: ')) {
                    const link = line.substring('Rincian lengkap: '.length).trim()
                    const hasLink = link && link !== '-'
                    return (
                      <span key={lineIdx}>
                        Rincian lengkap:{' '}
                        {hasLink ? (
                          <a
                            href={link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 underline break-words"
                          >
                            {link}
                          </a>
                        ) : (
                          '-'
                        )}
                        {lineIdx < arr.length - 1 && ' '}
                      </span>
                    )
                  }
                  return <span key={lineIdx}>{line}{lineIdx < arr.length - 1 && ' '}</span>
                })}
              </td>
              <td className="px-2 py-2 text-center">
                {status === 'sent' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 border border-green-300" style={{ borderRadius: 0 }}>
                    <CheckCircle2 className="w-3 h-3" />
                    Terkirim
                  </span>
                ) : status === 'failed' ? (
                  <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-red-100 text-red-700 border border-red-300" style={{ borderRadius: 0 }}>
                    <XCircle className="w-3 h-3" />
                    Gagal
                  </span>
                ) : (
                  <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-semibold border ${isNextPending ? 'bg-amber-200 text-amber-800 border-amber-400' : 'bg-amber-100 text-amber-700 border-amber-300'}`} style={{ borderRadius: 0 }}>
                    <Clock className="w-3 h-3" />
                    Pending
                  </span>
                )}
              </td>
              <td className="px-2 py-2 text-center">
                <div className="flex justify-center">
                  <IconButton
                    size="1"
                    variant="soft"
                    onClick={() => onDelete(originalIndex >= 0 ? originalIndex : idx)}
                    className="cursor-pointer hover:bg-red-100 text-red-700 border border-red-200"
                    style={{ borderRadius: 0 }}
                    aria-label="Hapus pesan"
                  >
                    <TrashIcon />
                  </IconButton>
                </div>
              </td>
              </tr>
            )
          })}
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
    </div>
  )
}
