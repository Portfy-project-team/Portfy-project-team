// src/services/dashboardApi.js
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export async function fetchDashboard() {
  const res = await fetch(`${BASE_URL}/api/dashboard`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include', // ← envoie le cookie httpOnly access_token automatiquement
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || `Erreur ${res.status}`)
  }

  const json = await res.json()
  return json.data // { user, stats, pendingProjects, recommendations, recentActivity }
}