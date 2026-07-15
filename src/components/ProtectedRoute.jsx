// Beschermt routes die alleen ingelogd mogen (niet meer actief gebruikt, AppLayout doet dit nu)
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <p className="loading-message">Laden...</p>
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
