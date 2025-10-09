import { Dialog, Button, Text } from '@radix-ui/themes'
import { AlertCircle, CheckCircle, X } from 'lucide-react'

export function ErrorModal({ 
  open, 
  onOpenChange, 
  title = 'Terjadi Kesalahan', 
  message, 
  details,
  variant = 'error'
}) {
  const isSuccess = variant === 'success'
  
  const headerBgClass = isSuccess ? 'from-green-50 to-green-100' : 'from-red-50 to-red-100'
  const iconBorderClass = isSuccess ? 'border-green-700' : 'border-red-700'
  const iconBgClass = isSuccess ? 'bg-green-600' : 'bg-red-600'
  const contentBgClass = isSuccess ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
  const iconColorClass = isSuccess ? 'text-green-600' : 'text-red-600'
  const titleColorClass = isSuccess ? 'text-green-900' : 'text-red-900'
  const detailsColorClass = isSuccess ? 'text-green-700' : 'text-red-700'
  
  // Button "Tutup" always gray (neutral action)
  const buttonBg = '#64748b'
  const buttonBorder = '#475569'
  
  const Icon = isSuccess ? CheckCircle : AlertCircle

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{
          maxWidth: '500px',
          width: '95vw',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
        onPointerDownOutside={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        {/* Header */}
        <div className={`flex items-center border-b-2 border-slate-300 bg-gradient-to-b ${headerBgClass} px-4 py-2`}>
          <div className="flex items-center gap-2">
            <div className={`flex h-7 w-7 items-center justify-center border ${iconBorderClass} ${iconBgClass} shadow-sm`}>
              <Icon className="h-4 w-4 text-white" />
            </div>
            <div>
              <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
                {title}
              </Text>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-3">
          <div className={`flex items-start gap-3 p-2 ${contentBgClass} border-2`}>
            <Icon className={`h-5 w-5 ${iconColorClass} mt-0.5 shrink-0`} />
            <div className="flex-1">
              <Text size="2" weight="medium" className={`${titleColorClass} mb-1 block`}>
                {message}
              </Text>
              {details && (
                <Text size="2" className={detailsColorClass}>
                  {details}
                </Text>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2">
          <Button
            size="2"
            onClick={() => onOpenChange(false)}
            style={{
              borderRadius: 0,
              backgroundColor: buttonBg,
              border: `1px solid ${buttonBorder}`
            }}
            className="cursor-pointer text-white shadow-sm hover:shadow flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Tutup
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
