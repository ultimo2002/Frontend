// Alles rond lijsten: aanmaken, films toevoegen, verwijderen
import { authenticatedRequest } from './api.js'

function asArray(data) {
  return Array.isArray(data) ? data : []
}

// NOVI verwacht dat we zelf een nieuw id meesturen
function nextId(items) {
  if (!items.length) return 1
  return Math.max(...items.map((item) => item.id)) + 1
}

export function getUserId(user) {
  if (user?.id === undefined || user?.id === null) {
    return ''
  }

  return String(user.id)
}

export async function fetchAllUserLists(token) {
  const data = await authenticatedRequest('/api/userLists', token)
  return asArray(data)
}

// Filter op de ingelogde gebruiker
export async function fetchUserLists(token, userId) {
  const allLists = await fetchAllUserLists(token)
  return allLists.filter((list) => String(list.userId) === String(userId))
}

export async function fetchListItems(token, userListId) {
  const data = await authenticatedRequest(`/api/userLists/${userListId}/lists`, token)
  return asArray(data)
}

export async function createUserList(token, { userId, listId, name }) {
  const existing = await fetchAllUserLists(token)

  return authenticatedRequest('/api/userLists', token, {
    method: 'POST',
    body: JSON.stringify({
      id: nextId(existing),
      userId,
      listId,
      name,
    }),
  })
}

export async function updateUserList(token, id, updates) {
  return authenticatedRequest(`/api/userLists/${id}`, token, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  })
}

export async function deleteUserList(token, id) {
  return authenticatedRequest(`/api/userLists/${id}`, token, {
    method: 'DELETE',
  })
}

export async function addListItem(token, { userListId, tmdbId }) {
  const existing = await authenticatedRequest('/api/lists', token).then(asArray)

  return authenticatedRequest('/api/lists', token, {
    method: 'POST',
    body: JSON.stringify({
      id: nextId(existing),
      listId: userListId,
      tmdbId: Number(tmdbId),
    }),
  })
}

export async function removeListItem(token, id) {
  return authenticatedRequest(`/api/lists/${id}`, token, {
    method: 'DELETE',
  })
}

// Maak een lijst aan als die nog niet bestaat (bijv. Favorieten of Gezien)
export async function ensureUserList(token, userId, name) {
  const userLists = await fetchUserLists(token, userId)
  const found = userLists.find((list) => list.name === name)

  if (found) return found

  const allLists = await fetchAllUserLists(token)
  const listId = allLists.reduce((max, list) => Math.max(max, list.listId || 0), 99) + 1

  return createUserList(token, { userId, listId, name })
}

// Eerst alle films eruit, dan pas de lijst zelf verwijderen
export async function deleteUserListWithItems(token, userList) {
  const items = await fetchListItems(token, userList.id)

  await Promise.all(items.map((item) => removeListItem(token, item.id)))
  await deleteUserList(token, userList.id)
}

export async function addFilmToNamedList(token, userId, listName, tmdbId) {
  const userList = await ensureUserList(token, userId, listName)
  const items = await fetchListItems(token, userList.id)

  // Niet dubbel toevoegen
  if (items.some((item) => item.tmdbId === Number(tmdbId))) {
    return
  }

  await addListItem(token, { userListId: userList.id, tmdbId })
}

export async function removeFilmFromNamedList(token, userId, listName, tmdbId) {
  const userLists = await fetchUserLists(token, userId)
  const userList = userLists.find((list) => list.name === listName)

  if (!userList) return

  const items = await fetchListItems(token, userList.id)
  const item = items.find((entry) => entry.tmdbId === Number(tmdbId))

  if (item) {
    await removeListItem(token, item.id)
  }
}

export async function isFilmInList(token, userId, listName, tmdbId) {
  const userLists = await fetchUserLists(token, userId)
  const userList = userLists.find((list) => list.name === listName)

  if (!userList) return false

  const items = await fetchListItems(token, userList.id)
  return items.some((item) => item.tmdbId === Number(tmdbId))
}
