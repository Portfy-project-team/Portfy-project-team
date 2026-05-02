import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api'
});

// Ajoute le token JWT automatiquement à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Si token expiré → déconnecte et redirige vers /login
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('utilisateur');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  inscription:  (data) => api.post('/auth/register', data),
  connexion:    (data) => api.post('/auth/login', data),
  getProfil:    ()     => api.get('/auth/profile'),
  updateProfil: (data) => api.put('/auth/profile', data)
};

export const projetService = {
  creer:         (data)       => api.post('/projects', data),
  getMesProjets: ()           => api.get('/projects/mes-projets'),
  getEnAttente:  ()           => api.get('/projects/en-attente'),
  valider:       (id, data)   => api.put(`/projects/${id}/valider`, data),
  getPortfolio:  (etudiantId) => api.get(`/projects/portfolio/${etudiantId}`)
};

export default api;