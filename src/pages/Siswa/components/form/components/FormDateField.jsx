import { Text } from '@radix-ui/themes'

export function FormDateField({ 
  label, 
  icon: Icon, 
  value, 
  onChange,
  iconColor = 'text-purple-500' 
}) {
  return (
    <label>
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && <Icon className={`h-3.5 w-3.5 ${iconColor}`} />}
        <Text as="div" size="2" weight="medium">
          {label}
        </Text>
      </div>
      <input
        type="date"
        value={value}
        onChange={onChange}
        className="w-full px-3 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-slate-900"
        style={{
          borderRadius: 0,
          height: '36px',
          fontSize: '14px',
          lineHeight: '20px'
        }}
      />
    </label>
  )
}
