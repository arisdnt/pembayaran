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

  function isOfflineLike(message) {
    try {
      const msg = (message || '').toString().toLowerCase()
      return (
        (typeof navigator !== 'undefined' && navigator?.onLine === false) ||
        msg.includes('failed to fetch') ||
        msg.includes('networkerror') ||
        msg.includes('network request failed') ||
        msg.includes('fetch failed') ||
        msg.includes('getaddrinfo enotfound') ||
        msg.includes('enotfound') ||
        msg.includes('econnrefused') ||
        msg.includes('timeout')
      )
    } catch (_) {
      return false
    }
  }

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
        // Default messages
        let errorTitle = 'Login Gagal'
        let errorMessage = 'Login gagal. Silakan coba lagi.'
        let errorDetails = signInError.message

        // Offline / network-friendly messaging
        if (isOfflineLike(signInError.message)) {
          errorTitle = 'Masalah Koneksi'
          errorMessage = 'Tidak ada koneksi internet'
          errorDetails = 'Periksa jaringan Anda (Wi‑Fi/data), lalu coba lagi.'
        }

        if (signInError.message.includes('Invalid login credentials')) {
          errorMessage = 'Email atau password salah'
          errorDetails = 'Pastikan email dan password yang Anda masukkan sudah benar.'
        } else if (signInError.message.includes('Email not confirmed')) {
          errorMessage = 'Email belum diverifikasi'
          errorDetails = 'Silakan cek email Anda untuk verifikasi akun.'
        }

        setError({
          title: errorTitle,
          message: errorMessage,
          details: errorDetails
        })
        setErrorModalOpen(true)
      } else {
        navigate(redirectPath, { replace: true })
      }
    } catch (err) {
      const offline = isOfflineLike(err?.message)
      setError({
        title: 'Masalah Koneksi',
        message: offline ? 'Tidak ada koneksi internet' : 'Tidak dapat terhubung ke server',
        details: offline ? 'Periksa jaringan Anda (Wi‑Fi/data), lalu coba lagi.' : 'Periksa koneksi internet Anda dan coba lagi.'
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
        const offline = isOfflineLike(magicError.message)
        setError({
          title: offline ? 'Masalah Koneksi' : 'Magic Link Gagal',
          message: offline ? 'Tidak ada koneksi internet' : 'Gagal mengirim link login',
          details: offline ? 'Periksa jaringan Anda (Wi‑Fi/data), lalu coba lagi.' : magicError.message
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
      const offline = isOfflineLike(err?.message)
      setError({
        title: 'Masalah Koneksi',
        message: offline ? 'Tidak ada koneksi internet' : 'Tidak dapat terhubung ke server',
        details: offline ? 'Periksa jaringan Anda (Wi‑Fi/data), lalu coba lagi.' : 'Periksa koneksi internet Anda dan coba lagi.'
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
