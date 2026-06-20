import { api } from '../../store/authStore.js'

export const searchService = {
  search: (q, limit = 8) =>
    api.get('/search', { params: { q, limit } }),
}