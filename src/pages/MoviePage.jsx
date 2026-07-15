import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import BackButton from '../components/BackButton.jsx'
import { getMovieById, getMoviePosterUrl } from '../services/tmdbService.js'

function formatMoney(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function MoviePage() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMovie() {
      setLoading(true)
      setError('')

      try {
        const data = await getMovieById(id)
        setMovie(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadMovie()
  }, [id])

  if (loading) {
    return (
      <section className="page">
        <BackButton />
        <p className="loading-message">Film laden...</p>
      </section>
    )
  }

  if (!movie) {
    return (
      <section className="page">
        <BackButton />
        <p className="form-error">{error || 'Film niet gevonden.'}</p>
      </section>
    )
  }

  const poster = getMoviePosterUrl(movie.poster_path, 'w500')
  const userScore = Math.round((movie.vote_average || 0) * 10)
  const cast = movie.credits?.cast?.slice(0, 6) || []

  return (
    <section className="movie-detail">
      <BackButton />
      <div className="movie-detail__top">
        <div className="movie-detail__poster-block">
          {poster ? (
            <img src={poster} alt="" className="movie-detail__poster" />
          ) : (
            <div className="movie-detail__poster movie-detail__poster--placeholder">[FOTO]</div>
          )}
          <div className="movie-detail__title-row">
            <h1>{movie.title}</h1>
          </div>
          <p className="movie-detail__user-score">{userScore}% gebruikersscore</p>
        </div>

        <div className="movie-detail__overview">
          <p>{movie.overview}</p>
        </div>
      </div>

      <div className="movie-detail__meta">
        <dl className="movie-detail__facts">
          <div>
            <dt>Originele titel</dt>
            <dd>{movie.original_title}</dd>
          </div>
          <div>
            <dt>Status</dt>
            <dd>{movie.status}</dd>
          </div>
          <div>
            <dt>Originele taal</dt>
            <dd>{movie.original_language}</dd>
          </div>
          <div>
            <dt>Budget</dt>
            <dd>{formatMoney(movie.budget)}</dd>
          </div>
          <div>
            <dt>Opbrengst</dt>
            <dd>{formatMoney(movie.revenue)}</dd>
          </div>
        </dl>

        <div className="movie-detail__cast">
          <h2>Acteurs</h2>
          <ul>
            {cast.map((person, index) => (
              <li key={person.id} className={index === 0 ? 'movie-detail__cast--lead' : ''}>
                &gt; {person.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <p className="movie-detail__id">ID: {id}</p>
    </section>
  )
}

export default MoviePage
