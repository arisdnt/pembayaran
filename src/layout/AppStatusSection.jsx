import { Badge } from '@radix-ui/themes'

export function AppStatusSection() {
  return (
    <div className="flex items-center space-x-3">
      <Badge variant="soft" className="bg-green-100 text-green-700 text-xs px-2 py-0.5">
        Sekolah Digital - Running
      </Badge>
      <Badge variant="soft" className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5">
        Dashboard Active
      </Badge>
    </div>
  )
}
