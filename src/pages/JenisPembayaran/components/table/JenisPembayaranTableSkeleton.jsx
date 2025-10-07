export function JenisPembayaranTableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <tr key={`jenis-pembayaran-skeleton-${index}`} className="animate-pulse border-b border-slate-200 bg-white">
          {/* Kode */}
          <td className="px-4 py-3 border-r border-slate-200">
            <div className="h-4 w-20 bg-slate-200" />
          </td>
          
          {/* Nama */}
          <td className="px-4 py-3 border-r border-slate-200">
            <div className="space-y-2">
              <div className="h-4 w-40 bg-slate-200" />
              <div className="h-3 w-32 bg-slate-200" />
            </div>
          </td>
          
          {/* Jumlah Default */}
          <td className="px-4 py-3 border-r border-slate-200">
            <div className="h-4 w-28 bg-slate-200" />
          </td>
          
          {/* Tahun Ajaran */}
          <td className="px-4 py-3 border-r border-slate-200">
            <div className="h-4 w-32 bg-slate-200" />
          </td>
          
          {/* Tingkat */}
          <td className="px-4 py-3 border-r border-slate-200">
            <div className="h-4 w-24 bg-slate-200" />
          </td>
          
          {/* Kelas Spesifik */}
          <td className="px-4 py-3 border-r border-slate-200">
            <div className="h-4 w-28 bg-slate-200" />
          </td>
          
          {/* Peminatan */}
          <td className="px-4 py-3 border-r border-slate-200">
            <div className="h-4 w-32 bg-slate-200" />
          </td>
          
          {/* Wajib */}
          <td className="px-4 py-3 border-r border-slate-200">
            <div className="h-6 w-16 bg-slate-200" style={{ borderRadius: 0 }} />
          </td>
          
          {/* Status */}
          <td className="px-4 py-3 border-r border-slate-200">
            <div className="flex items-center gap-2.5">
              <div className="h-6 w-11 bg-slate-200 rounded-full" />
              <div className="h-6 w-16 bg-slate-200" style={{ borderRadius: 0 }} />
            </div>
          </td>
          
          {/* Aksi */}
          <td className="px-4 py-3">
            <div className="flex justify-center gap-1">
              <div className="h-7 w-7 bg-slate-200" />
              <div className="h-7 w-7 bg-slate-200" />
              <div className="h-7 w-7 bg-slate-200" />
            </div>
          </td>
        </tr>
      ))}
    </>
  )
}
