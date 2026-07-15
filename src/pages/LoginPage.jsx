import { useState } from 'react'
import { Link } from 'react-router-dom'
import CowLogo from '../components/CowLogo.jsx'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
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
          autoComplete="current-password"
          required
        />
        <button type="submit">Inloggen</button>
      </form>

      <p className="login-footer">
        Nog geen account? <Link to="/register">Registreren</Link>
      </p>
    </div>
  )
}

export default LoginPage
