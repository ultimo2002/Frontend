// Basis fetch-logica voor de NOVI API
import {
  NOVI_API_BASE_URL,
  NOVI_PROJECT_ID,
} from '../constants/api.js'

function noviHeaders(extra = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...extra,
  }

  // NOVI heeft dit nodig om te weten welk project je aanroept
  if (NOVI_PROJECT_ID) {
    headers['novi-education-project-id'] = NOVI_PROJECT_ID
  }

  return headers
}

async function parseResponse(response) {
  const text = await response.text()
  let data = {}

  try {
    data = text ? JSON.parse(text) : {}
  } catch {
    // Soms geeft de API geen JSON terug bij een fout
    if (!response.ok) {
      throw new Error(text || 'Request mislukt')
    }
    return {}
  }

  if (!response.ok) {
    const message = data.message || data.error || text || 'Request mislukt'
    throw new Error(message)
  }

  return data
}

// Voor publieke calls (login, register) met de project API-key
export async function noviRequest(path, options = {}) {
  const headers = noviHeaders(options.headers)

  /*if (NOVI_API_KEY) {
    headers.Authorization = `Bearer ${NOVI_API_KEY}`
  }
  */

  const response = await fetch(`${NOVI_API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  return parseResponse(response)
}

// Voor ingelogde calls met het JWT-token van de gebruiker
export async function authenticatedRequest(path, token, options = {}) {
  const headers = noviHeaders({
    Authorization: `Bearer ${token}`,
    ...options.headers,
  })

  const response = await fetch(`${NOVI_API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  return parseResponse(response)
}
