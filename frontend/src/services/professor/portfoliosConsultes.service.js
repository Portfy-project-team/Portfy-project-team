import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:3000',
  withCredentials: true, // envoie le cookie httpOnly automatiquement
})

export const portfoliosConsultesService = {
  getAll: (params = {}) =>
    API.get('/professor/portfolios-consultes', { params }),

  getStats: () =>
    API.get('/professor/portfolios-consultes/stats'),

  recordVisit: (portfolioId) =>
    API.post(`/professor/portfolios-consultes/${portfolioId}/visit`),

  toggleBookmark: (portfolioId) =>
    API.patch(`/professor/portfolios-consultes/${portfolioId}/bookmark`),
}