// Profielpagina met e-mail en uitlog-knop
import BackButton from '../components/BackButton.jsx'
import { useAuth } from '../context/AuthContext.jsx'

function AccountPage() {
  const { user, logout } = useAuth()

  return (
    <section className="page page--account">
      <BackButton />
      <h1>Mijn account</h1>
      <div className="info-card">
        <p>
          <strong>E-mail:</strong> {user?.email || user?.username}
        </p>
      </div>
      <button type="button" className="btn" onClick={logout}>
        Uitloggen
      </button>
    </section>
  )
}

export default AccountPage
