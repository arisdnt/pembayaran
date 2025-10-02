import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageLayout } from '../layout/PageLayout'
import { Text, Button, TextField } from '@radix-ui/themes'
import { Lock, ArrowLeft, Eye, EyeOff, CheckCircle, AlertCircle, Key } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'

export function UbahPassword() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [formData, setFormData] = useState({
    passwordLama: '',
    passwordBaru: '',
    konfirmasiPassword: '',
  })
  const [showPasswordLama, setShowPasswordLama] = useState(false)
  const [showPasswordBaru, setShowPasswordBaru] = useState(false)
  const [showKonfirmasi, setShowKonfirmasi] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    // Validasi
    if (!formData.passwordLama || !formData.passwordBaru || !formData.konfirmasiPassword) {
      setError('Semua field wajib diisi')
      return
    }

    if (formData.passwordBaru.length < 6) {
      setError('Password baru minimal 6 karakter')
      return
    }

    if (formData.passwordBaru !== formData.konfirmasiPassword) {
      setError('Password baru dan konfirmasi password tidak cocok')
      return
    }

    if (formData.passwordLama === formData.passwordBaru) {
      setError('Password baru tidak boleh sama dengan password lama')
      return
    }

    setLoading(true)

    try {
      // Verifikasi password lama dengan mencoba login ulang
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: formData.passwordLama,
      })

      if (signInError) {
        throw new Error('Password lama tidak sesuai')
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: formData.passwordBaru,
      })

      if (updateError) throw updateError

      setSuccess(true)
      setFormData({
        passwordLama: '',
        passwordBaru: '',
        konfirmasiPassword: '',
      })

      // Redirect setelah 2 detik
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)

    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengubah password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <PageLayout>
      <div className="h-full flex flex-col -mb-3">
        {/* Header */}
        <div className="shrink-0 bg-white px-2 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-blue-600" />
              <Text size="4" weight="bold" className="text-slate-900">
                Ubah Password
              </Text>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
              type="button"
            >
              <ArrowLeft className="h-4 w-4 text-slate-600" />
              <Text size="2" weight="medium" className="text-slate-700">
                Kembali
              </Text>
            </button>
          </div>
        </div>

        {/* Content - Layout 2 Kolom */}
        <div className="flex-1 overflow-auto excel-scrollbar bg-white">
          <div className="px-2 pt-2 pb-0">
            <div className="grid grid-cols-[60%_40%] gap-4">

              {/* Kolom Kiri - Form */}
              <div className="border-2 border-slate-300 bg-white shadow-lg flex flex-col">
                {/* Form Header */}
                <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center bg-blue-600 border border-blue-700">
                      <Key className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
                        Form Ubah Password
                      </Text>
                      <Text size="1" className="text-slate-600">
                        Masukkan password lama dan password baru
                      </Text>
                    </div>
                  </div>
                </div>

                {/* Form Content */}
                <form onSubmit={handleSubmit} className="flex-1 p-4 flex flex-col">
                  <div className="space-y-4 flex-1">
                    {/* Success Message */}
                    {success && (
                      <div className="flex items-start gap-3 p-4 bg-green-50 border-2 border-green-300">
                        <CheckCircle className="h-5 w-5 text-green-600 shrink-0 mt-0.5" />
                        <div>
                          <Text size="2" weight="bold" className="text-green-800 block mb-1">
                            Password Berhasil Diubah!
                          </Text>
                          <Text size="2" className="text-green-700">
                            Password Anda telah berhasil diperbarui. Anda akan dialihkan ke dashboard...
                          </Text>
                        </div>
                      </div>
                    )}

                    {/* Error Message */}
                    {error && (
                      <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-300">
                        <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                        <div>
                          <Text size="2" weight="bold" className="text-red-800 block mb-1">
                            Terjadi Kesalahan
                          </Text>
                          <Text size="2" className="text-red-700">
                            {error}
                          </Text>
                        </div>
                      </div>
                    )}

                  {/* Password Lama */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-red-500" />
                      <Text as="div" size="2" weight="medium" className="text-slate-700">
                        Password Lama <span className="text-red-600">*</span>
                      </Text>
                    </div>
                    <div className="relative">
                      <TextField.Root
                        type={showPasswordLama ? 'text' : 'password'}
                        placeholder="Masukkan password lama"
                        value={formData.passwordLama}
                        onChange={(e) => setFormData({ ...formData, passwordLama: e.target.value })}
                        style={{ borderRadius: 0, paddingRight: '40px' }}
                        required
                        disabled={loading || success}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordLama(!showPasswordLama)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 transition-colors"
                        style={{ borderRadius: 0 }}
                        disabled={loading || success}
                      >
                        {showPasswordLama ? (
                          <EyeOff className="h-4 w-4 text-slate-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Password Baru */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-green-500" />
                      <Text as="div" size="2" weight="medium" className="text-slate-700">
                        Password Baru <span className="text-red-600">*</span>
                      </Text>
                    </div>
                    <div className="relative">
                      <TextField.Root
                        type={showPasswordBaru ? 'text' : 'password'}
                        placeholder="Masukkan password baru (minimal 6 karakter)"
                        value={formData.passwordBaru}
                        onChange={(e) => setFormData({ ...formData, passwordBaru: e.target.value })}
                        style={{ borderRadius: 0, paddingRight: '40px' }}
                        required
                        disabled={loading || success}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswordBaru(!showPasswordBaru)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 transition-colors"
                        style={{ borderRadius: 0 }}
                        disabled={loading || success}
                      >
                        {showPasswordBaru ? (
                          <EyeOff className="h-4 w-4 text-slate-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-500" />
                        )}
                      </button>
                    </div>
                    <Text size="1" className="text-slate-500 mt-1">
                      Password minimal 6 karakter
                    </Text>
                  </div>

                  {/* Konfirmasi Password */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Lock className="h-4 w-4 text-blue-500" />
                      <Text as="div" size="2" weight="medium" className="text-slate-700">
                        Konfirmasi Password Baru <span className="text-red-600">*</span>
                      </Text>
                    </div>
                    <div className="relative">
                      <TextField.Root
                        type={showKonfirmasi ? 'text' : 'password'}
                        placeholder="Masukkan ulang password baru"
                        value={formData.konfirmasiPassword}
                        onChange={(e) => setFormData({ ...formData, konfirmasiPassword: e.target.value })}
                        style={{ borderRadius: 0, paddingRight: '40px' }}
                        required
                        disabled={loading || success}
                      />
                      <button
                        type="button"
                        onClick={() => setShowKonfirmasi(!showKonfirmasi)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-100 transition-colors"
                        style={{ borderRadius: 0 }}
                        disabled={loading || success}
                      >
                        {showKonfirmasi ? (
                          <EyeOff className="h-4 w-4 text-slate-500" />
                        ) : (
                          <Eye className="h-4 w-4 text-slate-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  </div>

                  {/* Footer */}
                  <div className="border-t-2 border-slate-300 bg-gradient-to-b from-slate-50 to-slate-100 px-4 py-2 -mx-4 -mb-4 mt-4">
                    <div className="flex items-center justify-end gap-3">
                      <Button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        variant="soft"
                        color="gray"
                        size="3"
                        style={{ borderRadius: 0 }}
                        className="cursor-pointer"
                        disabled={loading}
                      >
                        Batal
                      </Button>
                      <Button
                        type="submit"
                        size="3"
                        style={{ 
                          borderRadius: 0,
                          backgroundColor: '#0066cc',
                          border: '1px solid #0052a3'
                        }}
                        className="cursor-pointer text-white"
                        disabled={loading || success}
                      >
                        <Lock className="h-4 w-4" />
                        {loading ? 'Mengubah Password...' : 'Ubah Password'}
                      </Button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Kolom Kanan - Informasi */}
              <div className="space-y-4">
                {/* Info Akun */}
                <div className="border-2 border-slate-300 bg-white shadow-lg">
                  <div className="border-b-2 border-slate-300 bg-gradient-to-b from-slate-100 to-slate-50 px-4 py-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center bg-indigo-600 border border-indigo-700">
                        <Key className="h-4 w-4 text-white" />
                      </div>
                      <Text size="2" weight="bold" className="text-slate-800 uppercase tracking-wider">
                        Informasi Akun
                      </Text>
                    </div>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div>
                        <Text size="2" className="text-slate-600 block mb-1">
                          Email
                        </Text>
                        <Text size="2" weight="bold" className="text-slate-900 font-mono">
                          {user?.email}
                        </Text>
                      </div>
                      <div>
                        <Text size="2" className="text-slate-600 block mb-1">
                          User ID
                        </Text>
                        <Text size="1" className="text-slate-700 font-mono break-all">
                          {user?.id}
                        </Text>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Panduan Keamanan */}
                <div className="border-2 border-slate-300 bg-white shadow-lg">
                  <div className="border-b-2 border-slate-300 bg-gradient-to-b from-amber-100 to-amber-50 px-4 py-2">
                    <Text size="2" weight="bold" className="text-amber-900 uppercase tracking-wider">
                      ⚠️ Panduan Keamanan
                    </Text>
                  </div>
                  <div className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-xs">
                          1
                        </div>
                        <div>
                          <Text size="2" weight="bold" className="text-slate-800 block mb-0.5">
                            Password Minimal 6 Karakter
                          </Text>
                          <Text size="1" className="text-slate-600">
                            Gunakan minimal 6 karakter untuk password Anda
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-green-700 font-bold text-xs">
                          2
                        </div>
                        <div>
                          <Text size="2" weight="bold" className="text-slate-800 block mb-0.5">
                            Kombinasi Karakter
                          </Text>
                          <Text size="1" className="text-slate-600">
                            Gunakan kombinasi huruf besar, huruf kecil, angka, dan simbol
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
                          3
                        </div>
                        <div>
                          <Text size="2" weight="bold" className="text-slate-800 block mb-0.5">
                            Jaga Kerahasiaan
                          </Text>
                          <Text size="1" className="text-slate-600">
                            Jangan bagikan password kepada siapa pun
                          </Text>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs">
                          4
                        </div>
                        <div>
                          <Text size="2" weight="bold" className="text-slate-800 block mb-0.5">
                            Tetap Login
                          </Text>
                          <Text size="1" className="text-slate-600">
                            Setelah password diubah, Anda akan tetap login
                          </Text>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tips Password Kuat */}
                <div className="border-2 border-slate-300 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-lg">
                  <div className="border-b-2 border-slate-300 bg-gradient-to-b from-blue-100 to-blue-50 px-4 py-2">
                    <Text size="2" weight="bold" className="text-blue-900 uppercase tracking-wider">
                      💡 Tips Password Kuat
                    </Text>
                  </div>
                  <div className="p-4">
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <Text size="1" className="text-slate-700">
                          Gunakan minimal 12 karakter untuk keamanan optimal
                        </Text>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <Text size="1" className="text-slate-700">
                          Hindari menggunakan kata yang ada di kamus
                        </Text>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <Text size="1" className="text-slate-700">
                          Jangan gunakan informasi pribadi (nama, tanggal lahir)
                        </Text>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <Text size="1" className="text-slate-700">
                          Ubah password secara berkala untuk keamanan
                        </Text>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <Text size="1" className="text-slate-700">
                          Gunakan password yang berbeda untuk setiap akun
                        </Text>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Excel-style scrollbar */}
      <style>{`
        .excel-scrollbar::-webkit-scrollbar {
          width: 16px;
          height: 16px;
        }
        
        .excel-scrollbar::-webkit-scrollbar-track {
          background: #e2e8f0;
          border-left: 1px solid #cbd5e1;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb {
          background: #94a3b8;
          border: 2px solid #e2e8f0;
          transition: background 0.2s;
        }
        
        .excel-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </PageLayout>
  )
}
