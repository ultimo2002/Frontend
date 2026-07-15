// Eén filmkaart in een lijst, plus een grid om meerdere films te tonen
import { Link } from 'react-router-dom'
import { getMoviePosterUrl } from '../services/tmdbService.js'

function FilmListItem({ film, onRemove }) {
  const poster = getMoviePosterUrl(film.posterPath, 'w92')

  function handleRemove(e) {
    e.preventDefault()
    e.stopPropagation()
    onRemove?.(film)
  }

  return (
    <article className="film-card">
      <Link to={`/movie/${film.tmdbId}`} className="film-card__poster">
        {poster ? (
          <img src={poster} alt={film.title || ''} />
        ) : (
          <span>[FOTO]</span>
        )}
      </Link>
      <div className="film-card__info">
        <Link to={`/movie/${film.tmdbId}`}>
          <strong>{film.title || '...'}</strong>
        </Link>
        <span>{film.director || '...'}</span>
      </div>
      <div className="film-card__score">
        <span className="film-card__star">★</span>
        <span>{film.score}</span>
      </div>
      <button
        type="button"
        className="film-card__remove"
        onClick={handleRemove}
        aria-label={`Verwijder ${film.title}`}
      >
        ×
      </button>
    </article>
  )
}

function FilmGrid({ films, onRemoveFilm }) {
  return (
    <div className="film-grid">
      {films.map((film) => (
        <FilmListItem key={film.tmdbId} film={film} onRemove={onRemoveFilm} />
      ))}
    </div>
  )
}

export { FilmListItem, FilmGrid }
