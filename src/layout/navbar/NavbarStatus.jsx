import { Badge } from '@radix-ui/themes'

export function NavbarStatus({ realtimeStatus = 'disconnected' }) {
  return (
    <div className="hidden sm:block">
      <Badge
        color={realtimeStatus === 'connected' ? 'green' : 'amber'}
        variant="soft"
        className="text-xs bg-white/10 text-white border-white/20"
      >
        <div className={`mr-1 h-2 w-2 rounded-full ${
          realtimeStatus === 'connected' ? 'bg-green-400' : 'bg-amber-400'
        } animate-pulse`} />
        {realtimeStatus === 'connected' ? 'Online' : 'Offline'}
      </Badge>
    </div>
  )
}
