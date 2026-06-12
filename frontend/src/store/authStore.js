// src/store/authStore.js
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL || ''
//                                               ↑ vide = proxy Vite

export const api = axios.create({
  baseURL: `${BASE_URL}/api`,
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await axios.post('/api/auth/refresh', {}, { withCredentials: true })
        return api(original)
      } catch {
        localStorage.removeItem('portfy_user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

export const useAuthStore = defineStore('auth', () => {
  const user            = ref(JSON.parse(localStorage.getItem('portfy_user') || 'null'))
  const isAuthenticated = ref(!!user.value)

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

  const displayName = computed(() => {
    if (!user.value) return 'Professeur'
    const prenom = user.value.prenom || ''
    const nom    = user.value.nom    || user.value.name || ''
    if (prenom) return `${prenom[0]}. ${nom}`.trim()
    return nom || 'Professeur'
  })

  const initials = computed(() => {
    if (!user.value) return 'PR'
    const p = user.value.prenom?.[0] || ''
    const n = (user.value.nom || user.value.name)?.[0] || ''
    return (p + n).toUpperCase() || 'PR'
  })

  return { user, isAuthenticated, displayName, initials, login, logout }
})