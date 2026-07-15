// Startpunt van de app — hier mounten we React in de DOM
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* AuthProvider moet boven App staan zodat elke pagina bij de login kan */}
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
