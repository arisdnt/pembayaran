import { Select, Text } from '@radix-ui/themes'

export function FormSelectField({ 
  label, 
  icon: Icon, 
  value, 
  onChange, 
  placeholder,
  options,
  iconColor = 'text-blue-500'
}) {
  return (
    <label>
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && <Icon className={`h-3.5 w-3.5 ${iconColor}`} />}
        <Text as="div" size="2" weight="medium">
          {label}
        </Text>
      </div>
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger
          style={{ borderRadius: 0, width: '100%', height: '36px' }}
          placeholder={placeholder}
          className="cursor-pointer"
        />
        <Select.Content
          position="popper"
          side="bottom"
          align="start"
          sideOffset={4}
          style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)' }}
          className="border-2 border-slate-300 shadow-lg bg-white z-50"
        >
          {options.map((option) => (
            <Select.Item
              key={option.value}
              value={option.value}
              className="hover:bg-blue-50 cursor-pointer px-3 py-2 focus:bg-blue-100"
              style={{ borderRadius: 0 }}
            >
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </label>
  )
}
