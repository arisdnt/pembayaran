import { useRef, useEffect, useState } from 'react'
import { Button, Card, Flex, Text } from '@radix-ui/themes'
import { Copy, Check } from 'lucide-react'

// Function to determine log line color based on content
function getLogColor(line) {
  // Error messages - Red
  if (line.includes('❌') || line.includes('GAGAL') || line.includes('ERROR') || line.includes('Error:')) {
    return 'text-red-400'
  }
  
  // Success messages - Green
  if (line.includes('✅') || line.includes('BERHASIL') || line.includes('Berhasil') || line.includes('SUCCESS')) {
    return 'text-green-400'
  }
  
  // Warning/Waiting messages - Yellow
  if (line.includes('⏳') || line.includes('Menunggu') || line.includes('WARNING') || line.includes('⚠️')) {
    return 'text-yellow-400'
  }
  
  // Progress messages - Cyan
  if (line.includes('📤') || line.includes('Mengirim') || line.match(/\[\d+\/\d+\]/)) {
    return 'text-cyan-400'
  }
  
  // Headers with emojis - White/Bold
  if (line.includes('🚀') || line.includes('MEMULAI') || line.includes('━━━')) {
    return 'text-white font-bold'
  }
  
  // Info messages - Blue
  if (line.includes('📡') || line.includes('🔍') || line.includes('📊') || line.includes('🔄')) {
    return 'text-blue-400'
  }
  
  // Summary/Stats - Cyan
  if (line.includes('📈') || line.includes('RINGKASAN')) {
    return 'text-cyan-300 font-bold'
  }
  
  // Status messages - Red
  if (line.includes('Status:') || line.includes('status') || line.includes('Process:')) {
    return 'text-red-400'
  }
  
  // Details/Sub-items - Gray
  if (line.includes('└─') || line.includes('•')) {
    return 'text-gray-400'
  }
  
  // Network/Config - Teal
  if (line.includes('Function URL:') || line.includes('Project:') || line.includes('Network:')) {
    return 'text-teal-400'
  }
  
  // Suggestions - Orange
  if (line.includes('💡') || line.includes('Saran:')) {
    return 'text-orange-400'
  }
  
  // Default - Light gray
  return 'text-gray-300'
}

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
    <Card className="p-4 flex flex-col h-full overflow-hidden" style={{ borderRadius: 0 }}>
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
      <div ref={logRef} className="border p-2 overflow-auto bg-black text-xs font-mono flex-1">
        {logLines.map((l, i) => (
          <div key={i} className={getLogColor(l)}>
            {l}
          </div>
        ))}
      </div>
    </Card>
  )
}
