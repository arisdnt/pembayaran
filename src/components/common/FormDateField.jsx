import { Text } from '@radix-ui/themes'

export function FormDateField({ label, value, onChange, required, helpText }) {
  return (
    <label>
      <Text as="div" size="2" mb="1" weight="medium">
        {label} {required && <span className="text-red-600">*</span>}
      </Text>
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
