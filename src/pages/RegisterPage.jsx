// Registratiepagina — na succes doorsturen naar login
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CowLogo from '../components/CowLogo.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)

    try {
      await register(email, password)
      setSuccess('Account aangemaakt!')
      setTimeout(() => navigate('/'), 1200)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
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
          autoComplete="new-password"
          minLength={6}
          required
        />
        {error && <p className="form-error">{error}</p>}
        {success && <p className="form-success">{success}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? 'Bezig...' : 'Registreren'}
        </button>
      </form>

      <p className="login-footer">
        Al een account? <Link to="/">Inloggen</Link>
      </p>
    </div>
  )
}

export default RegisterPage
