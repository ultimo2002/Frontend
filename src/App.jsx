// Alle routes van de app
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './components/AppLayout.jsx'
import GuestRoute from './components/GuestRoute.jsx'
import AccountPage from './pages/AccountPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import FavoritesPage from './pages/FavoritesPage.jsx'
import ListsPage from './pages/ListsPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import MoviePage from './pages/MoviePage.jsx'
import PersonPage from './pages/PersonPage.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import SearchPage from './pages/SearchPage.jsx'
import SeenPage from './pages/SeenPage.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login en register — alleen voor gasten */}
        <Route element={<GuestRoute />}>
          <Route index element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        {/* Ingelogde pagina's met gedeelde layout */}
        <Route element={<AppLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="account" element={<AccountPage />} />
          <Route path="lists" element={<ListsPage />} />
          <Route path="seen" element={<SeenPage />} />
          <Route path="favorites" element={<FavoritesPage />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="movie/:id" element={<MoviePage />} />
          <Route path="person/:id" element={<PersonPage />} />
        </Route>

        {/* Onbekende URL? Terug naar login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
