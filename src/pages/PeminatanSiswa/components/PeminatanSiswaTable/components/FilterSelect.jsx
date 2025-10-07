import { Select } from '@radix-ui/themes'

export function FilterSelect({ 
  value, 
  onChange, 
  options, 
  allLabel, 
  minWidth = '140px',
  renderOption 
}) {
  return (
    <div className="flex items-center gap-2">
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger 
          style={{ 
            borderRadius: 0, 
            minWidth,
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff'
          }}
          className="cursor-pointer font-sans"
        />
        <Select.Content 
          position="popper"
          side="bottom"
          align="start"
          sideOffset={4}
          style={{ borderRadius: 0 }}
          className="border-2 border-slate-300 shadow-lg bg-white z-50"
        >
          <Select.Item value="all" style={{ borderRadius: 0 }} className="hover:bg-blue-50 cursor-pointer px-3 py-2">
            {allLabel}
          </Select.Item>
          {options.map((option, index) => (
            <Select.Item 
              key={option.id || option || index} 
              value={option.id || option} 
              style={{ borderRadius: 0 }} 
              className="hover:bg-blue-50 cursor-pointer px-3 py-2"
            >
              {renderOption ? renderOption(option) : option}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </div>
  )
}
