// frontend/src/services/dashboardApi.js

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

function getToken() {
  return localStorage.getItem('token')
}

export async function fetchDashboard() {
  const token = getToken()
  if (!token) throw new Error('Non authentifié')

  const res = await fetch(`${BASE_URL}/api/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.message ?? `Erreur ${res.status}`)
  }

  const json = await res.json()
  return json.data
}