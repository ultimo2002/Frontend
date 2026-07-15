// Gebruikers ophalen en e-mailadressen tonen bij reviews
import { authenticatedRequest } from './api.js'

function asArray(data) {
  return Array.isArray(data) ? data : []
}

export async function fetchUsers(token) {
  const data = await authenticatedRequest('/api/users', token)
  return asArray(data)
}

// Zet userId om naar e-mail, handig voor de recensielijst
export function buildUserEmailMap(users) {
  return users.reduce((map, user) => {
    map[String(user.id)] = user.email
    return map
  }, {})
}

export function getReviewerEmail(userId, emailByUserId) {
  const key = String(userId)

  if (emailByUserId[key]) {
    return emailByUserId[key]
  }

  // Oudere data gebruikt soms het e-mailadres direct als userId
  if (key.includes('@')) {
    return key
  }

  return `Gebruiker ${key}`
}
