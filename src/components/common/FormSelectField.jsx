import { Text, Select } from '@radix-ui/themes'

export function FormSelectField({ label, value, onChange, placeholder, options, required, renderOption }) {
  return (
    <label>
      <Text as="div" size="2" mb="1" weight="medium">
        {label} {required && <span className="text-red-600">*</span>}
      </Text>
      <Select.Root value={value} onValueChange={onChange} required={required}>
        <Select.Trigger 
          style={{ borderRadius: 0, width: '100%' }}
          placeholder={placeholder}
          className="cursor-pointer"
        />
        <Select.Content style={{ borderRadius: 0 }}>
          {options.map((option) => (
            <Select.Item key={option.id} value={option.id}>
              {renderOption ? renderOption(option) : option.nama}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </label>
  )
}
