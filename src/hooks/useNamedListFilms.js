// Herbruikbare hook om films van een lijst op te halen (Favorieten, Gezien)
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext.jsx'
import {
  ensureUserList,
  fetchListItems,
  fetchUserLists,
  getUserId,
} from '../services/listService.js'
import { getUserReview } from '../services/reviewService.js'
import { fetchMovieListItem } from '../services/tmdbService.js'

export function useNamedListFilms(listName, { createIfMissing = false } = {}) {
  const { token, user } = useAuth()
  const userId = getUserId(user)
  const [films, setFilms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token || !userId) {
      setFilms([])
      setLoading(false)
      return undefined
    }

    let cancelled = false

    async function load() {
      setLoading(true)
      setError('')

      try {
        const userList = createIfMissing
          ? await ensureUserList(token, userId, listName)
          : (await fetchUserLists(token, userId)).find((list) => list.name === listName)

        if (!userList) {
          if (!cancelled) {
            setFilms([])
          }
          return
        }

        const items = await fetchListItems(token, userList.id)

        // Combineer NOVI-lijst met TMDB-filmdata en de score van de gebruiker
        const enriched = await Promise.all(
          items.map(async (item) => {
            const review = await getUserReview(token, userId, item.tmdbId)
            return fetchMovieListItem(item.tmdbId, review?.score ?? 5)
          }),
        )

        if (!cancelled) {
          setFilms(enriched)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setFilms([])
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    load()

    // Voorkom dat oude requests de state overschrijven bij snel wisselen
    return () => {
      cancelled = true
    }
  }, [token, userId, listName, createIfMissing])

  return { films, loading, error, setFilms }
}
