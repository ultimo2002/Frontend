// Terug-knop en snelkoppeling naar het dashboard
import { Link, useNavigate } from 'react-router-dom'

function BackButton() {
  const navigate = useNavigate()

  return (
    <div className="page-nav">
      <button type="button" className="page-nav__btn" onClick={() => navigate(-1)}>
        Terug
      </button>
      <Link to="/dashboard" className="page-nav__btn">
        Home
      </Link>
    </div>
  )
}

export default BackButton
