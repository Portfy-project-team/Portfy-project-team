const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

function getToken() {
  return localStorage.getItem('token')
}

export async function fetchDashboard() {
  const res = await fetch(`${BASE_URL}/dashboard`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    credentials: 'include',
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.message || 'Erreur serveur')
  }

  const json = await res.json()
  return json.data  // { user, stats, pendingProjects, recommendations, recentActivity }
}