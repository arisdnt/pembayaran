import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '../../../lib/supabaseClient'
import { useAuth } from '../../../contexts/AuthContext'

export function useLogin() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const [errorModalOpen, setErrorModalOpen] = useState(false)

  const redirectPath = location.state?.from?.pathname ?? '/dashboard'

  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true })
    }
  }, [navigate, redirectPath, user])

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        let errorMessage = 'Login gagal. Silakan coba lagi.'
        let errorDetails = signInError.message

        if (signInError.message.includes('Invalid login credentials')) {
          errorMessage = 'Email atau password salah'
          errorDetails = 'Pastikan email dan password yang Anda masukkan sudah benar.'
        } else if (signInError.message.includes('Email not confirmed')) {
          errorMessage = 'Email belum diverifikasi'
          errorDetails = 'Silakan cek email Anda untuk verifikasi akun.'
        }

        setError({
          title: 'Login Gagal',
          message: errorMessage,
          details: errorDetails
        })
        setErrorModalOpen(true)
      } else {
        navigate(redirectPath, { replace: true })
      }
    } catch (err) {
      setError({
        title: 'Masalah Koneksi',
        message: 'Tidak dapat terhubung ke server',
        details: 'Periksa koneksi internet Anda dan coba lagi.'
      })
      setErrorModalOpen(true)
    }

    setLoading(false)
  }

  async function handleMagicLink() {
    setError(null)
    setLoading(true)

    try {
      const { error: magicError } = await supabase.auth.signInWithOtp({
        email,
      })

      if (magicError) {
        setError({
          title: 'Magic Link Gagal',
          message: 'Gagal mengirim link login',
          details: magicError.message
        })
        setErrorModalOpen(true)
      } else {
        setError({
          title: 'Berhasil',
          message: 'Kami telah mengirim tautan login ke email Anda.',
          details: 'Silakan cek inbox email Anda dan klik tautan untuk masuk.',
          variant: 'success'
        })
        setErrorModalOpen(true)
      }
    } catch (err) {
      setError({
        title: 'Masalah Koneksi',
        message: 'Tidak dapat terhubung ke server',
        details: 'Periksa koneksi internet Anda dan coba lagi.'
      })
      setErrorModalOpen(true)
    }

    setLoading(false)
  }

  return {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    errorModalOpen,
    setErrorModalOpen,
    handleSubmit,
    handleMagicLink,
  }
}
