// Eigen lijsten beheren (aanmaken, hernoemen, verwijderen, films bekijken)
import { useCallback, useEffect, useState } from 'react'
import BackButton from '../components/BackButton.jsx'
import { FilmGrid } from '../components/FilmListItem.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { SYSTEM_LIST_NAMES } from '../constants/api.js'
import {
  createUserList,
  deleteUserListWithItems,
  fetchListItems,
  fetchUserLists,
  getUserId,
  removeListItem,
  updateUserList,
} from '../services/listService.js'
import { getUserReview } from '../services/reviewService.js'
import { fetchMovieListItem } from '../services/tmdbService.js'

function ListsPage() {
  const { token, user } = useAuth()
  const userId = getUserId(user)

  const [lists, setLists] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [listItems, setListItems] = useState([])
  const [displayFilms, setDisplayFilms] = useState([])
  const [newListName, setNewListName] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [renameValue, setRenameValue] = useState('')
  const [loadingLists, setLoadingLists] = useState(true)
  const [loadingFilms, setLoadingFilms] = useState(false)
  const [error, setError] = useState('')

  const selectedList = lists.find((list) => list.id === selectedId) || lists[0]

  const loadLists = useCallback(async () => {
    setLoadingLists(true)
    setError('')

    try {
      const userLists = await fetchUserLists(token, userId)
      // Gezien en Favorieten hebben hun eigen pagina
      const customLists = userLists.filter((list) => !SYSTEM_LIST_NAMES.includes(list.name))

      setLists(customLists)

      if (customLists.length > 0) {
        setSelectedId((current) =>
          customLists.some((list) => list.id === current) ? current : customLists[0].id,
        )
      } else {
        setSelectedId(null)
        setListItems([])
        setDisplayFilms([])
      }
    } catch (err) {
      setError(err.message)
      setLists([])
    } finally {
      setLoadingLists(false)
    }
  }, [token, userId])

  useEffect(() => {
    loadLists()
  }, [loadLists])

  // Laad films wanneer je een andere lijst selecteert
  useEffect(() => {
    if (!selectedList) return undefined

    let cancelled = false

    async function loadFilms() {
      setLoadingFilms(true)
      setError('')

      try {
        const items = await fetchListItems(token, selectedList.id)

        if (cancelled) return

        setListItems(items)

        if (!items.length) {
          setDisplayFilms([])
          return
        }

        const enriched = await Promise.all(
          items.map(async (item) => {
            const review = await getUserReview(token, userId, item.tmdbId)
            return fetchMovieListItem(item.tmdbId, review?.score ?? null)
          }),
        )

        if (!cancelled) {
          setDisplayFilms(enriched)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setDisplayFilms([])
        }
      } finally {
        if (!cancelled) {
          setLoadingFilms(false)
        }
      }
    }

    loadFilms()

    return () => {
      cancelled = true
    }
  }, [selectedList, token, userId])

  async function handleCreateList(e) {
    e.preventDefault()

    const name = newListName.trim()
    if (!name) {
      setError('Vul een lijstnaam in.')
      return
    }

    setError('')

    try {
      const userLists = await fetchUserLists(token, userId)
      const listId = userLists.reduce((max, list) => Math.max(max, list.listId || 0), 99) + 1
      const created = await createUserList(token, { userId, listId, name })

      setNewListName('')
      await loadLists()
      setSelectedId(created.id)
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleDeleteList(list) {
    setError('')

    try {
      await deleteUserListWithItems(token, list)
      await loadLists()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleRename() {
    const name = renameValue.trim()

    if (!name || name === selectedList.name) {
      setEditingName(false)
      return
    }

    setError('')

    try {
      await updateUserList(token, selectedList.id, { name })
      setEditingName(false)
      await loadLists()
    } catch (err) {
      setError(err.message)
    }
  }

  async function handleRemoveFilm(film) {
    const item = listItems.find((entry) => entry.tmdbId === film.tmdbId)
    if (!item) return

    setError('')

    try {
      await removeListItem(token, item.id)
      setListItems((current) => current.filter((entry) => entry.id !== item.id))
      setDisplayFilms((current) => current.filter((entry) => entry.tmdbId !== film.tmdbId))
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <section className="lists-page">
      <BackButton />
      <h1>Lijsten</h1>

      <form className="lists-page__create" onSubmit={handleCreateList}>
        <input
          type="text"
          placeholder="Nieuwe lijst"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
          maxLength={100}
        />
        <button type="submit">Toevoegen</button>
      </form>

      {error && <p className="form-error">{error}</p>}
      {loadingLists && <p>Lijsten laden...</p>}

      {!loadingLists && lists.length === 0 && (
        <p>Nog geen lijsten. Maak er een aan met het formulier hierboven.</p>
      )}

      {lists.length > 0 && (
        <div className="lists-page__layout">
          <aside className="lists-sidebar">
            {lists.map((list) => (
              <div key={list.id} className="lists-sidebar__item">
                <button
                  type="button"
                  className={`lists-sidebar__link${
                    selectedList?.id === list.id ? ' lists-sidebar__link--active' : ''
                  }`}
                  onClick={() => setSelectedId(list.id)}
                >
                  {list.name} &gt;
                </button>
                <button
                  type="button"
                  className="lists-sidebar__delete"
                  onClick={() => handleDeleteList(list)}
                  aria-label={`Verwijder lijst ${list.name}`}
                >
                  ×
                </button>
              </div>
            ))}
          </aside>

          <div className="lists-content">
            <div className="lists-content__header">
              {editingName ? (
                <div className="lists-content__rename">
                  <input
                    type="text"
                    value={renameValue}
                    onChange={(e) => setRenameValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleRename()}
                    maxLength={100}
                  />
                  <button type="button" onClick={handleRename}>
                    ✓
                  </button>
                </div>
              ) : (
                <h2>{selectedList?.name}</h2>
              )}
              <div className="lists-content__actions">
                <button
                  type="button"
                  className="icon-btn"
                  onClick={() => {
                    setRenameValue(selectedList?.name || '')
                    setEditingName(true)
                  }}
                  aria-label="Lijst hernoemen"
                >
                  ✎
                </button>
                <button
                  type="button"
                  className="icon-btn icon-btn--delete"
                  onClick={() => handleDeleteList(selectedList)}
                  aria-label="Lijst verwijderen"
                >
                  ×
                </button>
              </div>
            </div>

            {loadingFilms && <p>Films laden...</p>}

            {selectedList && !loadingFilms && (
              <FilmGrid films={displayFilms} onRemoveFilm={handleRemoveFilm} />
            )}
          </div>
        </div>
      )}
    </section>
  )
}

export default ListsPage
