import { useRef, useEffect, useState } from 'react'
import { Dialog, Button, Flex, Text } from '@radix-ui/themes'
import { X, Copy, Check, Send, StopCircle } from 'lucide-react'

// Function to determine log line color based on content
function getLogColor(line) {
  if (line.includes('❌') || line.includes('GAGAL') || line.includes('ERROR') || line.includes('Error:')) {
    return 'text-red-400'
  }
  if (line.includes('✅') || line.includes('BERHASIL') || line.includes('Berhasil') || line.includes('SUCCESS')) {
    return 'text-green-400'
  }
  if (line.includes('⏳') || line.includes('Menunggu') || line.includes('WARNING') || line.includes('⚠️')) {
    return 'text-yellow-400'
  }
  if (line.includes('📤') || line.includes('Mengirim') || line.match(/\[\d+\/\d+\]/)) {
    return 'text-cyan-400'
  }
  if (line.includes('🚀') || line.includes('MEMULAI') || line.includes('━━━')) {
    return 'text-white font-bold'
  }
  if (line.includes('📡') || line.includes('🔍') || line.includes('📊') || line.includes('🔄')) {
    return 'text-blue-400'
  }
  if (line.includes('📈') || line.includes('RINGKASAN')) {
    return 'text-cyan-300 font-bold'
  }
  if (line.includes('Status:') || line.includes('status') || line.includes('Process:')) {
    return 'text-red-400'
  }
  if (line.includes('└─') || line.includes('•')) {
    return 'text-gray-400'
  }
  if (line.includes('Function URL:') || line.includes('Project:') || line.includes('Network:')) {
    return 'text-teal-400'
  }
  if (line.includes('💡') || line.includes('Saran:')) {
    return 'text-orange-400'
  }
  return 'text-gray-300'
}

/**
 * Modal untuk menampilkan log pengiriman pesan WhatsApp
 */
export function SendMessageModal({ open, onOpenChange, logLines, sending, onSend, onCancel, messageData }) {
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
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content 
        style={{ 
          maxWidth: '450px',
          borderRadius: 0,
          padding: 0,
        }}
      >
        <div className="flex flex-col h-[600px] p-4">
          {/* Log Content */}
          <div ref={logRef} className="border p-2 overflow-auto bg-black text-xs font-mono flex-1 mb-4">
            {logLines.length === 0 ? (
              <div className="text-gray-300 whitespace-pre-wrap">
                {messageData?.isi_pesan ? (
                  <>
                    <div className="text-cyan-400 font-bold mb-2">Preview Pesan:</div>
                    <div className="text-green-400 mb-2">Nomor: {messageData.nomor_whatsapp}</div>
                    <div className="border-t border-gray-700 pt-2 mt-2">
                      {messageData.isi_pesan}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    Tekan tombol "Kirim" untuk memulai pengiriman pesan
                  </div>
                )}
              </div>
            ) : (
              logLines.map((l, i) => (
                <div key={i} className={getLogColor(l)}>
                  {l}
                </div>
              ))
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-shrink-0">
            {sending ? (
              <>
                <button
                  onClick={onCancel}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-red-300 bg-white hover:bg-red-50 text-red-700 transition-colors"
                  type="button"
                >
                  <StopCircle className="h-4 w-4" />
                  <span className="font-medium">Hentikan</span>
                </button>
                <div className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 border border-blue-300">
                  <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
                  <span className="text-sm font-medium text-blue-800">Mengirim pesan...</span>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={handleCopyLog}
                  disabled={logLines.length === 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  type="button"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      <span className="font-medium">Tersalin</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      <span className="font-medium">Copy</span>
                    </>
                  )}
                </button>
                <button
                  onClick={() => onOpenChange(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white transition-colors"
                  type="button"
                >
                  <X className="h-4 w-4" />
                  <span className="font-medium">Tutup</span>
                </button>
                {logLines.length === 0 && (
                  <button
                    onClick={onSend}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white transition-colors"
                    type="button"
                  >
                    <Send className="h-4 w-4" />
                    <span className="font-medium">Kirim</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
