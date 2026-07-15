// Favorietenlijst — gebruikt dezelfde hook als Gezien
import BackButton from '../components/BackButton.jsx'
import { FilmGrid } from '../components/FilmListItem.jsx'
import { FAVORITES_LIST_NAME } from '../constants/api.js'
import { useNamedListFilms } from '../hooks/useNamedListFilms.js'

function FavoritesPage() {
  const { films, loading, error } = useNamedListFilms(FAVORITES_LIST_NAME, {
    createIfMissing: true,
  })

  return (
    <section className="page list-detail-page">
      <BackButton />
      <h1>Favorieten</h1>

      {loading && <p>Films laden...</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && films.length === 0 && <p>Nog geen favorieten.</p>}

      {!loading && films.length > 0 && <FilmGrid films={films} />}
    </section>
  )
}

export default FavoritesPage
