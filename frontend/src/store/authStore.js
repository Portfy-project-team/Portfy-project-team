import { defineStore } from 'pinia'
import axios from 'axios'

// CORRECTION 1 : instance Axios centralisée avec withCredentials
// Sans withCredentials:true, les cookies httpOnly ne sont JAMAIS envoyés
// Tout le système d'authentification par cookies serait inutile
const api = axios.create({
  baseURL:         import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true, // indispensable pour les cookies httpOnly
})

// CORRECTION 2 : intercepteur 401 pour refresh automatique du token
// Si le access_token expire (15min), le frontend tente automatiquement
// de le renouveler via /auth/refresh avant de déconnecter l'utilisateur
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/auth/login')
    ) {
      originalRequest._retry = true
      try {
        await api.post('/auth/refresh')
        return api(originalRequest)
      } catch {
        useAuthStore().logout()
      }
    }
    return Promise.reject(error)
  }
)

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user:            null,
    isAuthenticated: false,
  }),

  actions: {

    // CORRECTION 3 : login appelle vraiment l'API backend
    // La version originale stockait juste un objet local sans appeler le backend
    async login(credentials) {
      const response = await api.post('/auth/login', credentials)
      this.user            = response.data.user
      this.isAuthenticated = true
      return response.data
    },

    async register(data) {
      const response = await api.post('/auth/register', data)
      return response.data
    },

    async logout() {
      try {
        await api.post('/auth/logout')
      } catch {
        // Même si l'appel échoue, on déconnecte localement
      } finally {
        this.user            = null
        this.isAuthenticated = false
      }
    },

    async fetchUser() {
      try {
        const response   = await api.get('/user/me')
        this.user            = response.data.user
        this.isAuthenticated = true
      } catch {
        this.user            = null
        this.isAuthenticated = false
      }
    },

    async updateProfile(data) {
      const response = await api.put('/user/me/profile', data)
      this.user      = { ...this.user, ...response.data.user }
      return response.data
    },

    async changePassword(data) {
      const response = await api.patch('/user/change-password', data)
      return response.data
    },

    async uploadAvatar(file) {
      const formData = new FormData()
      formData.append('avatar', file)
      const response   = await api.post('/user/avatar', formData)
      if (this.user) {
        this.user.avatarUrl = response.data.avatarUrl
      }
      return response.data
    },

    async updateNotificationPreferences(preferences) {
      // À implémenter côté backend si nécessaire
      // Pour l'instant on garde en mémoire
      if (this.user) {
        this.user.notifications = preferences
      }
    },
  },

  // Exposer l'instance api pour les autres composants qui en ont besoin
  getters: {
    isAdmin:   (state) => state.user?.role === 'ADMIN',
    isStudent: (state) => state.user?.role === 'STUDENT',
    isProf:    (state) => state.user?.role === 'PROF',
    isPro:     (state) => state.user?.role === 'PRO',
  }
})

// Export de l'instance api pour les autres composants
export { api }