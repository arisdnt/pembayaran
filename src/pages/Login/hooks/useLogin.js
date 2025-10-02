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
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const redirectPath = location.state?.from?.pathname ?? '/dashboard'

  useEffect(() => {
    if (user) {
      navigate(redirectPath, { replace: true })
    }
  }, [navigate, redirectPath, user])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (signInError) {
      setError(signInError.message)
    } else {
      navigate(redirectPath, { replace: true })
    }

    setLoading(false)
  }

  async function handleMagicLink() {
    setError('')
    setLoading(true)

    const { error: magicError } = await supabase.auth.signInWithOtp({
      email,
    })

    if (magicError) {
      setError(magicError.message)
    } else {
      setError('Kami telah mengirim tautan login ke email Anda.')
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
    handleSubmit,
    handleMagicLink,
  }
}
