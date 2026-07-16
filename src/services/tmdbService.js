// TMDB API: films en acteurs zoeken, details ophalen
import { TMDB_API_BASE_URL, TMDB_API_KEY } from '../constants/api.js'

async function tmdbRequest(path, params = {}) {
  if (!TMDB_API_KEY) {
    throw new Error('Geen TMDB API-key gevonden.')
  }

  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
    language: 'nl-NL',
    ...params,
  })

  const response = await fetch(`${TMDB_API_BASE_URL}${path}?${searchParams}`)

  if (!response.ok) {
    throw new Error('TMDB-verzoek mislukt.')
  }

  return response.json()
}

export function searchMovies(query) {
  return tmdbRequest('/search/movie', { query })
}

export function searchPeople(query) {
  return tmdbRequest('/search/person', { query })
}

export function getMovieById(movieId) {
  return tmdbRequest(`/movie/${movieId}`, {
    append_to_response: 'credits',
  })
}

export function getMovieCredits(movieId) {
  return tmdbRequest(`/movie/${movieId}/credits`)
}

export async function getPersonById(personId) {
  const person = await tmdbRequest(`/person/${personId}`, {
    append_to_response: 'movie_credits',
  })

  // Veel acteurs hebben geen NL-biografie; dan Engels ophalen
  if (!person.biography?.trim()) {
    const english = await tmdbRequest(`/person/${personId}`, {
      language: 'en-US',
    })
    person.biography = english.biography
  }

  return person
}

export function getMoviePosterUrl(posterPath, size = 'w342') {
  if (!posterPath) return null
  return `https://image.tmdb.org/t/p/${size}${posterPath}`
}

function getDirectorName(movie) {
  const director = movie.credits?.crew?.find((person) => person.job === 'Director')
  return director?.name || '-'
}

// Zet ruwe TMDB-data om naar het formaat dat onze lijsten gebruiken
export function mapMovieToListItem(movie, score = null) {
  return {
    tmdbId: movie.id,
    title: movie.title,
    director: getDirectorName(movie),
    posterPath: movie.poster_path,
    score,
  }
}

export async function fetchMovieListItem(tmdbId, score = null) {
  const movie = await getMovieById(tmdbId)
  return mapMovieToListItem(movie, score)
}
