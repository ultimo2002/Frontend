const NOVI_API_BASE_URL =
  import.meta.env.VITE_NOVI_API_BASE_URL ||
  'https://novi-backend-api-wgsgz.ondigitalocean.app'

const NOVI_API_KEY = import.meta.env.VITE_NOVI_API_KEY || ''
const NOVI_PROJECT_ID = import.meta.env.VITE_NOVI_PROJECT_ID || ''

export {
  NOVI_API_BASE_URL,
  NOVI_API_KEY,
  NOVI_PROJECT_ID,
}
