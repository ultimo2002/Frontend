// Navigatie op het dashboard (profiel, gezien, lijsten, favorieten)
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

function DashboardNav() {
  const { user } = useAuth()

  const items = [
    { to: '/account', label: 'Profiel', icon: 'user' },
    { to: '/seen', label: 'Gezien', icon: 'eyes' },
    { to: '/lists', label: 'Lijsten', icon: 'list' },
    { to: '/favorites', label: 'Favorieten', icon: 'star' },
  ]

  return (
    <nav className="dashboard-nav">
      {items.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          className="dashboard-nav__item"
          title={item.icon === 'user' ? user?.email : undefined}
          aria-label={item.label}
        >
          <div className="dashboard-nav__box">
            {item.icon === 'user' && (
              <span className="dashboard-nav__icon dashboard-nav__icon--user" aria-hidden="true" />
            )}
            {item.icon === 'eyes' && (
              <span className="dashboard-nav__icon dashboard-nav__icon--eyes" aria-hidden="true">
                ◉◉
              </span>
            )}
            {item.icon === 'list' && (
              <span className="dashboard-nav__icon dashboard-nav__icon--list" aria-hidden="true">
                1  - - - -<br />2  - - - -<br />3  - - - -<br />4  - - - -<br />5  - - - -
              </span>
            )}
            {item.icon === 'star' && (
              <span className="dashboard-nav__icon dashboard-nav__icon--star" aria-hidden="true">
                ★
              </span>
            )}
          </div>
          <span className="dashboard-nav__label">{item.label}</span>
        </Link>
      ))}
    </nav>
  )
}

export default DashboardNav
