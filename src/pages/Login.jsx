import { useLogin } from './Login/hooks/useLogin'
import { SchoolIdentity } from './Login/components/SchoolIdentity'
import { LoginForm } from './Login/components/LoginForm'

export function Login() {
  const {
    email,
    setEmail,
    password,
    setPassword,
    error,
    loading,
    handleSubmit,
    handleMagicLink,
  } = useLogin()

  return (
    <div className="min-h-screen flex">
      <SchoolIdentity />
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        error={error}
        loading={loading}
        onSubmit={handleSubmit}
        onMagicLink={handleMagicLink}
      />
    </div>
  )
}
