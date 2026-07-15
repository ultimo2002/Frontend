// Gezien-lijst — films komen hier automatisch bij als je een review schrijft
import BackButton from '../components/BackButton.jsx'
import { FilmGrid } from '../components/FilmListItem.jsx'
import { SEEN_LIST_NAME } from '../constants/api.js'
import { useNamedListFilms } from '../hooks/useNamedListFilms.js'

function SeenPage() {
  const { films, loading, error } = useNamedListFilms(SEEN_LIST_NAME, {
    createIfMissing: true,
  })

  return (
    <section className="page list-detail-page">
      <BackButton />
      <h1>Gezien</h1>

      {loading && <p>Films laden...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && films.length === 0 && <p>Nog geen films gezien.</p>}

      {!loading && films.length > 0 && <FilmGrid films={films} />}
    </section>
  )
}

export default SeenPage
