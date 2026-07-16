// Persoonspagina — details en bekende films van TMDB
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

function PersonPage() {
  const { id } = useParams()
  const [person, setPerson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadPerson() {
      setLoading(true)
      setError('')

      try {
        const data = await getPersonById(id)
        if (!cancelled) {
          setPerson(data)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setPerson(null)
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadPerson()
    return () => {
      cancelled = true
    }
  }, [id])

  if (loading) {
    return (
      <section className="page">
        <BackButton />
        <p className="loading-message">Persoon laden...</p>
      </section>
    )
  }

  if (!person) {
    return (
      <section className="page">
        <BackButton />
        <p className="form-error">{error || 'Persoon niet gevonden.'}</p>
      </section>
    )
  }

  const profile = getMoviePosterUrl(person.profile_path, 'w342')

  // "Known for" ordenen op populariteit voelt het meest logisch voor gebruikers.
  const knownFor = (person.movie_credits?.cast || [])
    .filter((movie) => movie?.id && movie?.title)
    .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
    .slice(0, 8)

  const age = getAge(person.birthday)

  return (
    <section className="person-detail">
      <BackButton />
      <div className="person-detail__layout">
        <aside className="person-detail__sidebar">
          {profile ? (
            <img src={profile} alt={person.name || ''} className="person-detail__photo" />
          ) : (
            <div className="person-detail__photo person-detail__photo--placeholder">[FOTO]</div>
          )}

          <div className="person-detail__known-for">
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

        <div className="person-detail__content">
          <h1>{person.name}</h1>
          <p>{person.biography?.trim() || 'Geen biografie beschikbaar.'}</p>

          <dl className="person-detail__facts">
            <div>
              <dt>Birthday</dt>
              <dd>
                {formatBirthday(person.birthday)}
                {age !== null ? ` (${age} years old)` : ''}
              </dd>
            </div>
            <div>
              <dt>Place of Birth</dt>
              <dd>{person.place_of_birth || '-'}</dd>
            </div>
            <div>
              <dt>Also Known As</dt>
              <dd>
                {person.also_known_as?.length
                  ? person.also_known_as.join(', ')
                  : '-'}
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <p className="person-detail__id">ID: {id}</p>
    </section>
  )
}

export default PersonPage
