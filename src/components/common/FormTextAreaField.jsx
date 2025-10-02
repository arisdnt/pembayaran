import { Text, TextArea } from '@radix-ui/themes'

export function FormTextAreaField({ label, value, onChange, placeholder, rows = 3 }) {
  return (
    <label>
      <Text as="div" size="2" mb="1" weight="medium">
        {label}
      </Text>
      <TextArea
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ borderRadius: 0 }}
        rows={rows}
      />
    </label>
  )
}
