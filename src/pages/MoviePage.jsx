// Filmpagina — details, lijsten, reviews en scores
import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import BackButton from '../components/BackButton.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { FAVORITES_LIST_NAME, SEEN_LIST_NAME, SYSTEM_LIST_NAMES } from '../constants/api.js'
import {
  addFilmToNamedList,
  fetchUserLists,
  getUserId,
  isFilmInList,
  removeFilmFromNamedList,
} from '../services/listService.js'
import {
  deleteReview,
  deleteReviewById,
  getMovieReviews,
  getUserReview,
  saveReview,
} from '../services/reviewService.js'
import { getMovieById, getMoviePosterUrl } from '../services/tmdbService.js'
import { buildUserEmailMap, fetchUsers, getReviewerEmail } from '../services/userService.js'

function formatMoney(amount) {
  if (!amount) return '-'
  return new Intl.NumberFormat('nl-NL', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

function MoviePage() {
  const { id } = useParams()
  const { token, user } = useAuth()
  const userId = getUserId(user)

  const [movie, setMovie] = useState(null)
  const [score, setScore] = useState(5)
  const [review, setReview] = useState('')
  const [allReviews, setAllReviews] = useState([])
  const [userEmailMap, setUserEmailMap] = useState({})
  const [hasOwnReview, setHasOwnReview] = useState(false)
  const [isGezien, setIsGezien] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)
  const [customLists, setCustomLists] = useState([])
  const [selectedListId, setSelectedListId] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(true)

  const isOwnReview = useCallback(
    (entry) => String(entry.userId) === String(userId),
    [userId],
  )

  const loadReviews = useCallback(async () => {
    const [reviewData, movieReviews] = await Promise.all([
      getUserReview(token, userId, id),
      getMovieReviews(token, id),
    ])

    setAllReviews(movieReviews)
    setHasOwnReview(Boolean(reviewData))
    setScore(reviewData?.score ?? 5)
    setReview(reviewData?.review ?? '')

    return reviewData
  }, [token, userId, id])

  useEffect(() => {
    async function loadMovie() {
      setLoading(true)
      setError('')

      try {
        const data = await getMovieById(id)
        setMovie(data)

        // Alles tegelijk ophalen zodat de pagina in één keer klaar is
        const [, seen, favorite, userLists, users] = await Promise.all([
          loadReviews(),
          isFilmInList(token, userId, SEEN_LIST_NAME, id),
          isFilmInList(token, userId, FAVORITES_LIST_NAME, id),
          fetchUserLists(token, userId),
          fetchUsers(token),
        ])

        setUserEmailMap(buildUserEmailMap(users))

        setIsGezien(seen)
        setIsFavorite(favorite)
        setCustomLists(userLists.filter((list) => !SYSTEM_LIST_NAMES.includes(list.name)))
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    loadMovie()
  }, [id, token, userId, loadReviews])

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    try {
      await saveReview(token, userId, id, {
        score: Number(score),
        review: review.trim(),
      })
      await loadReviews()
      setIsGezien(true)
      setSuccess(hasOwnReview ? 'Recensie bijgewerkt' : 'Recensie opgeslagen')
    } catch (err) {
      setError(err.message)
    }
  }

  function handleStartEdit(entry) {
    setScore(entry.score)
    setReview(entry.review ?? '')
    setError('')
    setSuccess('')
  }

  async function handleDeleteReview(reviewId) {
    setError('')
    setSuccess('')

    try {
      if (reviewId) {
        await deleteReviewById(token, reviewId)
      } else {
        await deleteReview(token, userId, id)
      }

      setScore(5)
      setReview('')
      await loadReviews()
      setSuccess('Recensie verwijderd')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleGezienChange(checked) {
    setError('')
    setSuccess('')

    try {
      if (checked) {
        await addFilmToNamedList(token, userId, SEEN_LIST_NAME, id)
        setSuccess('Toegevoegd aan gezien')
      } else {
        await removeFilmFromNamedList(token, userId, SEEN_LIST_NAME, id)
        setSuccess('Verwijderd uit gezien')
      }

      setIsGezien(checked)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleFavoriteToggle() {
    setError('')
    setSuccess('')

    try {
      if (isFavorite) {
        await removeFilmFromNamedList(token, userId, FAVORITES_LIST_NAME, id)
      } else {
        await addFilmToNamedList(token, userId, FAVORITES_LIST_NAME, id)
      }

      setIsFavorite(!isFavorite)
      setSuccess(isFavorite ? 'Verwijderd uit favorieten' : 'Toegevoegd aan favorieten')
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleAddToList() {
    const list = customLists.find((entry) => String(entry.id) === selectedListId)
    if (!list) return

    setError('')
    setSuccess('')

    try {
      await addFilmToNamedList(token, userId, list.name, id)
      setSuccess(`Toegevoegd aan ${list.name}`)
      setSelectedListId('')
    } catch (err) {
      setError(err.message)
    }
  }

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
            <label className="movie-detail__seen">
              <input
                type="checkbox"
                checked={isGezien}
                onChange={(e) => handleGezienChange(e.target.checked)}
              />
              Gezien
            </label>
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
                {/* Cast-naam is klikbaar naar de nieuwe acteurspagina */}
                <Link to={`/actor/${person.id}`} className="movie-detail__cast-link">
                  &gt; {person.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="movie-detail__actions">
        <div className="movie-detail__list-actions">
          <button type="button" className="btn" onClick={handleFavoriteToggle}>
            {isFavorite ? 'Verwijder uit favorieten' : 'Voeg toe aan favorieten'}
          </button>

          {customLists.length > 0 && (
            <div className="movie-detail__add-list">
              <select
                value={selectedListId}
                onChange={(e) => setSelectedListId(e.target.value)}
              >
                <option value="">Voeg toe aan lijst...</option>
                {customLists.map((list) => (
                  <option key={list.id} value={list.id}>
                    {list.name}
                  </option>
                ))}
              </select>
              <button type="button" className="btn" onClick={handleAddToList} disabled={!selectedListId}>
                Toevoegen
              </button>
            </div>
          )}
        </div>

        <div className="movie-detail__review-section">
          <form className="movie-detail__review" onSubmit={handleSave}>
            <textarea
              rows="5"
              placeholder="Schrijf een recensie..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              maxLength={1000}
            />
            <div className="movie-detail__review-footer">
              <label className="movie-detail__score-input">
                Score:
                <span className="movie-detail__star">★</span>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                />
              </label>
              <div className="movie-detail__review-buttons">
                <button type="submit" className="btn">
                  {hasOwnReview ? 'Bijwerken' : 'Opslaan'}
                </button>
                {hasOwnReview && (
                  <button type="button" className="btn btn--danger" onClick={handleDeleteReview}>
                    Verwijderen
                  </button>
                )}
              </div>
            </div>
            {error && <p className="form-error">{error}</p>}
            {success && <p className="form-success">{success}</p>}
          </form>

          <section className="movie-detail__reviews-list">
            <h2>Recensies ({allReviews.length})</h2>

            {allReviews.length === 0 ? (
              <p>Nog geen recensies.</p>
            ) : (
              <ul className="movie-detail__reviews-scroll">
                {allReviews.map((entry) => (
                  <li key={entry.id} className="movie-detail__review-item">
                    <div className="movie-detail__review-item-header">
                      <strong>{getReviewerEmail(entry.userId, userEmailMap)}</strong>
                      <span className="movie-detail__review-item-score">
                        <span className="movie-detail__star">★</span> {entry.score}
                      </span>
                    </div>
                    <p className="movie-detail__review-item-text">
                      {entry.review?.trim() || 'Geen tekst.'}
                    </p>
                    {isOwnReview(entry) && (
                      <div className="movie-detail__review-item-actions">
                        <button type="button" className="btn" onClick={() => handleStartEdit(entry)}>
                          Bewerken
                        </button>
                        <button type="button" className="btn btn--danger" onClick={() => handleDeleteReview(entry.id)}>
                          Verwijderen
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>

      <p className="movie-detail__id">ID: {id}</p>
    </section>
  )
}

export default MoviePage
