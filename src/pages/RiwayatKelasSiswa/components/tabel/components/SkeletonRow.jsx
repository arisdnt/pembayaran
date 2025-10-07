export function SkeletonRow({ index }) {
  return (
    <tr key={`riwayat-skeleton-${index}`} className="border-b border-slate-200 bg-white">
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="space-y-2">
          <div className="h-4 w-48 bg-slate-200" />
          <div className="h-3 w-24 bg-slate-200" />
        </div>
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="h-4 w-32 bg-slate-200" />
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="h-4 w-28 bg-slate-200" />
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="h-4 w-32 bg-slate-200" />
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="h-4 w-24 bg-slate-200" />
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="h-4 w-24 bg-slate-200" />
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="h-6 w-24 bg-slate-200" />
      </td>
      <td className="px-4 py-3 border-r border-slate-200">
        <div className="h-3 w-28 bg-slate-200" />
      </td>
      <td className="px-4 py-3 text-center">
        <div className="h-6 w-20 bg-slate-200 mx-auto" />
      </td>
    </tr>
  )
}
