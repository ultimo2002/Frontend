// Inlogpagina
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CowLogo from '../components/CowLogo.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {await login(email, password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {setSubmitting(false)
    }
  }

  return (
      //invoervelden met logo
    <div className="login-page login-page--standalone">
      <CowLogo />

      <form className="login-form" onSubmit={handleSubmit}>
        <input

          type="email"
          placeholder="E-mailadres"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          required
        />
        <input
          type="password"
          placeholder="Wachtwoord"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        {error && <p className="form-error">{error}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Bezig...' : 'Inloggen'}
        </button>
      </form>

      <p className="login-footer">
        Nog geen account? <Link to="/register">Registreren</Link>
      </p>
    </div>
  )
}

export default LoginPage
