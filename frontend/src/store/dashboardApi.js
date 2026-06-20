import { api } from './authStore.js'

export async function fetchDashboard() {
  const res = await api.get('/dashboard')
  return res.data.data // { user, stats, pendingProjects, recommendations, recentActivity }
}
