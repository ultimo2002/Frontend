// Login/register routes — stuur ingelogde gebruikers door naar het dashboard
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function GuestRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <p className="loading-message">Laden...</p>
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return children || <Outlet />
}

export default GuestRoute
