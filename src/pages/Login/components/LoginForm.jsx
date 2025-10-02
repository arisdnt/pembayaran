import { Flex, Heading, Text } from '@radix-ui/themes'
import { LoginFormFields } from './LoginFormFields'
import { LoginFormActions } from './LoginFormActions'

export function LoginForm({
  email,
  setEmail,
  password,
  setPassword,
  error,
  loading,
  onSubmit,
  onMagicLink,
}) {
  return (
    <div className="w-1/4 bg-white flex items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <Flex direction="column" gap="6">
          <div className="text-center mb-2">
            <Heading size="6" className="text-slate-900 mb-2">
              Masuk ke Sistem
            </Heading>
            <Text size="3" className="text-slate-600">
              Gunakan kredensial Anda untuk mengakses dashboard
            </Text>
          </div>

          <form onSubmit={onSubmit}>
            <Flex direction="column" gap="4">
              <LoginFormFields
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />

              <LoginFormActions
                loading={loading}
                email={email}
                error={error}
                onMagicLink={onMagicLink}
              />
            </Flex>
          </form>
        </Flex>
      </div>
    </div>
  )
}
