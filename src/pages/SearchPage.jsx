// Zoekresultaten — films en acteurs van TMDB
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import BackButton from '../components/BackButton.jsx'
import { getMoviePosterUrl, searchMovies, searchPeople } from '../services/tmdbService.js'

function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [results, setResults] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Zoek opnieuw als de query in de URL verandert
  useEffect(() => {
    if (!query) return

    async function runSearch() {
      setLoading(true)
      setError('')

      try {
        const [movies, people] = await Promise.all([
          searchMovies(query),
          searchPeople(query),
        ])
        setResults([
          ...movies.results.map((item) => ({ ...item, type: 'film' })),
          ...people.results.map((item) => ({ ...item, type: 'acteur' })),
        ])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    runSearch()
  }, [query])

  if (!query) {
    return (
      <section className="page">
        <BackButton />
        <p>Voer eerst een zoekterm in.</p>
      </section>
    )
  }

  return (
    <section className="page">
      <BackButton />
      <h1>Zoekresultaten voor &quot;{query}&quot;</h1>
      {loading && <p>Laden...</p>}
      {error && <p className="form-error">{error}</p>}
      {!loading && !error && results.length === 0 && <p>Niks gevonden</p>}

      <ul className="search-results">
        {results.map((item) => {
          const title = item.title || item.name
          const poster = getMoviePosterUrl(item.poster_path || item.profile_path)

          if (item.type === 'film') {
            return (
              <li key={`film-${item.id}`} className="search-result">
                {poster && <img src={poster} alt="" className="search-result__poster" />}
                <span className="search-result__type">Film</span>
                <Link to={`/movie/${item.id}`}>{title}</Link>
              </li>
            )
          }

          // Acteurpagina bestaat nog niet, dus alleen de naam tonen
          return (
            <li key={`person-${item.id}`} className="search-result">
              {poster && <img src={poster} alt="" className="search-result__poster" />}
              <span className="search-result__type">Acteur</span>
              <strong>{title}</strong>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

export default SearchPage
