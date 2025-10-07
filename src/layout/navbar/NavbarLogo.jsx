import { Text } from '@radix-ui/themes'

export function NavbarLogo() {
  return (
    <div className="flex items-center space-x-3">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur p-1">
        <img 
          src="/icon.ico" 
          alt="ArtaPay Logo" 
          className="h-full w-full object-contain"
        />
      </div>
      <div className="hidden sm:block">
        <div className="flex flex-col -my-0.5">
          <Text size="4" weight="bold" className="text-white leading-none">
            ArtaPay
          </Text>
          <Text size="1" className="text-white/70 leading-none mt-0.5">
            Catat Bayar Cerdas
          </Text>
        </div>
      </div>
    </div>
  )
}
