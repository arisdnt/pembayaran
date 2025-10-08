import { Text, Select } from '@radix-ui/themes'

export function SelectField({
  icon: Icon,
  label,
  required = false,
  value,
  onChange,
  disabled = false,
  placeholder,
  options,
  helpText,
  renderOption,
  emptyText,
}) {
  return (
    <label>
      <div className="flex items-center gap-2 mb-3">
        {Icon && <Icon className="h-3.5 w-3.5 text-purple-500" />}
        <Text as="div" size="2" weight="medium">
          {label} {required && <span className="text-red-600">*</span>}
        </Text>
      </div>
      <Select.Root
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        required={required}
      >
        <Select.Trigger style={{ borderRadius: 0, width: '100%' }} placeholder={placeholder} />
        <Select.Content position="popper" style={{ borderRadius: 0, maxHeight: '300px' }} className="border-2 border-slate-300 shadow-lg bg-white z-50">
          {options.length === 0 && emptyText && (
            <div className="px-3 py-4 text-center text-slate-500 text-sm">
              {emptyText}
            </div>
          )}
          {options.map((option, index) => {
            const key = option.id || option
            const uniqueKey = typeof key === 'object' ? `${key}-${index}` : String(key)
            return (
              <Select.Item key={uniqueKey} value={option.id || String(option)} style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
                {renderOption ? renderOption(option) : option}
              </Select.Item>
            )
          })}
        </Select.Content>
      </Select.Root>
      {helpText && (
        <Text size="1" className="text-slate-500 mt-2.5 block">
          {helpText}
        </Text>
      )}
    </label>
  )
}
