import { Separator } from '@radix-ui/themes'
import { Globe, Cpu, MemoryStick, HardDrive } from 'lucide-react'
import { StatusBarItem } from './StatusBarItem'

export function SystemInfoSection({ systemInfo }) {
  return (
    <div className="flex items-center space-x-4">
      <StatusBarItem
        icon={Globe}
        label={systemInfo.network}
        iconColor="text-green-600"
      />
      <Separator orientation="vertical" size="1" className="h-3 bg-gray-500" />
      <StatusBarItem
        icon={Cpu}
        label={`CPU: ${systemInfo.cpu}`}
        iconColor="text-blue-600"
      />
      <Separator orientation="vertical" size="1" className="h-3 bg-gray-500" />
      <StatusBarItem
        icon={MemoryStick}
        label={`RAM: ${systemInfo.memory}`}
        iconColor="text-purple-600"
      />
      <Separator orientation="vertical" size="1" className="h-3 bg-gray-500" />
      <StatusBarItem
        icon={HardDrive}
        label={`Storage: ${systemInfo.storage}`}
        iconColor="text-orange-600"
      />
    </div>
  )
}
