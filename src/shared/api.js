const BASE_URL = process.env.VUE_APP_API_BASE_URL
const API_KEY = process.env.VUE_APP_API_KEY

export async function apiFetch(endpoint, options = {}) {
  return fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-Api-Key': API_KEY,
      ...(options.headers || {})
    }
  })
}
