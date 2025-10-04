import { Switch, Flex, Text } from '@radix-ui/themes'

export function FormStatusSwitch({ 
  label, 
  icon: Icon, 
  checked, 
  onChange,
  iconColor = 'text-teal-500'
}) {
  return (
    <div className="mb-4">
      <div className="flex items-center gap-1.5 mb-1">
        {Icon && <Icon className={`h-3.5 w-3.5 ${iconColor}`} />}
        <Text as="div" size="2" weight="medium">
          {label}
        </Text>
      </div>
      <div className="border-2 border-slate-300 bg-slate-50 p-4">
        <label className="cursor-pointer">
          <Flex align="center" gap="3">
            <Switch
              checked={checked}
              onCheckedChange={onChange}
              size="3"
              className="cursor-pointer focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              style={{ outline: 'none', boxShadow: 'none' }}
            />
            <div>
              <Text size="2" weight="bold" className={checked ? 'text-green-600' : 'text-slate-500'}>
                {checked ? 'Status Aktif' : 'Status Nonaktif'}
              </Text>
              <Text size="1" className="text-slate-500 mt-0.5 block">
                {checked 
                  ? 'Siswa dapat menerima tagihan dan mengakses sistem' 
                  : 'Siswa tidak dapat menerima tagihan'}
              </Text>
            </div>
          </Flex>
        </label>
      </div>
    </div>
  )
}
