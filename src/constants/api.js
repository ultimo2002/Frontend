// API-configuratie en vaste lijstnamen
const NOVI_API_BASE_URL =
  import.meta.env.VITE_NOVI_API_BASE_URL ||
  'https://novi-backend-api-wgsgz.ondigitalocean.app'

const NOVI_PROJECT_ID = import.meta.env.VITE_NOVI_PROJECT_ID || ''
const TMDB_API_BASE_URL =
  import.meta.env.VITE_TMDB_API_BASE_URL || 'https://api.themoviedb.org/3'

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY || ''

// Systeemlijsten die niet in de gewone lijsten-pagina horen
const SEEN_LIST_NAME = 'Gezien'
const FAVORITES_LIST_NAME = 'Favorieten'
const SYSTEM_LIST_NAMES = [SEEN_LIST_NAME, FAVORITES_LIST_NAME]

export {
  NOVI_API_BASE_URL,
  NOVI_PROJECT_ID,
  TMDB_API_BASE_URL,
  TMDB_API_KEY,
  SEEN_LIST_NAME,
  FAVORITES_LIST_NAME,
  SYSTEM_LIST_NAMES,
}
