import { Text, TextField, Flex } from '@radix-ui/themes'
import { EnvelopeClosedIcon, LockClosedIcon } from '@radix-ui/react-icons'

export function LoginFormFields({ email, setEmail, password, setPassword }) {
  return (
    <Flex direction="column" gap="4">
      <label>
        <Text as="div" size="2" mb="1" weight="medium" className="text-slate-700">
          Email
        </Text>
        <TextField.Root
          className="w-full"
          required
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          style={{ borderRadius: 0, border: '1px solid #cbd5e1' }}
        >
          <TextField.Slot>
            <EnvelopeClosedIcon />
          </TextField.Slot>
        </TextField.Root>
      </label>

      <label>
        <Text as="div" size="2" mb="1" weight="medium" className="text-slate-700">
          Password
        </Text>
        <TextField.Root
          className="w-full"
          required
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          style={{ borderRadius: 0, border: '1px solid #cbd5e1' }}
        >
          <TextField.Slot>
            <LockClosedIcon />
          </TextField.Slot>
        </TextField.Root>
      </label>
    </Flex>
  )
}
