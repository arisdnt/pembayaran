import { useState, useEffect } from 'react'
import { Button, Dialog, Text as RadixText } from '@radix-ui/themes'
import { Save, Eye, EyeOff, Key, AlertCircle, CheckCircle2, X } from 'lucide-react'
import { supabase } from '../../../lib/supabaseClient'

export default function SettingsModal({ open, onOpenChange }) {
  const [fonnteApiKey, setFonnteApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    if (open) {
      fetchSettings()
    }
  }, [open])

  const fetchSettings = async () => {
    setFetching(true)
    try {
      const { data, error } = await supabase
        .from('pengaturan_whatsapp')
        .select('value')
        .eq('key', 'fonnte_api_key')
        .eq('is_active', true)
        .single()

      if (error && error.code !== 'PGRST116') { // Ignore not found error
        console.error('Error fetching settings:', error)
        showNotification('error', 'Gagal memuat pengaturan: ' + error.message)
        return
      }

      if (data) {
        setFonnteApiKey(data.value || '')
      }
    } catch (e) {
      console.error('Exception fetching settings:', e)
      showNotification('error', 'Gagal memuat pengaturan')
    } finally {
      setFetching(false)
    }
  }

  const showNotification = (type, message) => {
    setNotification({ type, message })
    setTimeout(() => setNotification(null), 5000)
  }

  const handleSave = async () => {
    if (!fonnteApiKey || fonnteApiKey.trim() === '') {
      showNotification('error', 'API Key tidak boleh kosong')
      return
    }

    setLoading(true)
    try {
      const { error } = await supabase
        .from('pengaturan_whatsapp')
        .update({ 
          value: fonnteApiKey.trim(),
          diperbarui_pada: new Date().toISOString()
        })
        .eq('key', 'fonnte_api_key')

      if (error) {
        console.error('Error saving settings:', error)
        showNotification('error', 'Gagal menyimpan: ' + error.message)
        return
      }

      showNotification('success', 'API Key berhasil disimpan!')
      setTimeout(() => {
        onOpenChange(false)
      }, 1500)
    } catch (e) {
      console.error('Exception saving settings:', e)
      showNotification('error', 'Gagal menyimpan pengaturan')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Content
        style={{
          maxWidth: '500px',
          width: '95vw',
          padding: 0,
          borderRadius: 0,
          overflow: 'hidden'
        }}
        className="border-2 border-slate-300 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-slate-300 bg-gradient-to-b from-blue-50 to-blue-100 px-5 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center border border-blue-700 bg-blue-600 shadow-sm">
              <Key className="h-5 w-5 text-white" />
            </div>
            <div>
              <Dialog.Title asChild>
                <RadixText size="3" weight="bold" className="text-slate-800 uppercase tracking-wider">
                  Pengaturan WhatsApp
                </RadixText>
              </Dialog.Title>
              <Dialog.Description asChild>
                <RadixText size="1" className="text-slate-500 block mt-0.5">
                  Konfigurasi API Fonnte
                </RadixText>
              </Dialog.Description>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="flex h-8 w-8 items-center justify-center hover:bg-blue-200 hover:border-blue-400 transition-all border border-slate-300 group"
            aria-label="Close"
            type="button"
          >
            <X className="h-4 w-4 text-slate-600 group-hover:text-blue-700 transition-colors" />
          </button>
        </div>

        {/* Content */}
        <div className="bg-white p-6">
          {/* Notification */}
          {notification && (
            <div className="mb-4 animate-slide-in">
              <div
                className={`
                  flex items-start gap-3 px-3 py-2.5 border
                  ${notification.type === 'success' ? 'bg-green-50 border-green-500 border-l-4' : 'bg-red-50 border-red-500 border-l-4'}
                `}
                style={{ borderRadius: 0 }}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center shrink-0 ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}
                  style={{ borderRadius: 0 }}
                >
                  {notification.type === 'success' ? (
                    <CheckCircle2 className="h-3.5 w-3.5 text-white" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className={`text-xs font-bold block ${notification.type === 'success' ? 'text-green-700' : 'text-red-700'}`}>
                    {notification.type === 'success' ? 'Berhasil' : 'Gagal'}
                  </span>
                  <p className={`text-xs ${notification.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                    {notification.message}
                  </p>
                </div>
              </div>
            </div>
          )}

          {fetching ? (
            <div className="py-8 text-center text-slate-600">
              <div className="animate-spin h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-3" style={{ borderRadius: 0 }}></div>
              Memuat pengaturan...
            </div>
          ) : (
            <div className="space-y-5">
              {/* API Key Input */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fonnte API Key <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showApiKey ? 'text' : 'password'}
                    value={fonnteApiKey}
                    onChange={(e) => setFonnteApiKey(e.target.value)}
                    placeholder="Masukkan API Key dari Fonnte Dashboard"
                    className="w-full px-3 py-2 pr-10 border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
                    style={{ borderRadius: 0 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 transition-colors"
                    title={showApiKey ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {showApiKey ? (
                      <EyeOff className="h-4 w-4 text-slate-600" />
                    ) : (
                      <Eye className="h-4 w-4 text-slate-600" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-slate-600 mt-1.5">
                  Dapatkan API Key dari{' '}
                  <a
                    href="https://fonnte.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:underline"
                  >
                    Fonnte Dashboard
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-5 py-3">
          <Button
            type="button"
            variant="soft"
            color="gray"
            onClick={() => onOpenChange(false)}
            style={{ borderRadius: 0 }}
            className="cursor-pointer border border-slate-300 shadow-sm hover:shadow"
          >
            Batal
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || fetching}
            style={{
              borderRadius: 0,
              backgroundColor: '#2563eb',
              border: '1px solid #1d4ed8'
            }}
            className="cursor-pointer text-white shadow-sm hover:shadow"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </Dialog.Content>
    </Dialog.Root>
  )
}
