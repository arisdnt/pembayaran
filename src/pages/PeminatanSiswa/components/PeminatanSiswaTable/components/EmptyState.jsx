import { BookOpen } from 'lucide-react'

export function EmptyState({ hasActiveFilters, onClearFilters }) {
  return (
    <tr>
      <td colSpan="8" className="px-4 py-12 text-center">
        <div className="flex flex-col items-center gap-3">
          <BookOpen className="h-12 w-12 text-slate-300" />
          <div>
            <p className="text-slate-600 font-medium">
              {hasActiveFilters ? 'Tidak ada data yang cocok' : 'Belum ada data peminatan siswa'}
            </p>
            {hasActiveFilters && (
              <button
                onClick={onClearFilters}
                className="mt-2 text-blue-600 hover:text-blue-700 text-sm underline"
                type="button"
              >
                Reset filter
              </button>
            )}
          </div>
        </div>
      </td>
    </tr>
  )
}
