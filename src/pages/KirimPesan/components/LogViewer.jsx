import { useRef, useEffect, useState } from 'react'
import { Button, Card, Flex, Text } from '@radix-ui/themes'
import { Copy, Check } from 'lucide-react'

export default function LogViewer({ logLines }) {
  const logRef = useRef(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logLines])

  const handleCopyLog = async () => {
    try {
      const logText = logLines.join('\n')
      await navigator.clipboard.writeText(logText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy log:', err)
      alert('Gagal menyalin log')
    }
  }

  return (
    <Card className="p-4 flex flex-col h-full overflow-hidden">
      <Flex justify="between" align="center" className="mb-2 flex-shrink-0">
        <Text weight="bold">Log</Text>
        <Button
          size="1"
          variant="soft"
          disabled={logLines.length === 0}
          onClick={handleCopyLog}
          className="cursor-pointer"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Tersalin
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </Flex>
      <div ref={logRef} className="border p-2 overflow-auto bg-black text-green-300 text-xs font-mono flex-1">
        {logLines.map((l, i) => <div key={i}>{l}</div>)}
      </div>
      <Text size="1" className="text-slate-600 mt-2 block flex-shrink-0">
        Pengiriman menggunakan Fonnte API. Pastikan device WhatsApp terhubung di dashboard Fonnte.
      </Text>
    </Card>
  )
}
