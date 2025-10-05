import { Flex, Spinner, Text } from '@radix-ui/themes'

export function Loader({ message = 'Loading...' }) {
  return (
    <Flex direction="column" align="center" justify="center" gap="2" style={{ height: '100vh' }}>
      <Spinner size="3" />
      <Text size="3" color="gray">{message}</Text>
    </Flex>
  )
}
