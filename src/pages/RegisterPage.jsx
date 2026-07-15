import { useState } from 'react'
import { Link } from 'react-router-dom'
import CowLogo from '../components/CowLogo.jsx'

function RegisterPage() {
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
          autoComplete="new-password"
          minLength={6}
          required
        />
        <button type="submit">Registreren</button>
      </form>

      <p className="login-footer">
        Al een account? <Link to="/">Inloggen</Link>
      </p>
    </div>
  )
}

export default RegisterPage
