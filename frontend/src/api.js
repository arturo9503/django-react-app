export const API = 'http://localhost:8000/api'

export function authHeaders(token) {
  return { 'Content-Type': 'application/json', 'Authorization': `Token ${token}` }
}
