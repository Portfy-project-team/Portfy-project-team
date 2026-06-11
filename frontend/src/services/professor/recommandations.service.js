import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true,
})

export const recommandationsService = {
  getAll: (params = {}) =>
    API.get('/professor/recommandations', { params }),

  getStats: () =>
    API.get('/professor/recommandations/stats'),

  create: (data) =>
    API.post('/professor/recommandations', data),

  update: (id, data) =>
    API.patch(`/professor/recommandations/${id}`, data),

  delete: (id) =>
    API.delete(`/professor/recommandations/${id}`),
}