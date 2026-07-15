// Layout voor ingelogde pagina's — redirect naar login als je niet bent ingelogd
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function AppLayout() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <p className="loading-message">Laden...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="app-layout">
      <main className="app-main">
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
