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
    <div className="h-full flex flex-col border border-slate-300 bg-white shadow-lg">
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

      <div className="relative flex-1 min-h-0">
        <div className="h-full overflow-auto excel-scrollbar">
          <table className="min-w-full table-fixed text-sm border-collapse">
            <colgroup>
              <col style={{ width: '10%' }} />
              <col style={{ width: '12%' }} />
              <col style={{ width: '6%' }} />
              <col style={{ width: '8%' }} />
              <col style={{ width: '48%' }} />
              <col style={{ width: '9%' }} />
              <col style={{ width: '7%' }} />
            </colgroup>
            
            <thead>
              <tr className="bg-gradient-to-b from-slate-100 to-slate-50 sticky top-0 z-10 border-b border-slate-300 shadow-sm">
                <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">Nomor WA</th>
                <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">Tahun Ajaran</th>
                <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">Tingkat</th>
                <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">Kelas</th>
                <th className="px-4 py-3 text-left text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">Isi Pesan</th>
                <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700 border-r border-slate-300">Status</th>
                <th className="px-4 py-3 text-center text-[0.7rem] font-bold uppercase tracking-wider text-slate-700">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((r, idx) => {
                const status = (r.status || '').toLowerCase()
                const isNextPending = idx === nextPendingIndex && status === 'pending'
                const originalIndex = data.indexOf(r)
                
                // Status-based row styling
                let rowBgClass = ''
                if (status === 'sent') {
                  rowBgClass = 'bg-emerald-50'
                } else if (status === 'failed') {
                  rowBgClass = 'bg-red-50'
                } else if (isNextPending) {
                  rowBgClass = 'bg-amber-50'
                } else {
                  rowBgClass = idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                }

                return (
                  <tr
                    key={r.id || idx}
                    className={`border-b border-slate-200 hover:bg-blue-50 transition-colors ${rowBgClass}`}
                  >
                    <td className="px-4 py-3 border-r border-slate-200 font-mono font-medium text-slate-700">{r.nomor_whatsapp}</td>
                    <td className="px-4 py-3 border-r border-slate-200 text-slate-700">{r.tahun_ajaran}</td>
                    <td className="px-4 py-3 border-r border-slate-200 text-slate-700">{r.tingkat_kelas}</td>
                    <td className="px-4 py-3 border-r border-slate-200 text-slate-700">{r.kelas_spesifik}</td>
                    <td className="px-4 py-3 border-r border-slate-200 text-xs text-slate-700">
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
                    <td className="px-4 py-3 border-r border-slate-200 text-center">
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
                    <td className="px-4 py-3 text-center">
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
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-600">
                    {loading ? 'Memuat data...' : 'Belum ada data. Pilih filter lalu klik Generate.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .excel-scrollbar::-webkit-scrollbar {
          width: 16px;
          height: 16px;
        }
        .excel-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-left: 1px solid #cbd5e1;
          border-top: 1px solid #cbd5e1;
        }
        .excel-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border: 3px solid #f1f5f9;
        }
        .excel-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
        .excel-scrollbar::-webkit-scrollbar-corner {
          background: #f1f5f9;
        }
      `}</style>
    </div>
  )
}
