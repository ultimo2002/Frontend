import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BackButton from '../components/BackButton.jsx'
import { getMoviePosterUrl, getPersonById } from '../services/tmdbService.js'

// TMDB geeft een ISO datum terug; dit maakt er een leesbare datum van.
function formatBirthday(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('nl-NL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function getAge(value) {
  if (!value) return null

  const birthday = new Date(value)
  if (Number.isNaN(birthday.getTime())) return null

  const now = new Date()
  let age = now.getFullYear() - birthday.getFullYear()
  const monthDiff = now.getMonth() - birthday.getMonth()
  const beforeBirthday =
    monthDiff < 0 || (monthDiff === 0 && now.getDate() < birthday.getDate())

  if (beforeBirthday) {
    age -= 1
  }

  return age >= 0 ? age : null
}

function ActorPage() {
  const { id } = useParams()
  const [actor, setActor] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadActor() {
      setLoading(true)
      setError('')

      try {
        const data = await getPersonById(id)
        if (!cancelled) {
          setActor(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setActor(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadActor()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <section className="page">
        <BackButton />
        <p className="loading-message">Acteur laden...</p>
      </section>
    )
  }

  if (!actor) {
    return (
      <section className="page">
        <BackButton />
        <p className="form-error">{error || 'Acteur niet gevonden.'}</p>
      </section>
    )
  }

  const profile = getMoviePosterUrl(actor.profile_path, 'w342')

  // "Known for" ordenen op populariteit voelt het meest logisch voor gebruikers.
  const knownFor = (actor.movie_credits?.cast || [])
    .filter((movie) => movie?.id && movie?.title)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 8)

  const age = getAge(actor.birthday)

  return (
    <section className="actor-detail">
      <BackButton />
      <div className="actor-detail__layout">
        <aside className="actor-detail__sidebar">
          {profile ? (
            <img src={profile} alt={actor.name || ''} className="actor-detail__photo" />
          ) : (
            <div className="actor-detail__photo actor-detail__photo--placeholder">[FOTO]</div>
          )}

          <div className="actor-detail__known-for">
            <h2>Known for:</h2>
            <ul>
              {knownFor.map((movie) => (
                <li key={movie.id}>
                  <Link to={`/movie/${movie.id}`}>&gt;{movie.title}</Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="actor-detail__content">
          <h1>{actor.name}</h1>
          <p>{actor.biography?.trim() || 'Geen biografie beschikbaar.'}</p>

          <dl className="actor-detail__facts">
            <div>
              <dt>Birthday</dt>
              <dd>
                {formatBirthday(actor.birthday)}
                {age !== null ? ` (${age} years old)` : ''}
              </dd>
            </div>
            <div>
              <dt>Place of Birth</dt>
              <dd>{actor.place_of_birth || '-'}</dd>
            </div>
            <div>
              <dt>Also Known As</dt>
              <dd>
                {actor.also_known_as?.length
                  ? actor.also_known_as.join(', ')
                  : '-'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="actor-detail__id">ID: {id}</p>
    </section>
  )
}

export default ActorPage
