import { TextField, Text } from '@radix-ui/themes'

export function FormTextField({ 
  label, 
  icon: Icon, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  helpText,
  iconColor = 'text-blue-500'
}) {
  return (
    <label>
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && <Icon className={`h-3.5 w-3.5 ${iconColor}`} />}
        <Text as="div" size="2" weight="medium">
          {label} {required && <span className="text-red-600">*</span>}
        </Text>
      </div>
      <TextField.Root
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ borderRadius: 0 }}
        required={required}
      />
      {helpText && (
        <Text size="1" className="text-slate-500 mt-1">
          {helpText}
        </Text>
      )}
    </label>
  )
}
