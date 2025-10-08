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
    <div className="min-w-0 w-full">
      <Select.Root value={value} onValueChange={onChange}>
        <Select.Trigger 
          style={{ 
            borderRadius: 0, 
            minWidth,
            border: '1px solid #cbd5e1',
            backgroundColor: '#ffffff',
            width: '100%',
            height: '36px'
          }}
          className="cursor-pointer font-sans truncate text-sm px-2"
        />
        <Select.Content 
          position="popper"
          side="bottom"
          align="start"
          sideOffset={4}
          style={{ borderRadius: 0, minWidth: 'var(--radix-select-trigger-width)', width: 'max-content', maxHeight: '300px' }}
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
