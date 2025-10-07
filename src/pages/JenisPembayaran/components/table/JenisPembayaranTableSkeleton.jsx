export function JenisPembayaranTableSkeleton() {
  return (
    <>
      {Array.from({ length: 8 }).map((_, index) => (
        <tr key={`jenis-pembayaran-skeleton-${index}`} className="animate-pulse border-b border-slate-100">
          {/* Kode */}
          <td className="px-6 py-4 align-middle">
            <div className="h-6 w-20 bg-slate-200" />
          </td>
          
          {/* Nama */}
          <td className="px-6 py-4 align-middle">
            <div className="space-y-2">
              <div className="h-4 w-40 bg-slate-200" />
              <div className="h-3 w-32 bg-slate-200" />
            </div>
          </td>
          
          {/* Jumlah Default */}
          <td className="px-6 py-4 align-middle">
            <div className="h-4 w-28 bg-slate-200" />
          </td>
          
          {/* Tahun Ajaran */}
          <td className="px-6 py-4 align-middle">
            <div className="h-4 w-32 bg-slate-200" />
          </td>
          
          {/* Tingkat */}
          <td className="px-6 py-4 align-middle">
            <div className="h-4 w-16 bg-slate-200" />
          </td>
          
          {/* Wajib */}
          <td className="px-6 py-4 align-middle">
            <div className="h-6 w-14 bg-slate-200" />
          </td>
          
          {/* Status */}
          <td className="px-6 py-4 align-middle">
            <div className="h-6 w-16 bg-slate-200" />
          </td>
          
          {/* Aksi */}
          <td className="px-6 py-4 align-middle">
            <div className="ml-auto h-6 w-20 bg-slate-200" />
          </td>
        </tr>
      ))}
    </>
  )
}
