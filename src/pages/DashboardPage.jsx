// Startpagina na inloggen — navigatie en zoekbalk
import DashboardNav from '../components/DashboardNav.jsx'
import SearchBar from '../components/SearchBar.jsx'

function DashboardPage() {
  return (
    <section className="dashboard-page">
      <div className="dashboard-page__content">
        <DashboardNav />
        <SearchBar />
      </div>
    </section>
  )
}

export default DashboardPage
