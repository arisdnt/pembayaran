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
        <Flex direction="column" gap="4">
          <div className="text-center pb-3 border-b border-slate-200">
            <Heading size="6" className="text-slate-900">
              Masuk ke Sistem
            </Heading>
          </div>

          <form onSubmit={onSubmit}>
            <Flex direction="column" gap="4">
              <LoginFormFields
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
              />

              <LoginFormActions loading={loading} />
            </Flex>
          </form>
        </Flex>
      </div>
    </div>
  )
}
