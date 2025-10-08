import { Dialog, Text, Button, IconButton } from '@radix-ui/themes'
import { X, FileText, Download } from 'lucide-react'
import { useState, useEffect } from 'react'

export function BuktiPembayaranModal({ open, onOpenChange, buktiUrl, nomorTransaksi }) {
  const [fileType, setFileType] = useState(null)
  const [fileName, setFileName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (open && buktiUrl) {
      setLoading(true)
      setError(null)
      
      // Extract filename from URL
      try {
        const url = new URL(buktiUrl)
        const pathParts = url.pathname.split('/')
        const fileNameWithExt = pathParts[pathParts.length - 1]
        setFileName(decodeURIComponent(fileNameWithExt))
        
        // Detect file type from URL
        const extension = fileNameWithExt.split('.').pop()?.toLowerCase()
        if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension)) {
          setFileType('image')
        } else if (extension === 'pdf') {
          setFileType('pdf')
        } else {
          setFileType('unknown')
        }
        
        setLoading(false)
      } catch (err) {
        console.error('Error parsing bukti URL:', err)
        setFileName('bukti_pembayaran')
        setFileType('unknown')
        setLoading(false)
      }
    }
  }, [open, buktiUrl])

  const handleDownload = async () => {
    try {
      // Fetch file sebagai blob
      const response = await fetch(buktiUrl)
      const blob = await response.blob()
      
      // Buat URL object dari blob
      const blobUrl = window.URL.createObjectURL(blob)
      
      // Buat anchor element untuk trigger download
      const link = document.createElement('a')
      link.href = blobUrl
      link.download = fileName || 'bukti_pembayaran'
      
      // Trigger download
      document.body.appendChild(link)
      link.click()
      
      // Cleanup
      document.body.removeChild(link)
      window.URL.revokeObjectURL(blobUrl)
    } catch (error) {
      console.error('Error downloading file:', error)
      // Fallback ke window.open jika fetch gagal
      window.open(buktiUrl, '_blank')
    }
  }

  const handleImageError = () => {
    setError('Gagal memuat gambar')
    setLoading(false)
  }

  const handleImageLoad = () => {
    setLoading(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{ maxWidth: '900px', width: '90vw', padding: 0, borderRadius: 0, maxHeight: '90vh' }}
        className="border-2 border-slate-300 shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-blue-600 to-blue-700 px-5 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center bg-white border border-blue-800 shadow">
              <FileText className="h-5 w-5 text-blue-700" />
            </div>
            <div className="leading-none">
              <Dialog.Title asChild>
                <Text size="3" weight="bold" className="text-white uppercase tracking-wider block leading-none mb-0">
                  Bukti Pembayaran
                </Text>
              </Dialog.Title>
              {nomorTransaksi && (
                <Text size="1" className="text-blue-100 block leading-none mt-1 font-mono">
                  {nomorTransaksi}
                </Text>
              )}
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-red-600 transition-colors border border-white"
            type="button"
          >
            <X className="h-4 w-4 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-white p-5 flex-1 overflow-auto min-h-0">
          {/* Preview Area */}
          <div className="bg-slate-50 border-2 border-slate-300 p-4 flex items-center justify-center h-full">
            {loading && (
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-3"></div>
                <Text size="2" className="text-slate-600">
                  Memuat bukti pembayaran...
                </Text>
              </div>
            )}

            {!loading && error && (
              <div className="text-center">
                <FileText className="h-16 w-16 text-slate-400 mx-auto mb-3" />
                <Text size="2" className="text-red-600 block mb-2">
                  {error}
                </Text>
                <Button
                  size="2"
                  variant="soft"
                  onClick={handleDownload}
                  style={{ borderRadius: 0 }}
                  className="cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download File
                </Button>
              </div>
            )}

            {!loading && !error && fileType === 'image' && (
              <div className="w-full select-none">
                <img
                  src={buktiUrl}
                  alt="Bukti Pembayaran"
                  className="max-w-full h-auto mx-auto border border-slate-300 shadow-lg select-none pointer-events-none"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  onContextMenu={(e) => e.preventDefault()}
                  onDragStart={(e) => e.preventDefault()}
                  style={{ maxHeight: '60vh', userSelect: 'none' }}
                />
              </div>
            )}

            {!loading && !error && fileType === 'pdf' && (
              <div className="w-full h-full select-none">
                <iframe
                  src={buktiUrl}
                  title="Bukti Pembayaran PDF"
                  className="w-full border border-slate-300"
                  style={{ minHeight: '500px' }}
                  onError={handleImageError}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            )}

            {!loading && !error && fileType === 'unknown' && (
              <div className="text-center">
                <FileText className="h-16 w-16 text-slate-400 mx-auto mb-3" />
                <Text size="2" className="text-slate-600 block mb-2">
                  Preview tidak tersedia untuk tipe file ini
                </Text>
                <Button
                  size="2"
                  variant="soft"
                  onClick={handleDownload}
                  style={{ borderRadius: 0 }}
                  className="cursor-pointer"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download File
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3 flex-shrink-0">
          <Button
            size="2"
            variant="soft"
            onClick={handleDownload}
            className="cursor-pointer hover:bg-green-100 text-green-700 border border-green-200"
            style={{ borderRadius: 0 }}
          >
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
          <Button
            size="2"
            variant="soft"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer hover:bg-red-100 text-red-700 border border-red-200"
            style={{ borderRadius: 0 }}
          >
            <X className="h-3.5 w-3.5" />
            Tutup
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
