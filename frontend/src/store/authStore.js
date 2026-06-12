// src/store/authStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const BASE_URL = '/api'

// ── Instance axios partagée ───────────────────────────────────────
// Importez-la dans vos services : import { api } from '@/store/authStore.js'
export const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // envoie le cookie httpOnly automatiquement
})

// Intercepteur : si le token expire, tente un refresh, sinon déconnecte
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await axios.post(`${BASE_URL}/auth/refresh`, {}, { withCredentials: true })
        return api(original) // rejoue la requête
      } catch {
        // Refresh échoué → déconnexion
        localStorage.removeItem('portfy_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const useAuthStore = defineStore('auth', () => {
  // ── State ─────────────────────────────────────────────────────
  const user            = ref(JSON.parse(localStorage.getItem('portfy_user') || 'null'))
  const isAuthenticated = ref(!!user.value)

  // ── Actions ───────────────────────────────────────────────────
  function login(userData) {
    user.value            = userData
    isAuthenticated.value = true
    localStorage.setItem('portfy_user', JSON.stringify(userData))
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } catch (_) {}
    user.value            = null
    isAuthenticated.value = false
    localStorage.removeItem('portfy_user')
  }

  // ── Getters ───────────────────────────────────────────────────
  const displayName = computed(() => {
    if (!user.value) return 'Utilisateur'
    const prenom = user.value.prenom || user.value.firstName || ''
    const nom    = user.value.nom    || user.value.lastName || user.value.name || ''
    return `${prenom} ${nom}`.trim() || user.value.email || 'Utilisateur'
  })

  const initials = computed(() => {
    if (!user.value) return 'U'
    const p = (user.value.prenom || user.value.firstName)?.[0] || ''
    const n = (user.value.nom || user.value.lastName || user.value.name)?.[0] || ''
    return (p + n).toUpperCase() || user.value.email?.[0].toUpperCase() || 'U'
  })

  return { user, isAuthenticated, displayName, initials, login, logout }
})