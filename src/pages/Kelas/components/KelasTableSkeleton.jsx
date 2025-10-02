export function KelasTableSkeleton() {
  return (
    <>
      {Array.from({ length: 6 }).map((_, index) => (
        <tr key={`kelas-skeleton-${index}`} className="animate-pulse">
          <td className="px-6 py-4 align-middle">
            <div className="h-6 w-24 bg-slate-200" />
          </td>
          <td className="px-6 py-4 align-middle">
            <div className="h-4 w-40 bg-slate-200" />
          </td>
          <td className="px-6 py-4 align-middle">
            <div className="h-4 w-20 bg-slate-200" />
          </td>
          <td className="px-6 py-4 align-middle">
            <div className="h-3 w-32 bg-slate-200" />
          </td>
          <td className="px-6 py-4 align-middle">
            <div className="h-3 w-36 bg-slate-200" />
          </td>
          <td className="px-6 py-4 align-middle">
            <div className="ml-auto h-6 w-20 bg-slate-200" />
          </td>
        </tr>
      ))}
    </>
  )
}
