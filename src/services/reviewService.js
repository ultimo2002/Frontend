// Reviews en scores ophalen, opslaan en verwijderen
import { SEEN_LIST_NAME } from '../constants/api.js'
import { addFilmToNamedList } from './listService.js'
import { authenticatedRequest } from './api.js'

function asArray(data) {
  return Array.isArray(data) ? data : []
}

function buildQuery(params) {
  return new URLSearchParams(
    Object.fromEntries(
      Object.entries(params).filter(([, value]) => value !== undefined && value !== null),
    ),
  ).toString()
}

function nextId(items) {
  if (!items.length) return 1
  return Math.max(...items.map((item) => item.id)) + 1
}

// Pak de nieuwste review van de ingelogde gebruiker voor deze film
export async function getUserReview(token, userId, tmdbId) {
  const reviews = await getMovieReviews(token, tmdbId)
  const ownReviews = reviews.filter((review) => String(review.userId) === String(userId))

  if (!ownReviews.length) {
    return null
  }

  return ownReviews.reduce((latest, review) => (review.id > latest.id ? review : latest))
}

export async function getMovieReviews(token, tmdbId) {
  const query = buildQuery({ tmdbId })
  const data = await authenticatedRequest(`/api/reviews?${query}`, token)
  return asArray(data)
}

export async function saveReview(token, userId, tmdbId, { score, review }) {
  const existing = await getUserReview(token, userId, tmdbId)
  const payload = {
    score: Number(score),
    review: review.trim(),
  }

  let result

  if (existing) {
    result = await authenticatedRequest(`/api/reviews/${existing.id}`, token, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    })
  } else {
    const allReviews = await authenticatedRequest('/api/reviews', token).then(asArray)

    result = await authenticatedRequest('/api/reviews', token, {
      method: 'POST',
      body: JSON.stringify({
        id: nextId(allReviews),
        userId,
        tmdbId: Number(tmdbId),
        ...payload,
      }),
    })
  }

  // Een review betekent automatisch dat je de film hebt gezien
  await addFilmToNamedList(token, userId, SEEN_LIST_NAME, tmdbId)

  return result
}

export async function deleteReviewById(token, reviewId) {
  return authenticatedRequest(`/api/reviews/${reviewId}`, token, {
    method: 'DELETE',
  })
}

export async function deleteReview(token, userId, tmdbId) {
  const reviews = await getMovieReviews(token, tmdbId)
  const ownReviews = reviews.filter((review) => String(review.userId) === String(userId))

  if (!ownReviews.length) {
    return
  }

  await Promise.all(ownReviews.map((review) => deleteReviewById(token, review.id)))
}
