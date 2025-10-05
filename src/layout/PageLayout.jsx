import { Heading, Text } from '@radix-ui/themes'

export function PageLayout({ title, description, children, naturalHeight = false }) {
  return (
    <div className={`px-3 py-3 ${naturalHeight ? 'min-h-full' : 'h-full'} flex flex-col`}>
      {(title || description) && (
        <div className="mb-3 shrink-0">
          {title ? (
            <Heading size="8" className="text-gray-900 mb-2">
              {title}
            </Heading>
          ) : null}
          {description ? (
            <Text size="4" className="text-gray-600">
              {description}
            </Text>
          ) : null}
        </div>
      )}
      <div className={naturalHeight ? '' : 'flex-1 min-h-0'}>
        {children}
      </div>
    </div>
  )
}
