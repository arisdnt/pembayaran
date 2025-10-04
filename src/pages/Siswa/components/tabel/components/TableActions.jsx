import { IconButton } from '@radix-ui/themes'
import { Pencil1Icon, TrashIcon } from '@radix-ui/react-icons'
import { Eye } from 'lucide-react'

export function TableActions({ item, onViewDetail, onEdit, onDelete }) {
  return (
    <div className="flex justify-center gap-1">
      <IconButton
        size="1"
        variant="soft"
        onClick={(e) => {
          e.stopPropagation()
          onViewDetail && onViewDetail(item)
        }}
        className="cursor-pointer hover:bg-slate-100 text-slate-700 border border-slate-200"
        style={{ borderRadius: 0 }}
        aria-label={`Detail ${item.nama_lengkap}`}
      >
        <Eye className="h-3.5 w-3.5" />
      </IconButton>
      <IconButton
        size="1"
        variant="soft"
        onClick={(e) => {
          e.stopPropagation()
          onEdit(item)
        }}
        className="cursor-pointer hover:bg-blue-100 text-blue-700 border border-blue-200"
        style={{ borderRadius: 0 }}
        aria-label={`Edit ${item.nama_lengkap}`}
      >
        <Pencil1Icon />
      </IconButton>
      <IconButton
        size="1"
        variant="soft"
        onClick={(e) => {
          e.stopPropagation()
          onDelete(item)
        }}
        className="cursor-pointer hover:bg-red-100 text-red-700 border border-red-200"
        style={{ borderRadius: 0 }}
        aria-label={`Hapus ${item.nama_lengkap}`}
      >
        <TrashIcon />
      </IconButton>
    </div>
  )
}
