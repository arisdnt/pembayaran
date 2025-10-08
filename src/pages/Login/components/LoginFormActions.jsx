import { Button } from '@radix-ui/themes'

export function LoginFormActions({ loading }) {
  return (
    <Button
      type="submit"
      size="3"
      className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
      disabled={loading}
      style={{ borderRadius: 0 }}
    >
      {loading ? 'Memproses…' : 'Masuk'}
    </Button>
  )
}
