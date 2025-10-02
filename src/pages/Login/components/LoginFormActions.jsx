import { Button, Text, Separator, Flex } from '@radix-ui/themes'
import { AlertCircle } from 'lucide-react'

export function LoginFormActions({ loading, email, error, onMagicLink }) {
  return (
    <>
      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 px-4 py-3">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <Text size="2" weight="medium" className="text-red-700">
              Terjadi kesalahan
            </Text>
            <Text size="2" className="text-red-600">
              {error}
            </Text>
          </div>
        </div>
      )}

      <Button
        type="submit"
        size="3"
        className="w-full bg-blue-600 hover:bg-blue-700 cursor-pointer"
        disabled={loading}
        style={{ borderRadius: 0 }}
      >
        {loading ? 'Memproses…' : 'Masuk'}
      </Button>

      <Separator size="2" />

      <Flex direction="column" gap="3">
        <Text size="2" className="text-center text-slate-600">
          Atau kirim tautan login ke email Anda
        </Text>
        <Button
          variant="soft"
          color="gray"
          className="w-full cursor-pointer"
          onClick={onMagicLink}
          disabled={loading || !email}
          style={{ borderRadius: 0 }}
        >
          Kirim Magic Link
        </Button>
      </Flex>
    </>
  )
}
