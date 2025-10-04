import { Text } from '@radix-ui/themes'

export function StatSection({ title, icon: Icon, children, className = '' }) {
  return (
    <div className={`border-b border-slate-200 pb-4 mb-4 ${className}`}>
      <div className="flex items-center gap-1.5 mb-3">
        {Icon && <Icon className="h-3.5 w-3.5 text-slate-500" />}
        <Text size="1" weight="bold" className="text-slate-700 uppercase tracking-wider text-[0.65rem]">
          {title}
        </Text>
      </div>
      <div className="ml-5 space-y-2">
        {children}
      </div>
    </div>
  )
}
