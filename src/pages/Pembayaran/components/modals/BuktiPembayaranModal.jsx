import { Dialog, Text, Button } from '@radix-ui/themes'
import { X, FileText, Download, ExternalLink } from 'lucide-react'
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

  const handleDownload = () => {
    window.open(buktiUrl, '_blank')
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
        style={{ maxWidth: '900px', width: '90vw', padding: 0, borderRadius: 0 }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-blue-600 to-blue-700 px-5 py-4">
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
        <div className="bg-white p-5 max-h-[70vh] overflow-auto">
          {/* File Info */}
          <div className="mb-4 pb-3 border-b-2 border-slate-300 flex items-center justify-between">
            <div>
              <Text size="2" weight="medium" className="text-slate-700 block">
                Nama File
              </Text>
              <Text size="2" className="text-slate-900 font-mono block mt-1">
                {fileName}
              </Text>
            </div>
            <div className="flex gap-2">
              <Button
                size="2"
                variant="soft"
                onClick={handleDownload}
                style={{ borderRadius: 0 }}
                className="cursor-pointer"
              >
                <Download className="h-3.5 w-3.5" />
                Download
              </Button>
              <Button
                size="2"
                variant="soft"
                onClick={() => window.open(buktiUrl, '_blank')}
                style={{ borderRadius: 0 }}
                className="cursor-pointer"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Buka Tab Baru
              </Button>
            </div>
          </div>

          {/* Preview Area */}
          <div className="bg-slate-50 border-2 border-slate-300 p-4 min-h-[400px] flex items-center justify-center">
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
              <div className="w-full">
                <img
                  src={buktiUrl}
                  alt="Bukti Pembayaran"
                  className="max-w-full h-auto mx-auto border border-slate-300 shadow-lg"
                  onError={handleImageError}
                  onLoad={handleImageLoad}
                  style={{ maxHeight: '60vh' }}
                />
              </div>
            )}

            {!loading && !error && fileType === 'pdf' && (
              <div className="w-full h-full">
                <iframe
                  src={buktiUrl}
                  title="Bukti Pembayaran PDF"
                  className="w-full border border-slate-300"
                  style={{ minHeight: '500px' }}
                  onError={handleImageError}
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
        <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <Button
            variant="soft"
            color="gray"
            onClick={() => onOpenChange(false)}
            style={{ borderRadius: 0 }}
            className="cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Tutup
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
