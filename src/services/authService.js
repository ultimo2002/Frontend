// Login en registratie via de NOVI API
import { noviRequest } from './api.js'

export async function signIn(email, password) {
  return noviRequest('/api/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function signUp(email, password) {
  return noviRequest('/api/users', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      roles: ['user'],
    }),
  })
}
