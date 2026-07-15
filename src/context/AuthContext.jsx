// Login state voor de hele app (token + gebruiker)
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { signIn, signUp } from '../services/authService.js'

const TOKEN_KEY = 'moovee_token'

const AuthContext = createContext(null)

function getStoredToken() {
  return localStorage.getItem(TOKEN_KEY)
}

// Haal gebruikersinfo uit het JWT-token
function userFromToken(decoded, loginUser) {
  const roles = loginUser?.roles || (decoded.role ? [decoded.role] : [])

  return {
    id: decoded.userId,
    email: decoded.email || loginUser?.email,
    username: decoded.email || loginUser?.email,
    roles,
  }
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(getStoredToken)
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Bij opstarten: kijk of er nog een token in localStorage staat
  useEffect(() => {
    const storedToken = getStoredToken()

    if (!storedToken) {
      setLoading(false)
      return
    }

    try {
      const decoded = jwtDecode(storedToken)
      setUser(userFromToken(decoded))
      setToken(storedToken)
    } catch {
      // Token is verlopen of ongeldig — opruimen
      localStorage.removeItem(TOKEN_KEY)
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  async function login(email, password) {
    const data = await signIn(email, password)
    const accessToken = data.token

    if (!accessToken) {
      throw new Error('Geen token ontvangen van de server.')
    }

    localStorage.setItem(TOKEN_KEY, accessToken)
    setToken(accessToken)
    setUser(userFromToken(jwtDecode(accessToken), data.user))

    return data
  }

  async function register(email, password) {
    return signUp(email, password)
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      loading,
      login,
      register,
      logout,
    }),
    [token, user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}

export { AuthProvider, useAuth }
